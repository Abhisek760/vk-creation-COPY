1. Database Overview

Database: PostgreSQL

Design Goals:

Scalable
Secure
Fast
Easy to Maintain
Future Ready

Every record should have:

Unique ID
Created At
Updated At
2. Database Relationships
Client
│
├── Bookings
│      │
│      ├── Package
│      ├── Payment
│      ├── Event
│      ├── Quote
│      └── Timeline
│
├── Reviews
│
└── Future Gallery
3. USERS TABLE

Used for Admin Login.

Field	Type
id	UUID
full_name	VARCHAR
email	VARCHAR
password_hash	VARCHAR
phone	VARCHAR
role	ADMIN
status	ACTIVE / INACTIVE
created_at	TIMESTAMP
updated_at	TIMESTAMP
4. CLIENTS TABLE
Field	Type
id	UUID
full_name	VARCHAR
phone	VARCHAR
whatsapp	VARCHAR
email	VARCHAR
address	TEXT
city	VARCHAR
notes	TEXT
created_at	TIMESTAMP
5. PACKAGES TABLE
Field	Type
id	UUID
name	VARCHAR
description	TEXT
starting_price	DECIMAL
active	BOOLEAN

Example:

Basic

Standard

Gold

6. SERVICES TABLE

Every service available.

Field	Type
id	UUID
service_name	VARCHAR
category	VARCHAR
base_price	DECIMAL

Example

Wedding Photography

Drone

Album

LED Wall

Live Streaming

Same Day Edit

Instagram Reel

7. PACKAGE_SERVICES TABLE

Many-to-Many Relation

Package

↓

Contains

↓

Services

| package_id |

| service_id |

8. BOOKINGS TABLE

Main table.

Field	Type
id	UUID
booking_number	VARCHAR
client_id	UUID
package_id	UUID
booking_type	FIXED / CUSTOM
event_date	DATE
status	PENDING / CONFIRMED / COMPLETED / CANCELLED
payment_status	PENDING / PARTIAL / PAID
total_amount	DECIMAL
created_at	TIMESTAMP
9. CUSTOM QUOTES TABLE

For "Build Your Coverage"

Field	Type
id	UUID
booking_id	UUID
estimated_price	DECIMAL
final_price	DECIMAL
admin_notes	TEXT
10. BOOKING SERVICES TABLE

Stores selected services.

| booking_id |

| service_id |

| quantity |

11. EVENTS TABLE
Field	Type
id	UUID
booking_id	UUID
event_name	Wedding / Reception / Haldi
venue	VARCHAR
city	VARCHAR
start_time	TIME
end_time	TIME
12. PAYMENTS TABLE
Field	Type
id	UUID
booking_id	UUID
payment_type	ADVANCE / SECOND / FINAL
amount	DECIMAL
payment_method	Razorpay / Cash / UPI
transaction_id	VARCHAR
payment_date	TIMESTAMP
13. REVIEWS TABLE
Field	Type
id	UUID
booking_id	UUID
rating	INTEGER
review	TEXT
client_name	VARCHAR
approved	BOOLEAN
14. CONTACT ENQUIRIES
Field	Type
id	UUID
name	VARCHAR
phone	VARCHAR
email	VARCHAR
message	TEXT
status	NEW / CLOSED
15. NOTIFICATIONS
Field	Type
id	UUID
title	VARCHAR
message	TEXT
type	INFO / WARNING
is_read	BOOLEAN
16. TIMELINE TABLE

For client progress.

Field	Type
booking_id	UUID
stage	VARCHAR
completed	BOOLEAN
updated_at	TIMESTAMP

Stages

Booking Confirmed
Team Assigned
Shoot Completed
Editing Started
Album Designing
Final Delivery
17. FUTURE GALLERY TABLE

Reserved for Version 2.

Field	Type
id	UUID
booking_id	UUID
album_name	VARCHAR
cloudinary_folder	VARCHAR
18. FUTURE MEDIA TABLE

| gallery_id |

| image_url |

| thumbnail |

| media_type |

19. FUTURE STAFF TABLE
Field	Type
id	UUID
name	VARCHAR
role	Photographer / Editor
phone	VARCHAR
20. AUDIT LOGS

Every important action.

Field	Type
id	UUID
user_id	UUID
action	VARCHAR
created_at	TIMESTAMP

Example

Booking Deleted

Payment Updated

Login

Logout

21. Database Rules
UUID as Primary Key
Foreign Keys enforced
Soft delete preferred
Cascade only where safe
Indexed search fields:
Booking Number
Phone
Email
Event Date
22. Naming Convention

Tables

snake_case

Columns

snake_case

Example

booking_number

payment_status

created_at
23. Booking Flow (Database)
Client

↓

Booking

↓

Package

↓

Payment

↓

Timeline

↓

Review
24. Future Scalability

Database should support:

Multiple Studios
Multiple Admins
Multiple Photographers
Multiple Events
Unlimited Clients
AI Features
Client Gallery

No redesign required.

25. Backup Strategy
Daily Automatic Backup
Weekly Full Backup
Monthly Archive
Restore Testing Every Month
26. Security Rules
Passwords never stored in plain text.
Sensitive keys stored in environment variables.
Payment records immutable after success.
Audit logs for all admin actions.
27. Data Retention
Bookings: Permanent
Payments: Permanent
Reviews: Permanent
Contact Enquiries: 2 Years
Notifications: 6 Months
Logs: 1 Year
28. Business Logic Rules
One booking can have multiple events.
One booking can have multiple payments.
One client can have multiple bookings.
Custom packages are linked to bookings, not stored as permanent packages.
Reviews are published only after admin approval.
29. Future Ready Tables (Reserved)

These will be added in future versions without affecting the existing schema:

Coupons
Referral Program
Gift Cards
Staff Attendance
Expense Tracking
Equipment Inventory
AI Recommendations
SMS Logs
Email Templates