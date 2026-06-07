# Recro Timesheet Generator

A simple web app to generate your monthly timesheet with Indian NSE holidays pre-filled. Preview it, make changes, and download as Excel.

**Live app:** https://recro-ts-generator.onrender.com/

---

## Want to use this?

Fork this repo and follow the steps below to get your own monthly email reminder with your timesheet attached.

---

## Setup

### 1. Open the web app

Go to https://recro-ts-generator.onrender.com/ and fill in your details in the Settings modal (employee name, number, client). These are saved in your browser only — nothing is stored on the server.

> The app is hosted on Render's free tier and may take ~30 seconds to load if it hasn't been used recently.

### 2. Set up a Gmail App Password

You need an App Password to let GitHub Actions send emails on your behalf.

1. Enable **2-Step Verification** on your Google account (required)
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create a new app password — name it anything like `timesheet-reminder`
4. Copy the 16-character password shown (you won't see it again)

### 3. Add your secrets to GitHub

After forking, run these from inside the repo (requires the [GitHub CLI](https://cli.github.com)):

```bash
gh secret set GMAIL_USER        --body "you@gmail.com"
gh secret set GMAIL_APP_PASSWORD          # prompts securely, paste your 16-char password
gh secret set EMPLOYEE_NAME     --body "Your Full Name"
gh secret set EMPLOYEE_NUMBER   --body "EMP001"
gh secret set CLIENT_NAME       --body "Your Client Name"
gh variable set RENDER_URL      --body "https://recro-ts-generator.onrender.com"
```

> Don't have the GitHub CLI? Install it with `brew install gh` (Mac) or see [cli.github.com](https://cli.github.com/manual/installation), then run `gh auth login`.

### 4. Test it

Go to your forked repo → **Actions** → **Monthly Timesheet Reminder** → **Run workflow**.

You should receive an email with your timesheet attached within a minute.

---

## How the reminder works

On the **26th of every month**, a GitHub Action automatically:
1. Generates your timesheet for that month (NSE holidays included, no leaves assumed)
2. Attaches it as an Excel file
3. Emails it to you as a reminder to review and send it to your manager

If you took leaves or want to make changes, open the web app, edit your timesheet, and download a fresh copy.

---

## Local development

```bash
npm install
npm run dev
```
