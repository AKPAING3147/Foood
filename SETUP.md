# 🚀 Quick Setup Guide for FoodieOrder

## Step-by-Step Setup Instructions

### 1. Database Setup (Neon PostgreSQL)

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy your connection string
4. Update `.env` file with your DATABASE_URL

Example:
\`\`\`
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
\`\`\`

### 2. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys from Developers > API keys
3. Add to `.env`:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with pk_)
   - `STRIPE_SECRET_KEY` (starts with sk_)

4. For webhooks (local development):
   \`\`\`bash
   # Install Stripe CLI
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   # Copy the webhook signing secret (whsec_xxx) to .env
   \`\`\`

### 3. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up/login
3. From Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
4. Add to `.env`

### 4. Initialize Database

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Open Prisma Studio to manage data
npx prisma studio
\`\`\`

### 5. Create Admin Account

Since we don't have a registration page for admins yet, create one manually:

1. Run `npx prisma studio`
2. Go to Admin model
3. Click "Add record"
4. Fill in:
   - email: admin@foodieorder.com
   - password: (hash it first using bcrypt)
   - name: Admin
   - role: admin

**To hash password:**
\`\`\`javascript
// Run in Node.js console or create a script
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your_password', 10);
console.log(hash);
\`\`\`

Or use an online bcrypt generator.

### 6. Add Sample Data

#### Create Categories:
1. Open Prisma Studio
2. Add categories like:
   - Pizza
   - Burgers
   - Pasta
   - Desserts
   - Drinks

#### Create Products:
1. Upload images to Cloudinary first
2. Add products with:
   - name
   - description
   - price
   - image URL from Cloudinary
   - categoryId
   - available: true

### 7. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Visit: http://localhost:3000

## 🎯 Testing the Application

### Test User Flow:
1. Go to homepage
2. Click "Sign Up"
3. Create an account
4. Browse menu
5. Add items to cart
6. Checkout
7. Test both payment methods

### Test Admin Flow:
1. Go to http://localhost:3000/admin/login
2. Login with admin credentials
3. Manage products
4. View orders
5. Update order status

## 🔧 Troubleshooting

### Database Connection Error
- Check DATABASE_URL is correct
- Ensure Neon database is active
- Verify SSL mode is set

### Stripe Errors
- Verify API keys are correct
- Check if keys are for test mode
- Ensure webhook secret is set for local testing

### Cloudinary Upload Fails
- Verify all three credentials are correct
- Check API key permissions
- Ensure cloud name matches

### Prisma Generate Fails
- Make sure DATABASE_URL is set in .env
- Run `npm install @prisma/client`
- Delete node_modules and reinstall

## 📱 Next Steps

1. **Create more pages:**
   - Login page (`/login`)
   - Register page (`/register`)
   - Menu page (`/menu`)
   - Cart page (`/cart`)
   - Admin dashboard (`/admin/dashboard`)
   - Order management (`/admin/orders`)

2. **Add features:**
   - User profile page
   - Order history
   - Product search and filters
   - Reviews and ratings
   - Email notifications

3. **Deploy:**
   - Push to GitHub
   - Deploy to Vercel
   - Set up production database
   - Configure production Stripe webhooks

## 🎨 Customization

### Change Theme Colors:
Edit `app/globals.css`:
\`\`\`css
:root {
  --primary: #your-color;
  --primary-dark: #your-dark-color;
  /* ... */
}
\`\`\`

### Modify Database Schema:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Run `npx prisma generate`

## 📞 Need Help?

- Check the main README.md
- Review API documentation
- Check Prisma docs: https://www.prisma.io/docs
- Check Next.js docs: https://nextjs.org/docs
- Check Stripe docs: https://stripe.com/docs

---

**Happy Coding! 🚀**
