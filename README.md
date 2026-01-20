# 🍕 FoodieOrder - Modern Food Ordering Platform

A full-stack food ordering website built with **Next.js 16**, **Prisma**, **Neon PostgreSQL**, **Cloudinary**, and **Stripe**.

## ✨ Features

### User Features
- 🔐 **User Authentication** - Secure registration and login
- 🍔 **Browse Menu** - View all available food items by category
- 🛒 **Shopping Cart** - Add items to cart and manage quantities
- 💳 **Multiple Payment Options**:
  - Stripe payment integration
  - Cash on Delivery (COD)
- 📦 **Order Tracking** - Track order status in real-time
- 📱 **Responsive Design** - Works on all devices

### Admin Features
- 🔑 **Admin Login** - Separate admin authentication
- ➕ **Product Management** - Add, edit, and delete food items
- 📂 **Category Management** - Organize products by categories
- 🖼️ **Image Upload** - Upload product images via Cloudinary
- 📊 **Order Management**:
  - View all customer orders
  - Confirm orders
  - Cancel orders
  - Update order status
- 💰 **Payment Tracking** - Monitor payment status

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: bcryptjs
- **Payments**: Stripe
- **Image Upload**: Cloudinary
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Neon PostgreSQL database
- Stripe account
- Cloudinary account

## 🚀 Getting Started

### 1. Clone and Install

\`\`\`bash
cd foodie-order
npm install
\`\`\`

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following:

\`\`\`env
# Database URL (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@your-neon-host/dbname?sslmode=require"

# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Set Up Database

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view/edit data
npx prisma studio
\`\`\`

### 4. Create Admin Account

You'll need to create an admin account manually in the database. Use Prisma Studio or run:

\`\`\`bash
npx prisma studio
\`\`\`

Then add an admin record with a hashed password (use bcrypt to hash your password).

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
foodie-order/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── admin/        # Admin endpoints
│   │   ├── products/     # Product CRUD
│   │   ├── orders/       # Order management
│   │   ├── payments/     # Stripe integration
│   │   ├── categories/   # Category management
│   │   ├── upload/       # Cloudinary upload
│   │   └── webhooks/     # Stripe webhooks
│   ├── globals.css       # Global styles
│   └── page.tsx          # Homepage
├── lib/
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # Auth utilities
├── prisma/
│   └── schema.prisma     # Database schema
└── .env                  # Environment variables
\`\`\`

## 🗄️ Database Schema

### Models:
- **User** - Customer accounts
- **Admin** - Admin accounts
- **Category** - Food categories
- **Product** - Food items
- **Order** - Customer orders
- **OrderItem** - Items in orders
- **Payment** - Payment records

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/admin/login` - Admin login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order status (admin)
- `DELETE /api/orders/[id]` - Cancel order

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## 💳 Stripe Setup

1. Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Add them to `.env`
3. For webhooks, install Stripe CLI:
   \`\`\`bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   \`\`\`
4. Copy the webhook signing secret to `.env`

## 🖼️ Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Add them to `.env`

## 🎨 Design Features

- **Modern UI** with vibrant orange gradient theme
- **Dark mode** support
- **Glassmorphism** effects
- **Smooth animations** and transitions
- **Responsive design** for all screen sizes
- **Custom scrollbar** styling
- **Hover effects** on cards and buttons

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Database Migration

For production, run:
\`\`\`bash
npx prisma migrate deploy
\`\`\`

## 📝 Usage

### For Customers:
1. Register an account
2. Browse menu
3. Add items to cart
4. Checkout with Stripe or COD
5. Track your order

### For Admins:
1. Login with admin credentials
2. Manage products and categories
3. View and manage orders
4. Confirm/cancel orders
5. Track payments

## 🔒 Security Features

- Password hashing with bcrypt
- Secure API endpoints
- Environment variable protection
- Stripe webhook signature verification
- SQL injection protection via Prisma

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Stripe for payment processing
- Cloudinary for image management
- Neon for serverless PostgreSQL

---

**Built with ❤️ using Next.js, Prisma, and modern web technologies**
