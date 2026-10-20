1. API Overview

Architecture Style

REST API

Base URL

/api/v1

Response Format

{
  "success": true,
  "message": "Booking created successfully",
  "data": {}
}

Error Format

{
  "success": false,
  "message": "Validation Failed",
  "errors": []
}
2. Authentication APIs
Admin Login
POST /api/v1/auth/login

Request

{
  "email": "admin@vkcreation.com",
  "password": "********"
}

Response

{
  "token": "...",
  "user": {}
}
Logout
POST /api/v1/auth/logout
Current User
GET /api/v1/auth/me
3. Packages APIs
Get All Packages
GET /api/v1/packages
Package Details
GET /api/v1/packages/{id}
Create Package (Admin)
POST /api/v1/packages
Update Package
PUT /api/v1/packages/{id}
Delete Package
DELETE /api/v1/packages/{id}
4. Services APIs
GET /api/v1/services
POST /api/v1/services
PUT /api/v1/services/{id}
DELETE /api/v1/services/{id}
5. Booking APIs
Create Booking
POST /api/v1/bookings

Request

{
  "client": {},
  "packageId": "",
  "eventDate": "",
  "venue": "",
  "city": ""
}
Booking Details
GET /api/v1/bookings/{bookingId}
Booking List
GET /api/v1/bookings

Supports:

Search
Filter
Pagination
Sort
Update Booking
PUT /api/v1/bookings/{bookingId}
Cancel Booking
DELETE /api/v1/bookings/{bookingId}
6. Availability API
GET /api/v1/availability

Query

?date=2026-12-18

Response

{
 "available": true
}
7. Build Your Coverage APIs

Submit Custom Quote

POST /api/v1/custom-quote

Admin Quote Approval

PUT /api/v1/custom-quote/{id}
8. Payment APIs

Create Razorpay Order

POST /api/v1/payments/create-order

Verify Payment

POST /api/v1/payments/verify

Payment History

GET /api/v1/payments

Payment Details

GET /api/v1/payments/{id}
9. Reviews APIs

Get Reviews

GET /api/v1/reviews

Submit Review

POST /api/v1/reviews

Approve Review

PUT /api/v1/reviews/{id}
10. Contact APIs

Submit Contact Form

POST /api/v1/contact

Get Enquiries

GET /api/v1/contact
11. Dashboard APIs

Dashboard Statistics

GET /api/v1/dashboard

Today's Events

GET /api/v1/dashboard/events

Revenue

GET /api/v1/dashboard/revenue

Upcoming Bookings

GET /api/v1/dashboard/upcoming

Pending Payments

GET /api/v1/dashboard/pending-payments
12. Clients APIs

All Clients

GET /api/v1/clients

Client Details

GET /api/v1/clients/{id}

Update Client

PUT /api/v1/clients/{id}

Delete Client

DELETE /api/v1/clients/{id}
13. Timeline APIs

Get Booking Timeline

GET /api/v1/timeline/{bookingId}

Update Timeline Stage

PUT /api/v1/timeline/{bookingId}
14. Notification APIs

Get Notifications

GET /api/v1/notifications

Mark as Read

PUT /api/v1/notifications/{id}
15. Future Gallery APIs

Gallery List

GET /api/v1/gallery/{bookingId}

Upload Images

POST /api/v1/gallery/upload

Delete Media

DELETE /api/v1/gallery/media/{id}

Download Album

GET /api/v1/gallery/download
16. Admin APIs

Dashboard

Bookings

Payments

Packages

Clients

Services

Reports

Settings

All protected by Admin Authentication.

17. Pagination Standard
?page=1

&size=20

&sort=createdAt

&direction=desc
18. Search Standard
?q=Rahul
19. Filters
status

paymentStatus

package

city

date

eventType
20. HTTP Status Codes
Code	Meaning
200	Success
201	Created
400	Validation Error
401	Unauthorized
403	Forbidden
404	Not Found
409	Conflict
500	Internal Server Error
21. Validation Rules

Booking Date cannot be in the past.

Phone Number required.

Email optional.

Package required unless using Build Your Coverage.

Advance Payment required before confirmation.

22. Security

JWT Authentication

Password Hashing

HTTPS Only

Rate Limiting

CORS

Input Validation

23. API Naming Rules

Plural Resources

Example

/bookings

/packages

/services

/payments
24. Versioning
/api/v1

Future

/api/v2
25. Logging

Every API call logs:

User
Time
Endpoint
IP
Status Code
26. Future APIs (Reserved)
WhatsApp Automation
SMS
Email Templates
AI Quote Generator
Face Recognition Gallery
Referral Program
Equipment Management
27. Business Workflow
Visitor

↓

Booking

↓

Payment

↓

Confirmation

↓

Admin Dashboard

↓

Shoot

↓

Timeline Update

↓

Review

↓

Future Gallery
28. API Performance Targets
Average response < 300 ms for common reads.
Dashboard < 1 second.
Payment verification < 2 seconds (excluding gateway delay).
Support caching for public endpoints like packages and services.
29. Error Codes (Custom)
Code	Meaning
VK001	Booking date unavailable
VK002	Package not found
VK003	Payment verification failed
VK004	Booking already cancelled
VK005	Insufficient permissions

These codes help frontend show meaningful messages.