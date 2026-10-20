📁 Root Folder
VK-Creation-Platform/

│
├── frontend/
├── backend/
├── database/
├── docs/
├── assets/
├── branding/
├── content/
├── .gitignore
├── README.md
└── LICENSE
📂 Frontend Structure
frontend/

│
├── public/
│
├── src/
│
├── app/
│
├── components/
│      │
│      ├── common/
│      ├── home/
│      ├── booking/
│      ├── packages/
│      ├── gallery/
│      ├── dashboard/
│      ├── layout/
│      └── ui/
│
├── hooks/
│
├── lib/
│
├── services/
│
├── constants/
│
├── utils/
│
├── types/
│
├── styles/
│
├── context/
│
└── middleware/
📂 Backend Structure
backend/

│
├── src/
│
├── controller/
│
├── service/
│
├── repository/
│
├── model/
│
├── dto/
│
├── security/
│
├── config/
│
├── exception/
│
├── util/
│
└── resources/
📂 Assets
assets/

logo/

images/

videos/

icons/

demo/

testimonials/
📂 Branding
branding/

logo/

fonts/

colors/

invoice/

quotation/

visiting-card/
📂 Content
content/

home.md

about.md

services.md

packages.md

faq.md

terms.md

privacy.md
📂 Docs
docs/

01_Project_Specification.md

02_UI_UX_Design_System.md

03_Database_Architecture.md

04_API_Documentation.md

05_Replit_Master_Prompt.md

06_Sprint_01_Foundation.md

07_Project_File_Structure.md
📂 Future Docs

Later we'll add

08_Sprint_02.md

09_Sprint_03.md

10_Deployment.md

11_Testing.md

12_SEO.md
📂 Component Naming Rules

Always use

Navbar.tsx

Footer.tsx

PackageCard.tsx

BookingForm.tsx

GallerySlider.tsx

Never use

navbar.jsx

component1.tsx

test.tsx

abc.tsx
📂 Image Naming Rules

Correct

hero-banner.webp

wedding-gallery-01.webp

team-photo.webp

Wrong

IMG1234.jpg

finalnew.png

photo.png
📂 CSS Rules

Never create

style.css

new.css

page.css

Instead use

globals.css

tailwind.css

theme.css
📂 Git Ignore

Ignore

node_modules/

.env

dist/

build/

.next/

Never upload these files to GitHub.

📂 Environment Variables

Never hardcode secrets.

Create

.env.local

Example

NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

RAZORPAY_KEY_ID=

SPRING_DATASOURCE_URL=

CLOUDINARY_CLOUD_NAME=
📂 Git Branch Strategy
main

development

feature/navbar

feature/booking

feature/payment
📂 Commit Message Rules

Good

feat: add responsive navbar

fix: booking form validation

style: improve hero section

docs: update api documentation

Bad

new

update

done

test
📂 File Size Rule

No React component should exceed 300 lines.

If it grows larger:

➡️ Split it into smaller reusable components.

📂 Import Rules

Use absolute imports where possible.

Example

import Navbar from "@/components/layout/Navbar";

Avoid long relative paths like:

../../../components/Navbar
📂 Quality Checklist

Every new file must satisfy:

Clear name
Single responsibility
Reusable
Documented (if needed)
No unused code