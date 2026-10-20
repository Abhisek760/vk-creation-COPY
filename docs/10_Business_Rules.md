# VK Creation - Business Rules

**Document Version:** 1.1  
**Status:** Approved  
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the official business logic used by the VK Creation platform.

It explains how every service is calculated inside the software.

This document will be used by:

- Wedding Coverage Builder
- Live Price Calculator
- Quote Generator
- Booking System
- Admin Panel
- Future Mobile Application

Pricing values are taken from the Pricing Master Sheet.

---

# 2. General Rules

- All prices are calculated in Indian Rupees (INR).
- Only selected services are included in the quotation.
- Unselected services contribute ₹0.
- Final quotation is the sum of all selected services.
- GST is calculated separately (Future).
- Travel charges are not included.
- Accommodation charges are not included.
- Discounts are applied after subtotal calculation.

---

# 3. Traditional Photography (TP001)

Coverage

Complete Wedding

Input

Total Photos

Calculation Rule

IF Total Photos ≤ 2000

Total = Total Photos × ₹8

ELSE

Total = Total Photos × ₹7

Examples

1800 Photos

1800 × ₹8

= ₹14,400

---

2400 Photos

2400 × ₹7

= ₹16,800

---

# 4. Traditional Videography (TV001 / TV002)

Coverage

Complete Wedding

Inputs

- Video Quality
- Total Coverage Hours
- Pendrive (Optional)

Calculation Rule

IF HD Selected

Video Cost = Hours × ₹3500

IF 4K Selected

Video Cost = Hours × ₹4500

IF Pendrive Selected

Add ₹1500

Final Videography Cost

=

Video Cost

+

Pendrive Charge

Examples

HD

8 Hours

Pendrive Included

(8 × 3500)

+

1500

=

₹29,500

---

4K

10 Hours

No Pendrive

10 × 4500

=

₹45,000

---

# 5. Candid Photography (CP001)

Coverage

Client selects the number of coverage days.

One coverage day may include multiple wedding events.

Input

Coverage Days

Calculation Rule

Total

=

Coverage Days × ₹5000

Example

2 Days

=

₹10,000

---

# 6. Cinematic Film (CF001)

Coverage

Client selects the number of coverage days.

One coverage day may include multiple wedding events.

Input

Coverage Days

Calculation Rule

Total

=

Coverage Days × ₹20,000

Example

2 Days

=

₹40,000

---

# 7. Drone Shoot (DR001)

Coverage

Client selects the number of coverage days.

One coverage day may include multiple wedding events.

Input

Coverage Days

Calculation Rule

Total

=

Coverage Days × ₹5000

Example

3 Days

=

₹15,000

---

# 8. Instagram / WhatsApp Reels (RL001)

Input

Number of Reels

Calculation Rule

Total

=

Number of Reels × ₹2000

Example

3 Reels

=

₹6000

---

# 9. Edited Photos (EP001)

Input

Number of Edited Photos

Calculation Rule

Total

=

Edited Photos × ₹25

Example

40 Photos

=

₹1000

---

# 10. Digital Invitation Video (DI001)

Input

Selected

Yes / No

Calculation Rule

IF Selected

₹1500

ELSE

₹0

---

# 11. Album (AL001)

Inputs

- Album Sheet
- Album Cover

Calculation Rule

Album Total

=

Selected Sheet Price

+

Selected Cover Price

Album Sheet pricing will be updated after business confirmation.

---

# 12. Final Quote Formula

Subtotal

=

Traditional Photography

+

Traditional Videography

+

Candid Photography

+

Cinematic Film

+

Drone Shoot

+

Instagram Reels

+

Edited Photos

+

Digital Invitation

+

Album

---

Grand Total

=

Subtotal

+

GST (Future)

+

Travel Charges (If Applicable)

+

Accommodation Charges (If Applicable)

-

Discount (If Applicable)

---

# 13. Business Notes

- Traditional Photography always covers the complete wedding.
- Traditional Videography always covers the complete wedding.
- Candid Photography is charged per coverage day.
- Cinematic Film is charged per coverage day.
- Drone Shoot is charged per coverage day.
- One coverage day may include multiple wedding events.
- Pendrive is an optional add-on.
- Album pricing depends on selected sheet and cover.

---

# 14. Future Enhancements

Future versions may support:

- Dynamic Discounts
- Coupon Codes
- Festival Offers
- AI Price Recommendation
- Destination Wedding Charges
- Overtime Charges
- Advance Payment Calculation
- Remaining Balance Calculation

---

# 15. Change Log

## Version 1.1

- Updated Traditional Photography pricing rule.
- Added HD and 4K videography calculations.
- Added Pendrive business logic.
- Updated all day-based services.
- Added Digital Invitation calculation.
- Improved Album calculation rules.
- Added business notes.
- Improved quotation formula.