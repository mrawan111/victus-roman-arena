# Project Structure

This document outlines the organization of the Victus Roman Arena e-commerce project.

## 📁 Directory Structure

```
victus-roman-arena/
│
├── docs/                          # 📚 Documentation
│   ├── README.md                  # Documentation index
│   ├── API_ENDPOINTS_DOCUMENTATION.md
│   └── NEW_API_FEATURES_DOCUMENTATION.md
│
├── public/                        # 🌐 Public static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/                          # 💻 Source code
│   │
│   ├── assets/                   # 🖼️ Static assets
│   │   ├── boxing-gloves.jpg
│   │   ├── hero-martial-arts.jpg
│   │   ├── kickboxing.jpg
│   │   ├── mma-gear.jpg
│   │   ├── muay-thai.jpg
│   │   └── victus-logo.png
│   │
│   ├── components/               # 🧩 React Components
│   │   ├── admin/               # Admin-specific components
│   │   │   ├── AdminLayout.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── ui/                  # shadcn/ui component library
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (50+ UI components)
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ProductCard.tsx
│   │
│   ├── contexts/                # 🔄 React Context Providers
│   │   └── CartContext.tsx
│   │
│   ├── data/                    # 📊 Static data
│   │   └── products.ts         # Fallback product data
│   │
│   ├── hooks/                   # 🪝 Custom React Hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/                     # 📦 Utility libraries
│   │   ├── activityLogger.ts   # Activity logging utility
│   │   ├── api.ts              # API client (all endpoints)
│   │   └── utils.ts            # General utilities
│   │
│   ├── pages/                   # 📄 Page Components
│   │   ├── admin/              # Admin dashboard pages
│   │   │   ├── AdminActivity.tsx
│   │   │   ├── AdminCategories.tsx
│   │   │   ├── AdminCoupons.tsx
│   │   │   ├── AdminCustomers.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminImages.tsx
│   │   │   ├── AdminInventory.tsx
│   │   │   ├── AdminOrders.tsx
│   │   │   ├── AdminProducts.tsx
│   │   │   ├── AdminReports.tsx
│   │   │   ├── AdminSellers.tsx
│   │   │   ├── AdminSettings.tsx
│   │   │   └── AdminVariants.tsx
│   │   ├── auth/               # Authentication pages
│   │   │   ├── Auth.tsx        # Admin login/signup
│   │   │   ├── Login.tsx       # Customer login
│   │   │   └── Signup.tsx      # Customer signup
│   │   ├── About.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Contact.tsx
│   │   ├── Index.tsx           # Homepage
│   │   ├── NotFound.tsx        # 404 page
│   │   ├── ProductDetail.tsx
│   │   └── Shop.tsx
│   │
│   ├── App.tsx                 # Main app component & routing
│   ├── main.tsx               # Entry point
│   ├── index.css              # Global styles
│   └── vite-env.d.ts          # TypeScript definitions
│
├── .gitignore
├── components.json             # shadcn/ui configuration
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML entry point
├── package.json               # Dependencies
├── postcss.config.js          # PostCSS configuration
├── PROJECT_STRUCTURE.md       # This file
├── README.md                  # Project README
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite configuration

```

## 🗂️ Organization Principles

### 1. **Feature-based Organization**
- Pages are organized by feature (auth, admin, shop)
- Related components are grouped together

### 2. **Separation of Concerns**
- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Lib**: Business logic and utilities
- **Contexts**: Global state management

### 3. **Admin vs Customer**
- Admin pages: `src/pages/admin/`
- Admin components: `src/components/admin/`
- Customer/auth pages: `src/pages/auth/` and `src/pages/`

### 4. **UI Components**
- All shadcn/ui components in `src/components/ui/`
- Custom business components in `src/components/`

## 📝 File Naming Conventions

- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Pages**: PascalCase (e.g., `AdminDashboard.tsx`)
- **Utilities**: camelCase (e.g., `activityLogger.ts`, `api.ts`)
- **Constants**: UPPER_SNAKE_CASE (if applicable)

## 🔗 Key Dependencies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons

## 📚 Documentation

All documentation is located in the `docs/` directory:
- API endpoints documentation
- New features documentation
- Project structure (this file)

## 🚀 Getting Started

See the main [README.md](./README.md) for setup instructions.

