🎯 Sprint Goal

Create the complete project foundation for VK Creation Platform.

Do NOT build booking, payment, authentication, or backend logic in this sprint.

Focus only on creating a clean, scalable project structure and the public website shell.

Project Structure
vkcreation-platform/

frontend/
│
├── src/
│   ├── assets/
│   ├── components/
│   │    ├── common/
│   │    ├── layout/
│   │    ├── ui/
│   │    └── sections/
│   │
│   ├── pages/
│   │
│   ├── hooks/
│   ├── context/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── constants/
│   ├── styles/
│   └── App.tsx
│
├── public/
│
└── package.json

backend/

database/

docs/

branding/

assets/
Install Libraries

Frontend

React + Vite + TypeScript

Tailwind CSS

Framer Motion

React Router DOM

React Hook Form

Zod

React Icons

Lucide React

Axios

clsx
Theme

Create Theme Variables

Primary Background

Secondary Background

Gold Accent

White Text

Gray Text

Border Color

Success

Error

Store them inside

src/styles/theme.ts
Global Layout

Create

Navbar

Footer

Page Container

Scroll To Top

Floating WhatsApp Button

Loading Screen
Routing

Create routes for

/

portfolio

services

packages

booking

contact

about

terms

privacy

All pages should exist.

Even if empty.

Navbar

Requirements

Transparent on Hero

↓

Dark after scrolling

↓

Sticky

↓

Smooth Animation

Desktop

Logo

Home

Portfolio

Services

Packages

Contact

Book Now

Mobile

Hamburger Menu

Footer

Contains

Logo

Quick Links

Services

Instagram

WhatsApp

Email

Copyright

Privacy

Terms

Typography

Configure

Playfair Display

Inter

Poppins

Button Component

Variants

Primary

Secondary

Outline

Ghost

Loading

Card Component

Reusable

Luxury Style

Rounded

Hover Effect

Container Component

Maximum Width

1280px

Responsive Padding

Page Layout

Every page

↓

Navbar

↓

Content

↓

Footer

Animations

Page Transition

Fade

Slide Up

Scale

Nothing more.

Responsive

Mobile First

Support

320

375

425

768

1024

1440

1920

Code Standards

Use

Functional Components

TypeScript

Reusable Components

No Inline CSS

No Hardcoded Colors

Dummy Content

Until real assets are available

Use

Luxury Placeholder Images

Lorem Ipsum

Demo Wedding Cards

Deliverables

At the end of Sprint 1

User should see

✅ Premium Navbar

✅ Footer

✅ Responsive Layout

✅ Working Routing

✅ Theme System

✅ Component Library

✅ Empty Pages

✅ Smooth Animations

No backend.

No database.

Definition of Done

Sprint is complete only if

✔ No console errors

✔ Responsive

✔ Lighthouse >90

✔ Clean folder structure

✔ Components reusable

✔ Ready for Sprint 2