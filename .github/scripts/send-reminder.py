#!/usr/bin/env python3
"""
Monthly timesheet reminder.
Calls the Render API to generate + export the timesheet, then emails it via Gmail.
Triggered by GitHub Actions on the 26th of every month.
All config comes from GitHub Secrets / Variables — nothing is hardcoded.
"""
import os
import smtplib
import time
from datetime import datetime
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests

MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]


def main():
    gmail_user      = os.environ['GMAIL_USER']
    gmail_password  = os.environ['GMAIL_APP_PASSWORD']
    employee_name   = os.environ['EMPLOYEE_NAME']
    employee_number = os.environ['EMPLOYEE_NUMBER']
    client_name     = os.environ['CLIENT_NAME']
    render_url      = os.environ.get('RENDER_URL', 'https://recro-ts-generator.onrender.com').rstrip('/')

    now = datetime.now()
    year, month = now.year, now.month
    month_name = MONTH_NAMES[month - 1]

    print(f"Generating timesheet for {month_name} {year}...")

    # Step 1: Generate rows — retry up to 3 times to handle Render cold-start
    rows = None
    for attempt in range(3):
        try:
            r = requests.get(
                f'{render_url}/api/generate',
                params={'year': year, 'month': month, 'holidays': 'true'},
                timeout=90,
            )
            r.raise_for_status()
            rows = r.json()['rows']
            break
        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
            if attempt == 2:
                raise RuntimeError(f"Render API unreachable after 3 attempts: {e}") from e
            print(f"Attempt {attempt + 1} failed ({e}), retrying in 20s...")
            time.sleep(20)

    print(f"Generated {len(rows)} rows.")

    # Step 2: Export to Excel
    export_resp = requests.post(
        f'{render_url}/api/export',
        json={
            'year': year,
            'month': month,
            'rows': rows,
            'employee': {
                'number': employee_number,
                'name': employee_name,
                'client': client_name,
            },
        },
        timeout=60,
    )
    export_resp.raise_for_status()
    excel_bytes = export_resp.content
    filename = f"{employee_name} Timesheet {month_name} {year}.xlsx"
    print(f"Exported {len(excel_bytes):,} bytes → '{filename}'")

    # Step 3: Compose email
    subject = f"Timesheet Reminder – {month_name} {year}"
    body = (
        f"Hi,\n\n"
        f"This is your monthly reminder to send your timesheet to your manager.\n\n"
        f"The default {month_name} {year} timesheet has been attached with NSE holidays "
        f"(assuming no leaves were taken).\n\n"
        f"If you took any leaves or wish to make changes to your timesheet, visit:\n"
        f"{render_url}/\n\n"
        f"Have a great day!"
    )

    msg = MIMEMultipart()
    msg['From']    = gmail_user
    msg['To']      = gmail_user
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    part = MIMEBase('application', 'octet-stream')
    part.set_payload(excel_bytes)
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', f'attachment; filename="{filename}"')
    msg.attach(part)

    # Step 4: Send via Gmail SMTP
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, [gmail_user], msg.as_string())

    print(f"Reminder sent to {gmail_user} for {month_name} {year}.")


if __name__ == '__main__':
    main()
