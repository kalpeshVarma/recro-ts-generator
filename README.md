# Recro Timesheet Generator

A web app that generates monthly timesheets with Indian stock market (NSE) holidays, lets you preview and edit them, and exports to Excel.

**Live app:** https://recro-ts-generator.onrender.com/

---

## Features

- Auto-generates the current month's timesheet with NSE holidays marked
- Edit status (working / leave / holiday / weekend) and hours per day
- Preview the formatted timesheet before exporting
- Download as `.xlsx`
- Monthly email reminder via GitHub Actions with the timesheet pre-attached

---

## Tech stack

- **Frontend:** React + TypeScript + Vite + MUI
- **Backend:** Express + TypeScript (served from the same Node process)
- **Hosting:** Render (free tier)
- **Reminders:** GitHub Actions

---

## Local development

```bash
npm install
npm run dev      # starts Vite dev server (frontend only, proxied to backend)
```

To run the full stack locally (backend + frontend):

```bash
npm run build
npm start
```

---

## Deploying to Render

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo.
3. Render will detect `render.yaml` and configure itself automatically.
4. The free tier spins down after 15 minutes of inactivity — the first request after a sleep takes ~30–60 seconds.

---

## Monthly reminder via GitHub Actions

The workflow in `.github/workflows/timesheet-reminder.yml` runs on the **26th of every month at 9:00 AM IST** (3:30 AM UTC). It:

1. Calls your Render app to generate the month's timesheet (with NSE holidays, no leaves assumed)
2. Exports it to `.xlsx`
3. Emails it to you via Gmail with the file attached

This runs entirely on GitHub's servers — your machine does not need to be online.

### Step 1 — Create a Gmail App Password

Gmail requires an **App Password** (not your regular password) for SMTP access.

1. Go to your Google Account → **Security**
2. Make sure **2-Step Verification** is enabled (required for App Passwords)
3. Search for **App passwords** (or go to `myaccount.google.com/apppasswords`)
4. Click **Create** → give it a name like `timesheet-reminder` → click **Create**
5. Copy the 16-character password shown — you won't see it again

> If you don't see "App passwords", 2-Step Verification may not be active on your account.

### Step 2 — Add GitHub Secrets

You can add secrets via the `gh` CLI (recommended) or the GitHub UI.

#### Option A — `gh` CLI

> **Prerequisites:** Install the GitHub CLI first if you haven't already.
> - macOS: `brew install gh` then `gh auth login`
> - Other platforms: https://cli.github.com/manual/installation

Run these commands from inside the repo directory (replace values with your own):

```bash
# Prompts for value interactively — safer for passwords (nothing echoed to terminal)
gh secret set GMAIL_APP_PASSWORD

# Or pass value inline
gh secret set GMAIL_USER        --body "you@gmail.com"
gh secret set EMPLOYEE_NAME     --body "Your Full Name"
gh secret set EMPLOYEE_NUMBER   --body "EMP001"
gh secret set CLIENT_NAME       --body "Your Client Name"

# Non-sensitive variable (shared Render URL — no need to deploy your own)
gh variable set RENDER_URL --body "https://recro-ts-generator.onrender.com"
```

#### Option B — GitHub UI

Go to your repo → **Settings** → **Secrets and variables** → **Actions**.

Add the following **Secrets**:

| Secret name | Value |
|---|---|
| `GMAIL_USER` | Your Gmail address, e.g. `you@gmail.com` |
| `GMAIL_APP_PASSWORD` | The 16-character App Password from Step 1 |
| `EMPLOYEE_NAME` | Your full name as it should appear on the timesheet |
| `EMPLOYEE_NUMBER` | Your employee number |
| `CLIENT_NAME` | Your client / project name |

Switch to the **Variables** tab and add:

| Variable name | Value |
|---|---|
| `RENDER_URL` | `https://recro-ts-generator.onrender.com` |

### Step 3 — Test it

After adding secrets, go to **Actions** → **Monthly Timesheet Reminder** → **Run workflow** to trigger it manually and verify you receive the email.

### Forking this project

No need to deploy your own server — the shared Render instance at `https://recro-ts-generator.onrender.com` is stateless and works for everyone. Your employee details are passed per-request and never stored on the server.

1. Fork this repo on GitHub
2. Follow Steps 1–3 above with your own Gmail and employee details
3. Set `RENDER_URL` to `https://recro-ts-generator.onrender.com`
4. The workflow runs on GitHub's servers and emails your timesheet to you every 26th

---

## Configuration (web app)

When you first open the app, a **Settings** modal will appear. Enter your details there — they are saved in your browser's `localStorage` and never sent to the server until you explicitly download or send a timesheet.

Each user who opens the app on their own device has their own isolated settings.
