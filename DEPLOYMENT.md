# Deploying FoodieGo to Vercel

This guide will help you deploy your FoodieGo application to Vercel.

## Prerequisites

1.  A [GitHub](https://github.com/), [GitLab](https://gitlab.com/), or [Bitbucket](https://bitbucket.org/) account.
2.  A [Vercel](https://vercel.com/) account.
3.  A [Cloudinary](https://cloudinary.com/) account (for image uploads).
4.  A [Stripe](https://stripe.com/) account (for payments).
5.  A PostgreSQL database (e.g., [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or Vercel Postgres).

## Step 1: Push to Git

First, make sure your project is pushed to a git repository.

1.  Initialize git if you haven't already:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub/GitLab/Bitbucket.
3.  Push your code:
    ```bash
    git remote add origin <your-repo-url>
    git branch -M main
    git push -u origin main
    ```

## Step 2: Import to Vercel

1.  Log in to your Vercel account.
2.  Click **"Add New..."** -> **"Project"**.
3.  Connect to your Git provider and import your `foodie-order` repository.

## Step 3: Configure Project

Vercel will detect that this is a Next.js project.

**Build and Output Settings:**
-   **Framework Preset:** Next.js
-   **Build Command:** `next build` (Default) or `prisma generate && next build` if the postinstall script doesn't run automatically (we added it, so default should work).

## Step 4: Environment Variables

Expand the **"Environment Variables"** section and add the following keys from your `.env` file. **Do not copy the entire file content at once**, adds keys one by one or copy-paste the block if supported.

| Key | Description |
| :--- | :--- |
| `DATABASE_URL` | Your PostgreSQL connection string (e.g., from Neon/Supabase). |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name. |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | Your Cloudinary API Key. |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API Secret. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe Publishable Key. |
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key. |
| `NEXTAUTH_SECRET` | A simplified secret key for session security (generate a random string). |
| `NEXTAUTH_URL` | Your production URL (e.g., `https://your-project.vercel.app`) - *Optional on Vercel but recommended*. |

**Important:** For the database, ensure your production database is accessible from anywhere (0.0.0.0/0) or allow Vercel's IP addresses if possible. Neon/Supabase/Vercel Postgres handle this automatically.

## Step 5: Deploy

Click **"Deploy"**. Vercel will:
1.  Clone your repo.
2.  Install dependencies (`npm install`).
3.  Run `postinstall` (`prisma generate`).
4.  Build the project (`next build`).

## Step 6: Post-Deployment

Once deployed:
1.  Visit your new URL (e.g., `https://foodie-go.vercel.app`).
2.  **Create an Admin Account:**
    Since you cannot access the seed script easily in production, you can manually create an admin entry in your database, or use the sign-up page (if you enable admin signup temporarily) or use a database tool (like Prisma Studio locally connected to prod DB) to insert an admin user.
    
    *Alternatively*, run the seed script locally pointing to your production DB:
    ```bash
    # Only run this locally!
    DATABASE_URL="your-production-db-url" node prisma/seed.js
    ```

Your application is now live! 🚀
