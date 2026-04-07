# BookWise — Site Builder for Property Owners

Create beautiful booking websites for your properties in minutes.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** + **shadcn/ui**
- **Prisma** + **PostgreSQL**

## Getting Started

```bash
# Install dependencies
npm install

# Copy env and configure your database
cp .env.example .env

# Generate Prisma client & run migrations
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Marketing landing page
│   ├── dashboard/            # Owner dashboard & site builder
│   └── site/                 # Public-facing booking sites
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── builder/              # Site builder components
│   └── shared/               # Shared components
├── lib/
│   ├── db/                   # Prisma client
│   └── utils.ts              # Utilities
└── types/                    # Shared TypeScript types
prisma/
└── schema.prisma             # Database schema
```
