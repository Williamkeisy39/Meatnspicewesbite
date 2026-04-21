This is a [Next.js](https://nextjs.org) project for **Meat & Spice Ltd** with a Prisma + PostgreSQL backend and an admin panel.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (manually) with your PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
ADMIN_EMAIL="admin@meatnspice.local"
ADMIN_PASSWORD="change-this-admin-password"
ADMIN_SESSION_TOKEN="change-this-session-token"
```

Or use the included Docker setup:

```bash
docker compose up -d
```

Then set:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/meatnspice?schema=public"
```

3. Generate Prisma client, run migrations, and seed sample data:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

Default seeded admin login uses `ADMIN_EMAIL` + `ADMIN_PASSWORD` from your env.

Admin product form supports direct image upload (`/api/admin/uploads`) and URL input.
Uploaded local files are cleaned up automatically when a product image is replaced or the product is deleted.

Optional maintenance scripts:

```bash
npm run uploads:cleanup:dry
npm run uploads:cleanup
```

Use dry-run first to preview orphaned files in `public/uploads`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
