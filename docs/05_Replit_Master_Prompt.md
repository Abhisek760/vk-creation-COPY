PROJECT OVERVIEW

Build a premium luxury photography booking platform for VK Creation.

This is not a portfolio website.

This is a complete business platform for a photography studio.

The final product must look like a premium digital brand and be scalable for future SaaS expansion.

PROJECT OBJECTIVE

Create a fast, modern, mobile-first, SEO-friendly platform where clients can:

Explore portfolio
View services
Compare packages
Build custom coverage
Book online
Pay advance online
Contact the studio

Admin should manage everything from one dashboard.

TECH STACK (MANDATORY)
Frontend
React 19
Vite
Tailwind CSS
Framer Motion
React Router
React Hook Form
Zod
Backend
Java 21
Spring Boot 3
Spring Security
JWT Authentication
REST API
Database

PostgreSQL

Authentication

Firebase Authentication

Admin Email Login

Storage

Cloudinary

Payments

Razorpay

Deployment

Frontend → Vercel

Backend → Railway

Database → Neon PostgreSQL

DESIGN REQUIREMENTS

Theme

Luxury

Minimal

Premium

Elegant

Modern

Cinematic

Background

Deep Matte Black

Accent

Royal Gold

Typography

Playfair Display

Inter

RESPONSIVE REQUIREMENTS

Website must work perfectly on:

320px

375px

425px

768px

1024px

1440px

1920px

Mobile-first approach.

PERFORMANCE TARGETS

Google Lighthouse

Performance ≥95

Accessibility ≥95

Best Practices ≥95

SEO ≥95

First Load <2.5s

CLS <0.1

WEBSITE PAGES

Public

Home
Portfolio
Services
Packages
Build Your Coverage
Reviews
Contact
About
Terms
Privacy

Admin

Dashboard
Bookings
Clients
Payments
Calendar
Reports
Settings
HOME PAGE STRUCTURE

Hero

↓

Featured Gallery

↓

Why Choose Us

↓

Services

↓

Packages

↓

Coverage Builder

↓

Availability

↓

Testimonials

↓

Instagram

↓

FAQ

↓

Contact

↓

Footer

UI COMPONENTS

Navbar

Hero

Buttons

Cards

Gallery

Package Card

Coverage Builder

Booking Form

Payment Summary

Footer

FAQ

WhatsApp Floating Button

Loader

Modal

Toast Notifications

ANIMATION RULES

Use Framer Motion only.

Allowed

Fade

Slide

Scale

Blur

Page Transition

Never use excessive animations.

BOOKING FLOW

Package Selection

↓

Date Selection

↓

Booking Form

↓

Payment

↓

Confirmation

↓

Dashboard

PAYMENT FLOW

Create Razorpay Order

↓

Payment

↓

Verification

↓

Booking Confirmation

↓

Invoice

↓

Notification

ADMIN FEATURES

Dashboard

Bookings

Clients

Payments

Reports

Calendar

Package Management

Review Management

DATABASE

Use PostgreSQL.

Use UUID Primary Keys.

Never store plain passwords.

Follow the database architecture document.

API

Follow REST principles.

Base URL

/api/v1

Use proper HTTP Status Codes.

Use pagination.

Use validation.

SECURITY

JWT

HTTPS

Input Validation

Rate Limiting

Password Hashing

Protected Admin Routes

Environment Variables

SEO

Meta Tags

Open Graph

Twitter Cards

Sitemap

Robots.txt

Schema.org (Local Business)

Clean URLs

ACCESSIBILITY

Keyboard Navigation

ARIA Labels

Alt Text

Color Contrast

Visible Focus States

IMAGE OPTIMIZATION

Use WebP.

Lazy Loading.

Responsive Images.

Compressed Media.

FILE STRUCTURE
frontend/
backend/
database/
docs/
assets/
branding/
content/
CODING STANDARDS
Use TypeScript (Frontend)
Functional Components only
Reusable Components
Clean Folder Structure
Meaningful Variable Names
No duplicate code
Comment only where necessary
COMPONENT RULES

Each component should have:

Single responsibility
Responsive layout
Loading state
Error state (where applicable)
ERROR HANDLING

Graceful UI messages.

Never expose backend errors.

Log server-side exceptions.

FORMS

Use React Hook Form + Zod.

Client-side validation + server-side validation.

FUTURE READY

Architecture should support:

Client Portal
Gallery Delivery
Staff Portal
AI Features
Referral System
Equipment Management

without major restructuring.

DO NOT

❌ Copy templates.

❌ Use random colors.

❌ Hardcode data.

❌ Ignore mobile responsiveness.

❌ Mix business logic with UI.

❌ Store secrets in code.

❌ Build everything in one file.

DEVELOPMENT STRATEGY

Build the project in phases.

Phase 1

Project Setup

Theme

Routing

Layout

Navbar

Footer

Phase 2

Public Website

Phase 3

Booking System

Phase 4

Authentication

Phase 5

Admin Dashboard

Phase 6

Payments

Phase 7

Testing & Deployment

QUALITY CHECKLIST

Every page must satisfy:

Responsive
Fast
SEO Friendly
Accessible
Clean UI
Production Ready
FINAL GOAL

Create a premium, production-ready photography booking platform that feels like a luxury brand, scales for future business growth, and provides an exceptional user experience for both clients and administrators.