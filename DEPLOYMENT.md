# Deployment Guide: Garasi Roda Dua

This guide covers how to deploy the application using **Turso** (Database) and **Cloudflare Pages** (Hosting).

## 1. Database Setup (Turso)

1.  **Install Turso CLI** (if not already installed):
    ```bash
    # Windows (via Scoop)
    scoop install turso
    # Or check https://docs.turso.tech/cli/installation
    ```

2.  **Login and Create Database**:
    ```bash
    turso auth login
    turso db create garasi-roda-dua
    ```

3.  **Get Credentials**:
    -   **Database URL**:
        ```bash
        turso db show garasi-roda-dua
        ```
        (Copy the URL starting with `libsql://`)
    -   **Auth Token**:
        ```bash
        turso db tokens create garasi-roda-dua
        ```

4.  **Push Schema to Turso**:
    Create a `.env` file locally with:
    ```env
    TURSO_DATABASE_URL=libsql://...
    TURSO_AUTH_TOKEN=...
    ```
    Then run:
    ```bash
    npx drizzle-kit push
    ```

## 2. Cloudflare Pages Deployment

1.  **Push Code to GitHub**:
    Ensure your latest code (including the `lib/db.ts` refactor) is on your GitHub repository.

2.  **Connect Cloudflare Pages**:
    -   Go to Cloudflare Dashboard > **Workers & Pages**.
    -   Click **Create Application** > **Pages** > **Connect to Git**.
    -   Select your repository (`JualbeliSecond`).

3.  **Configure Build Settings**:
    -   **Framework Preset**: Next.js
    -   **Build Command**: `npx @cloudflare/next-on-pages@1`
    -   **Output Directory**: `.vercel/output/static` (standard for Next.js on Pages) OR `.next` if using the standard Next.js preset.
    -   *Recommended for best compatibility*: Use the `Next.js` preset but ensure you add `nodejs_compat` flag if needed.
    -   **IMPORTANT**: Go to **Settings** > **Environment Variables** in Cloudflare.
    -   Add:
        -   `TURSO_DATABASE_URL`: (Your libsql URL)
        -   `TURSO_AUTH_TOKEN`: (Your generated token)
        -   `NEXT_PUBLIC_STORE_NAME`: Garasi Roda Dua

## 3. Domain Setup (Cloudflare)

1.  **Buy Domain**:
    -   You can buy directly from Cloudflare (**Domain Registration**) or any other registrar (Namecheap, GoDaddy).
    -   If bought elsewhere, point **Nameservers** to Cloudflare.

2.  **Add Custom Domain to Pages**:
    -   In your Cloudflare Pages project, go to **Custom Domains**.
    -   Click **Set up a custom domain**.
    -   Enter your domain (e.g., `garasirodadua.com`).
    -   Cloudflare will automatically configure the DNS records.

## 4. Verification

-   Visit your live domain.
-   Check if the database content loads (e.g., motorbikes list).
-   If you see connection errors, verify the `TURSO_AUTH_TOKEN` in Cloudflare settings.

## 5. Local Development

You can still develop locally using the SQLite file.
-   If `TURSO_DATABASE_URL` is NOT set in your local `.env`, it defaults to `file:sqlite.db`.
-   To test with live data locally, add the Turso credentials to your local `.env`.
