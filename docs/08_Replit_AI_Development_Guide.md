DEVELOPMENT PRINCIPLES
Build production-ready code.
Prioritize readability over cleverness.
Write reusable components.
Follow clean architecture.
Keep business logic separate from UI.
Every feature should be testable.
PROJECT EXECUTION ORDER

The project must be built in the following sequence only:

Sprint 1
Project Setup
Theme
Layout
Routing
Navbar
Footer
Sprint 2
Home Page
Portfolio
Services
Packages
Contact
About
Sprint 3
Booking System
Availability Checker
Build Your Coverage
Sprint 4
Authentication
Admin Login
Protected Routes
Sprint 5
Admin Dashboard
Booking Management
Client Management
Sprint 6
Razorpay Integration
Payment Verification
Invoice Generation
Sprint 7
Performance
SEO
Testing
Deployment
BEFORE WRITING CODE

Always check:

Does this feature already exist?
Can this component be reused?
Is this responsive?
Does it match the design system?
Does it follow naming conventions?
COMPONENT RULES

Each component must:

Be in its own file.
Export a single component.
Accept props where needed.
Avoid duplicated code.
Use TypeScript interfaces.

Example:

interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
}
PAGE RULES

Every page must include:

SEO metadata
Responsive layout
Proper heading hierarchy (H1, H2, H3...)
Loading state (if data is fetched)
Error handling (if needed)
STYLING RULES
Tailwind CSS only.
No inline styles.
No hardcoded colors.
Use design tokens from the theme.
STATE MANAGEMENT

Use React Context for global state.

Examples:

Logged-in user
Theme
Notifications

Avoid unnecessary global state.

DATA FETCHING

Use Axios.

Create a single API client.

Do not repeat API configuration in multiple files.

ERROR HANDLING

Frontend:

Friendly error messages.
Retry option where appropriate.

Backend:

Structured JSON responses.
Log exceptions.
Never expose stack traces.
FORM RULES

Every form must have:

Client-side validation
Server-side validation
Disabled submit button while loading
Success message
Error message
PERFORMANCE RULES
Lazy load images.
Optimize imports.
Use dynamic imports where beneficial.
Avoid unnecessary re-renders.
Minimize bundle size.
ACCESSIBILITY

Every interactive element must:

Be keyboard accessible.
Have focus styles.
Use proper ARIA labels where needed.
TESTING CHECKLIST

Before marking a sprint complete:

No TypeScript errors.
No console errors.
Mobile responsive.
Navigation works.
Lighthouse score acceptable.
Forms validated.
GIT WORKFLOW

After every completed sprint:

git add .

git commit -m "feat: complete sprint X"

git push

Never leave uncommitted work for long.

STOP CONDITIONS

After completing a sprint:

Stop.
Wait for review.
Do not continue to the next sprint automatically.