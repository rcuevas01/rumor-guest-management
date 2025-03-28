# Guest Management Dashboard

A Next.js dashboard for managing event guests with filtering and chat.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **State**: Zustand for global state management
- **Theme**: CSS Variables + Tailwind
- **Components**: Modular design with shared components

## Key Features

- Server-side sorting and filtering
- Real-time chat with guests
- Responsive design
- Type-safe development

## Design Decisions

- Zustand over Context API for simpler state management
- Server-side operations for better performance with large datasets
- If I had more time would add padding + extra validation to forms

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
