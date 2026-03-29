# HxH - Reimbursement Management System

This repository contains our hackathon project for the Reimbursement Management problem statement. The application digitizes employee expense claims, approval workflows, and receipt OCR into a single web platform.

## Team

**Team Name:** HxH

## Problem Statement

Companies often manage reimbursements through slow and error-prone manual processes. These flows usually lack:

- clear approval chains
- flexible rule-based approvals
- transparency for employees and managers
- multi-level role management
- receipt data extraction and automation

The challenge was to build a reimbursement management system where:

- a company and admin are created during signup
- admins can create employees and managers, assign roles, and define reporting relationships
- employees can submit expenses in different currencies and track their status
- approvals move through sequenced approvers such as manager, finance, and director
- conditional rules can approve early based on percentage thresholds, specific approvers, or hybrid logic
- receipt OCR can prefill fields such as amount, date, and description

## What We Built

HxH built a web-based reimbursement platform that supports:

- authentication and company bootstrap
- role-based dashboards for admin, manager, and employee
- expense submission and tracking
- sequential and conditional approval workflows
- currency conversion to company base currency
- OCR-powered receipt parsing
- admin control over users and approval rules

## Project Structure

```text
odoo_HxH-K/
├── README.md
├── architecture.md
├── Reimbursement management.pdf
└── rem_manager/
    ├── prisma/
    │   └── schema.prisma
    ├── public/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/                 # login and signup flows
    │   │   ├── (dashboard)/            # dashboard, expenses, approvals, admin pages
    │   │   ├── api/                    # API routes for auth, OCR, expenses, users, rules
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   │   ├── admin/                  # rule builder and user management UI
    │   │   ├── approvals/              # approval queue and timeline UI
    │   │   ├── expenses/               # expense form, list, and status UI
    │   │   ├── layout/                 # sidebar and topbar
    │   │   └── ui/                     # shared UI primitives
    │   └── lib/
    │       ├── approval-engine.ts      # approval flow logic
    │       ├── auth.ts                 # auth/session setup
    │       ├── currency.ts             # exchange rate handling
    │       ├── ocr.ts                  # receipt OCR parsing
    │       ├── prisma.ts               # Prisma client
    │       └── utils.ts
    ├── package.json
    ├── next.config.ts
    └── tsconfig.json
```

## Tech Stack

### Frontend

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui and Radix-based UI components
- Phosphor Icons

### Backend and Data

- Next.js API routes
- Prisma ORM
- PostgreSQL on Neon
- NextAuth v5 beta for authentication
- bcryptjs for password hashing

### Business Features and Integrations

- `tesseract.js` for OCR-based receipt extraction
- Rest Countries API for country and currency lookup
- ExchangeRate API for currency conversion

## Core Modules

- `src/app/(auth)` handles login and signup
- `src/app/(dashboard)` contains the main product flows
- `src/app/api/ocr/route.ts` processes receipt uploads
- `src/lib/approval-engine.ts` drives sequential and conditional approvals
- `src/components/admin/RuleBuilder.tsx` manages approval rule creation
- `prisma/schema.prisma` defines users, companies, expenses, and approval records

## How To Run Locally

### Prerequisites

- Node.js 20+
- npm
- a PostgreSQL database URL

### Setup

1. Clone the repository.
2. Move into the app directory:

```bash
cd rem_manager
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in `rem_manager/` with:

```env
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

5. Generate the Prisma client:

```bash
npx prisma generate
```

6. Push the schema to the database:

```bash
npx prisma db push
```

7. Start the development server:

```bash
npm run dev
```

8. Open `http://localhost:3000`

## Available Scripts

Inside `rem_manager/`:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- `architecture.md` was used as the original implementation guide and may not reflect the latest completed state of the project.
- OCR runs on the server side through the `/api/ocr` route.
- The application expects a working database connection before auth and dashboard flows can be used.
