# Gmail OAuth2 Setup for Nodemailer

This guide explains how to obtain the `CLIENT_ID`, `CLIENT_SECRET`, and `REFRESH_TOKEN` needed to send emails via Gmail securely.

## 1. Create a Project in Google Cloud Console

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click on the project dropdown at the top and select **"New Project"**.
3.  Name it (e.g., `AplikasiBidan`) and click **Create**.

## 2. Enable Gmail API

1.  In the dashboard, click **"APIs & Services"** > **"Library"**.
2.  Search for **"Gmail API"**.
3.  Click on it and select **Enable**.

## 3. Configure OAuth Consent Screen

1.  Go to **"APIs & Services"** > **"OAuth consent screen"**.
2.  Select **External** (if you don't have a Google Workspace organization) and click **Create**.
3.  **App Information**:
    - App name: `AplikasiBidan`
    - User support email: Select your email.
    - Developer contact information: Enter your email.
4.  Click **Save and Continue** through the steps (Scopes can be left default or add `https://mail.google.com/`).
5.  **Test Users**: Add your own Gmail address (the one you will use to send emails) as a test user. **This is crucial.**

## 4. Create OAuth Credentials

1.  Go to **"APIs & Services"** > **"Credentials"**.
2.  Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**.
3.  **Application type**: Select **Web application**.
4.  **Name**: `BidanMailer`.
5.  **Authorized redirect URIs**:
    - Add: `https://developers.google.com/oauthplayground`
    - (This is needed to generate the refresh token easily).
6.  Click **Create**.
7.  Copy your **Client ID** and **Client Secret**. Save them!

## 5. Generate Refresh Token

1.  Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2.  In the top right ("OAuth 2.0 Configuration" gear icon):
    - Check **"Use your own OAuth credentials"**.
    - Paste your **Client ID** and **Client Secret**.
3.  In the left "Select & authorize APIs" box:
    - Search for **"Gmail API v1"**.
    - Select `https://mail.google.com/`.
4.  Click **Authorize APIs**.
5.  Login with your Google Account (the one you added as a Test User).
    - If you see "Google hasn't verified this app", click **Advanced** > **Go to AplikasiBidan (unsafe)**.
6.  Click **Exchange authorization code for tokens**.
7.  Copy the **Refresh Token**.

## 6. Update Your Configuration

Update your `.env.docker` and production `.env` files with these values:

```env
# ... other config
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_CLIENT_ID=your_client_id_from_step_4
EMAIL_CLIENT_SECRET=your_client_secret_from_step_4
EMAIL_REFRESH_TOKEN=your_refresh_token_from_step_5
```
