# My NCLEX Prep — API Reference

A concise, developer-friendly API reference for the My NCLEX Prep backend. Share this with frontend engineers — it contains base URL, headers, and one concrete request example per endpoint.

---

## Table of contents

- [Base URL & env](#base-url--env)
- [Global headers](#global-headers)
- [Content types & file uploads](#content-types--file-uploads)
- [Quick auth examples](#quick-auth-examples)
- [One example per endpoint](#one-example-per-endpoint)
  - [Auth](#auth)
  - [User](#user)
  - [Category](#category)
  - [Community](#community)
  - [Exam](#exam)
  - [Lesson](#lesson)
  - [Mnemonic](#mnemonic)
  - [Onboarding screens](#onboarding-screens)
  - [Study material](#study-material)
  - [Study schedule](#study-schedule)
  - [Study progress](#study-progress)
  - [Notifications](#notifications)
  - [Review](#review)
  - [Public (FAQ / Contact)](#public-faq--contact)
  - [Support](#support)

---

## Base URL & env

Set these env values on the frontend (or replace when building requests):

```
IP_ADDRESS = your_ip_address
PORT = your_port
BASE_URL = http://IP_ADDRESS:PORT/api/v1
```

Example full URL: `http://IP_ADDRESS:PORT/api/v1/auth/login`


## Global headers

- Authorization: `Bearer <ACCESS_TOKEN>` (for protected routes)
- Content-Type: `application/json` (use `multipart/form-data` for files)

When sending files use `multipart/form-data`; for JSON bodies use `application/json`.


## Content types & file uploads

- Use `multipart/form-data` for routes that accept files (profile, category image, study material doc, stems images).
- When an endpoint expects a JSON array together with files (e.g. `stems`), send the array as a JSON string in a form field:
  - Example form field: `stems = JSON.stringify([...])`
  - Files go in the `image` or `doc` fields as required by the route.


## Quick auth examples

Sign up

```json
POST /auth/signup
Content-Type: application/json
{
  "email": "jane@example.com",
  "password": "password123",
  "name": "Jane Doe",
  "phone": "+1234567890",
  "role": "student"
}
```

Login

```json
POST /auth/login
Content-Type: application/json
{ "email": "jane@example.com", "password": "password123" }
```


---

## One example per endpoint

Each entry: method, relative path (`/api/v1/...`), headers, and one concrete request example.

### Auth

**POST** ` /auth/signup`

Headers: `Content-Type: application/json`

Body:
```json
{
  "email": "jane@example.com",
  "password": "password123",
  "name": "Jane Doe",
  "phone": "+1234567890",
  "role": "student"
}
```

---

**POST** `/auth/login`

Headers: `Content-Type: application/json`

Body:
```json
{ "email": "jane@example.com", "password": "password123" }
```

---

**POST** `/auth/admin-login`

Headers: `Content-Type: application/json`

Body:
```json
{ "email": "admin@example.com", "password": "adminPass" }
```

---

**GET** `/auth/google`

- OAuth redirect — open in browser. No body.

---

**POST** `/auth/verify-account`

Headers: `Content-Type: application/json`

Body:
```json
{ "email": "jane@example.com", "oneTimeCode": "123456" }
```

---

**POST** `/auth/forget-password`

Headers: `Content-Type: application/json`

Body:
```json
{ "email": "jane@example.com" }
```

---

**POST** `/auth/reset-password`

Headers: `Content-Type: application/json`

Body:
```json
{ "newPassword": "newPass123", "confirmPassword": "newPass123" }
```

---

**POST** `/auth/change-password` (protected)

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "currentPassword": "oldPass", "newPassword": "newPass123", "confirmPassword": "newPass123" }
```

---

**DELETE** `/auth/delete-account` (protected)

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "password": "currentPassword" }
```

---

**POST** `/auth/refresh-token`

Headers: `Content-Type: application/json`

Body:
```json
{ "refreshToken": "refresh-token-value" }
```

---

### User

**GET** `/user/profile`

Headers: `Authorization: Bearer <token>`

No body.

---

**PATCH** `/user/profile`

Headers: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

Form-data example (send as multipart):
- `name`: "Jane Updated"
- `phone`: "+1234567890"
- `profile`: (file)

---

**DELETE** `/user/profile`

Headers: `Authorization: Bearer <token>`

No body.

---

**GET** `/user/` (admin)

Headers: `Authorization: Bearer <admin-token>`

No body.

---

**GET** `/user/:userId` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

**PATCH** `/user/:userId` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: application/json`

Body:
```json
{ "status": "active" }
```

---

### Category

**GET** `/category/`

Public — no headers required.

---

**GET** `/category/:id`

Public — no headers required.

---

**POST** `/category/` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: multipart/form-data`

Form-data:
- `name`: "Cardiology"
- `description`: "Heart topics"
- `image`: (file)

---

**PATCH** `/category/:id` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: multipart/form-data`

Form-data example:
- `name`: "Updated Category"

---

**DELETE** `/category/:id` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

### Community

**GET** `/community/`

Public — no headers.

---

**GET** `/community/:id`

Public — no headers.

---

**POST** `/community/` (auth)

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{
  "userId": "64b8a7e0f0a0000000000000",
  "question": "How to interpret ECG?",
  "details": "Short details",
  "tags": ["cardiology","ecg"]
}
```

---

**PATCH** `/community/:id` (auth)

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "question": "Updated question text" }
```

---

**DELETE** `/community/:id` (auth)

Headers: `Authorization: Bearer <token>`

---

**POST** `/community/:communityId/answers` (auth)

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "comments": "Here is the answer details" }
```

---

**PATCH** `/community/:communityId/answers/:answerId` (auth)

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "comments": "Updated answer text" }
```

---

**DELETE** `/community/:communityId/answers/:answerId` (auth)

Headers: `Authorization: Bearer <token>`

---

### Exam

**POST** `/exam/stems` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: multipart/form-data`

Form-data:
- `stems`: JSON.stringify([{ "stemTitle": "Case 1", "stemDescription": "Patient with chest pain", "table": [{ "key": "age", "value": 65 }] }])
- `image`: (file or files)

---

**POST** `/exam/questions` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: application/json`

Body:
```json
{
  "questions": [
    {
      "type": "radio",
      "questionText": "What is normal heart rate?",
      "options": [
        { "label": "50-60 bpm", "value": "50-60" },
        { "label": "60-100 bpm", "value": "60-100" }
      ],
      "correctAnswer": 1,
      "points": 1
    }
  ]
}
```

---

**GET** `/exam/` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

**POST** `/exam/` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: application/json`

Body:
```json
{
  "category": "readiness",
  "name": "Readiness Exam 1",
  "code": "R-001",
  "description": "Short description",
  "durationMinutes": 120,
  "passMark": 50,
  "createdBy": "64b8a7e0f0a0000000000000"
}
```

---

**GET** `/exam/readiness`

Headers: `Authorization: Bearer <token>`

---

**GET** `/exam/standalone`

Headers: `Authorization: Bearer <token>`

---

**GET** `/exam/:id` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

**DELETE** `/exam/:id` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

**GET** `/exam/:examId/questions`

Headers: `Authorization: Bearer <token>`

---

### Lesson

**POST** `/lesson/stems` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: multipart/form-data`

Form-data: `stems` (JSON string) + `image` files

---

**POST** `/lesson/questions` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: application/json`

Body: same shape as exam questions example above.

---

**GET** `/lesson/` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

**POST** `/lesson/` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: application/json`

Body:
```json
{
  "category": "theory",
  "name": "Lesson 1",
  "description": "Lesson description",
  "isPublished": true,
  "durationMinutes": 40
}
```

---

**GET** `/lesson/next_gen`

Headers: `Authorization: Bearer <token>`

---

**GET** `/lesson/case_study`

Headers: `Authorization: Bearer <token>`

---

**GET** `/lesson/:id` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

**DELETE** `/lesson/:id` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

**GET** `/lesson/:lessonId/questions`

Headers: `Authorization: Bearer <token>`

---

### Mnemonic

**GET** `/mnemonic/`

Public — no headers.

---

**GET** `/mnemonic/:id`

Public — no headers.

---

**POST** `/mnemonic/` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: application/json`

Body:
```json
{ "title": "ABC Rule", "content": "Airway, Breathing, Circulation" }
```

---

**DELETE** `/mnemonic/:id` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

### Onboarding screens

**GET** `/onboardingscreen/`

Public — no headers.

---

**GET** `/onboardingscreen/:id`

Public — no headers.

---

**POST** `/onboardingscreen/` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: multipart/form-data`

Form-data:
- `title`: "Welcome"
- `description`: "Welcome to the app"
- `order`: 1
- `image`: (file)

---

**DELETE** `/onboardingscreen/:id` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

### Study material

**GET** `/studymaterial/`

Headers: `Authorization: Bearer <token>`

---

**GET** `/studymaterial/study-guide`

Headers: `Authorization: Bearer <token>`

---

**GET** `/studymaterial/:id`

Headers: `Authorization: Bearer <token>`

---

**POST** `/studymaterial/` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: multipart/form-data`

Form-data:
- `name`: "NCLEX Guide"
- `category`: "guides"
- `type`: "pdf"
- `doc`: (file)

---

**DELETE** `/studymaterial/:id` (admin)

Headers: `Authorization: Bearer <admin-token>`

---

### Study schedule

**GET** `/studyschedule/by-date`

Headers: `Authorization: Bearer <token>`

---

**GET** `/studyschedule/`

Headers: `Authorization: Bearer <token>`

---

**GET** `/studyschedule/:id`

Headers: `Authorization: Bearer <token>`

---

**POST** `/studyschedule/`

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "calendar": "2025-09-01", "title": "Morning study", "description": "Chapters 1-3" }
```

---

**PATCH** `/studyschedule/:id`

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "title": "Updated title" }
```

---

**DELETE** `/studyschedule/:id`

Headers: `Authorization: Bearer <token>`

---

### Study progress

**POST** `/studyprogress/:studentId/:examId/session/start`

Headers: `Authorization: Bearer <student-token>`, `Content-Type: application/json`

Body:
```json
{ "startedAt": "2025-08-22T09:00:00.000Z" }
```

---

**POST** `/studyprogress/:studentId/:examId/session/end`

Headers: `Authorization: Bearer <student-token>`, `Content-Type: application/json`

Body:
```json
{ "endedAt": "2025-08-22T10:00:00.000Z" }
```

---

**POST** `/studyprogress/:studentId/:examId/question/:questionId/complete`

Headers: `Authorization: Bearer <student-token>`, `Content-Type: application/json`

Body:
```json
{ "result": "correct", "answer": "60-100" }
```

---

**GET** `/studyprogress/:studentId/:examId/bookmarks`

Headers: `Authorization: Bearer <student-token>`

---

**POST** `/studyprogress/:studentId/:examId/bookmark/:questionId`

Headers: `Authorization: Bearer <student-token>`

---

**DELETE** `/studyprogress/:studentId/:examId/bookmark/:questionId`

Headers: `Authorization: Bearer <student-token>`

---

**GET** `/studyprogress/:studentId/:examId/stats`

Headers: `Authorization: Bearer <student-token>`

---

**GET** `/studyprogress/:studentId/:examId`

Headers: `Authorization: Bearer <student-token>`

---

### Notifications

**GET** `/notifications/`

Headers: `Authorization: Bearer <token>`

---

**GET** `/notifications/:id`

Headers: `Authorization: Bearer <token>`

---

**GET** `/notifications/all`

Headers: `Authorization: Bearer <token>`

---

### Review

**GET** `/review/`

Headers: `Authorization: Bearer <token>`

---

**POST** `/review/`

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "reviewee": "64b8a7e0f0a0000000000000", "rating": 5, "review": "Excellent" }
```

---

**GET** `/review/:id`

Headers: `Authorization: Bearer <token>`

---

**PATCH** `/review/:id`

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "rating": 4 }
```

---

**DELETE** `/review/:id`

Headers: `Authorization: Bearer <token>`

---

### Public (FAQ / Contact)

**POST** `/public/`

Headers: `Content-Type: application/json`

Body:
```json
{ "content": "Site privacy policy", "type": "privacy-policy" }
```

---

**GET** `/public/:type`

Public — no headers.

---

**POST** `/public/contact`

Headers: `Content-Type: application/json`

Body:
```json
{ "name": "John", "email": "john@example.com", "phone": "+1234567890", "country": "Bangladesh", "message": "Help with billing" }
```

---

**POST** `/public/faq` (admin)

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: application/json`

Body:
```json
{ "question": "How to reset password?", "answer": "Use forget password flow" }
```

---

### Support

**GET** `/support/`

Headers: `Authorization: Bearer <admin-token>`

---

**GET** `/support/:id`

Headers: `Authorization: Bearer <admin-token>`

---

**POST** `/support/`

Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

Body:
```json
{ "subject": "Payment failed", "message": "Payment failed while checking out", "attachments": [] }
```

---

**PATCH** `/support/:id`

Headers: `Authorization: Bearer <admin-token>`, `Content-Type: application/json`

Body:
```json
{ "status": "in_progress" }
```

---

**DELETE** `/support/:id`

Headers: `Authorization: Bearer <admin-token>`

---

## Next steps

- I can convert these examples into a Postman collection and add it to the `postman/` folder so the frontend can import it directly.
- I can expand each endpoint with expected success response examples by reading controllers.

Tell me which you'd like next (Postman collection or response examples).
