# VK Creation - Service Model

**Document Version:** 1.0  
**Status:** Approved  
**Last Updated:** July 2026

---

# 1. Purpose

This document defines how every business service is represented inside the software.

It connects:

Business Rules

↓

Frontend UI

↓

Backend Logic

↓

Database

Every service must follow this model.

---

# 2. Service Categories

## Coverage Services

- Traditional Photography
- Traditional Videography
- Candid Photography
- Cinematic Film
- Drone Shoot

---

## Deliverables

- Album
- Pendrive

---

## Digital Content

- Instagram Reels
- Edited Photos
- Digital Invitation Video

---

# 3. Standard Service Structure

Every service must contain:

- Service Code
- Service Name
- Category
- Pricing Type
- Input Fields
- UI Component
- Validation Rules
- Calculation Function
- API Field
- Database Field
- Status

---

# 4. Service Definitions

---

## TP001 - Traditional Photography

### Category

Coverage Service

### Coverage

Complete Wedding

### Pricing Type

Per Photo

### Input Fields

| Field | Type |
|-------|------|
| Total Photos | Number |

### UI Components

Number Input

### Validation

Minimum = 0

### Calculation Function

calculateTraditionalPhotography()

### API Field

traditionalPhotography

### Database Field

traditional_photos

### Status

Approved

---

## TV001 - Traditional Videography

### Category

Coverage Service

### Coverage

Complete Wedding

### Pricing Type

Per Hour

### Input Fields

| Field | Type |
|-------|------|
| Quality | Dropdown |
| Hours | Number |
| Pendrive | Checkbox |

### Quality Options

- HD
- 4K

### UI Components

Dropdown

Number Input

Checkbox

### Validation

Hours ≥ 1

### Calculation Function

calculateVideography()

### API Field

traditionalVideography

### Database Field

video_quality

video_hours

pendrive_required

### Status

Approved

---

## CP001 - Candid Photography

### Category

Coverage Service

### Pricing Type

Per Day

### Input Fields

| Field | Type |
|-------|------|
| Coverage Days | Number |

### UI Components

Number Input

### Validation

Days ≥ 1

### Calculation Function

calculateCandid()

### API Field

candidPhotography

### Database Field

candid_days

### Status

Approved

---

## CF001 - Cinematic Film

### Category

Coverage Service

### Pricing Type

Per Day

### Input Fields

Coverage Days

### UI Components

Number Input

### Validation

Days ≥ 1

### Calculation Function

calculateCinematic()

### API Field

cinematicFilm

### Database Field

cinematic_days

### Status

Approved

---

## DR001 - Drone Shoot

### Category

Coverage Service

### Pricing Type

Per Day

### Input Fields

Coverage Days

### UI Components

Number Input

### Validation

Days ≥ 1

### Calculation Function

calculateDrone()

### API Field

droneShoot

### Database Field

drone_days

### Status

Approved

---

## RL001 - Instagram Reels

### Category

Digital Content

### Pricing Type

Per Reel

### Input Fields

| Field | Type |
|-------|------|
| Reel Quantity | Number |

### UI Components

Number Input

### Validation

Minimum = 0

### Calculation Function

calculateReels()

### API Field

instagramReels

### Database Field

reels_quantity

### Status

Approved

---

## EP001 - Edited Photos

### Category

Digital Content

### Pricing Type

Per Photo

### Input Fields

| Field | Type |
|-------|------|
| Edited Photos | Number |

### UI Components

Number Input

### Validation

Minimum = 0

### Calculation Function

calculateEditedPhotos()

### API Field

editedPhotos

### Database Field

edited_photos

### Status

Approved

---

## DI001 - Digital Invitation Video

### Category

Digital Content

### Pricing Type

Fixed

### Input Fields

| Field | Type |
|-------|------|
| Selected | Checkbox |

### UI Components

Checkbox

### Validation

Boolean

### Calculation Function

calculateInvitation()

### API Field

digitalInvitation

### Database Field

digital_invitation

### Status

Approved

---

## AL001 - Album

### Category

Deliverables

### Pricing Type

Configurable

### Input Fields

| Field | Type |
|-------|------|
| Sheet Type | Dropdown |
| Cover Type | Dropdown |

### UI Components

Dropdown

Dropdown

### Validation

Both selections required

### Calculation Function

calculateAlbum()

### API Field

album

### Database Field

album_sheet

album_cover

### Status

Approved

---

# 5. Common Validation Rules

- Numbers cannot be negative.
- Coverage Days must be at least 1.
- Hours must be at least 1.
- Dropdown fields must contain a valid option.
- Checkbox fields accept only true or false.
- Album requires both Sheet and Cover selection.

---

# 6. Development Guidelines

Frontend must use this document to create form components.

Backend must use this document to validate incoming data.

Database must use this document to design tables and columns.

No service should be implemented outside this model.

---

# 7. Future Scope

Future versions may support:

- Dynamic service creation
- Admin configurable pricing
- Seasonal pricing
- Combo offers
- AI recommendations
- Multi-language service names

---

# 8. Change Log

## Version 1.0

- Initial Service Model created.
- Added all supported services.
- Defined UI components.
- Defined validation rules.
- Added API fields.
- Added database fields.
- Added calculation function references.