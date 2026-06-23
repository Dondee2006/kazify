# Kazify Backend REST API Specification

This documentation outlines the endpoints, authentication mechanisms, request payloads, and status codes for the Kazify production-ready Express API backend.

---

## 🔒 Authentication & Headers

All authenticated routes require a Firebase JSON Web Token (JWT) sent via the `Authorization` header:

```http
Authorization: Bearer <FIREBASE_JWT_ID_TOKEN>
```

### 🛠️ Local Development Auth Bypass
If the server environment setting `BYPASS_FIREBASE_AUTH=true` is enabled, authentication verification is mocked. Developers can pass simulated user identity identifiers directly via custom headers:

| Header Name | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `x-bypass-firebase-id` | String | Simulated Firebase User UID | `mock-freelancer-koffi` |
| `x-bypass-firebase-email` | String | Simulated User Email | `koffi@mensah.com` |
| `x-bypass-firebase-name` | String | Simulated User Name | `Koffi Mensah` |
| `x-onboarding-role` | String | Initial Role selection (`CLIENT` \| `FREELANCER`) | `FREELANCER` |

---

## 🛡️ Global Security Features

1. **Helmet headers:** Standard HTTP protection layers are set on all responses (XSS Filters, HSTS, Frameguard, etc.).
2. **API Rate Limiter:** Capped at `100 requests per 15-minute window` per origin IP address to prevent brute-force attacks and scraper spamming. Returns HTTP status `429 Too Many Requests`.

---

## 🗺️ Route Index

### 1. Authentication & Sync (`/api/auth`)

#### `POST /sync`
Synchronizes the verified Firebase account metadata to the local PostgreSQL database. Auto-initializes a new profile if one does not exist.
* **Headers:** Authenticated headers required.
* **Request Body:**
  ```json
  {
    "role": "FREELANCER",
    "name": "Koffi Mensah",
    "email": "koffi@mensah.com"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "id": "782bd260-e421-4191-be1f-5014798e29a3",
    "firebaseId": "mock-freelancer-koffi",
    "email": "koffi@mensah.com",
    "name": "Koffi Mensah",
    "role": "FREELANCER",
    "balance": "0.00",
    "createdAt": "2026-05-28T02:00:00.000Z"
  }
  ```

---

### 2. Gigs (`/api/gigs`)

#### `GET /`
Fetches a list of active freelancer service listings, applying optional price filters and text-search queries.
* **Headers:** Public endpoint. No authentication required.
* **Query Parameters:**
  * `page` (Integer, default `1`) - Feed pagination page index.
  * `limit` (Integer, default `10`) - Result count size bounds.
  * `search` (String) - Text search keyword matched against titles/descriptions.
  * `category` (String) - Matches category type (e.g. `Programming & IT`).
  * `minPrice` (Decimal) - Filter gigs costing equal or more.
  * `maxPrice` (Decimal) - Filter gigs costing equal or less.
* **Success Response (200 OK):**
  ```json
  {
    "gigs": [
      {
        "id": "e0a6d092-2ba6-455b-80df-8b277cc2c2aa",
        "title": "Custom Next.js Web Application",
        "description": "Clean production-ready React frontend matching rich animations...",
        "category": "Programming & IT",
        "basePrice": "450.00",
        "deliveryDays": 7,
        "status": "ACTIVE",
        "freelancerId": "782bd260-e421-4191-be1f-5014798e29a3",
        "freelancer": {
          "id": "782bd260-e421-4191-be1f-5014798e29a3",
          "name": "Koffi Mensah",
          "email": "koffi@mensah.com"
        }
      }
    ],
    "pagination": {
      "totalItems": 1,
      "totalPages": 1,
      "currentPage": 1,
      "itemsPerPage": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

#### `POST /`
Publishes a new freelancer service listing to the active catalog.
* **Headers:** Authenticated headers required. User role must be `FREELANCER`.
* **Request Body:**
  ```json
  {
    "title": "RESTful API Integration (Python / Node)",
    "description": "Secure connection scripts, stripe webhooks integration...",
    "basePrice": 120.00,
    "deliveryDays": 4,
    "category": "Programming & IT"
  }
  ```
* **Success Response (210 Created):** Returns the created Gig record.

---

### 3. Job Requests / Shoutouts (`/api/requests`)

#### `GET /`
Fetches a list of client broadcast job requests/shoutouts.
* **Headers:** Public endpoint. No authentication required.
* **Query Parameters:** `page`, `limit` (similar pagination parameters).
* **Success Response (200 OK):** Returns a list of requests with client info.

#### `POST /`
Publishes a client job post asking for bids.
* **Headers:** Authenticated headers required. User role must be `CLIENT`.
* **Request Body:**
  ```json
  {
    "title": "Setup Webhooks for Agritech Platform",
    "description": "Need to securely sign webhook validation headers...",
    "budget": 80.00,
    "category": "Programming & IT"
  }
  ```
* **Success Response (201 Created):** Returns the created JobRequest record.

---

### 4. Payments (`/api/payments`)

#### `POST /create-checkout-session`
Initializes a payment intent workflow. Generates a database transaction record in state `PENDING_ESCROW`, and compiles a Stripe checkout URL redirect.
* **Headers:** Authenticated headers required.
* **Request Body:** Use either `gigId` OR `jobRequestId` (not both).
  ```json
  {
    "gigId": "e0a6d092-2ba6-455b-80df-8b277cc2c2aa"
  }
  ```
  *Or hire for a Job Request:*
  ```json
  {
    "jobRequestId": "75e8db2b-586b-4e14-9988-cb942d99d911",
    "freelancerId": "782bd260-e421-4191-be1f-5014798e29a3"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "checkoutUrl": "/order-simulation/8525b682-127e-4b47-ba0e-a8cb71946059?status=simulation",
    "orderId": "8525b682-127e-4b47-ba0e-a8cb71946059",
    "mode": "mock"
  }
  ```

#### `POST /webhook`
Cryptographically validated gateway trigger endpoint. On payment completion, updates Order state to `ESCROW_HELD` and logs ledger transaction audits.
* **Headers:** Stripe signature header required in production mode.
* **Bypass Testing Trigger:** Pass header `x-mock-webhook: true` along with body `{"orderId": "<uuid>"}` to bypass crypt-signatures locally.
* **Success Response (200 OK):**
  ```json
  {
    "received": true
  }
  ```

---

### 5. Orders & Escrow Actions (`/api/orders`)

#### `GET /`
Lists orders associated with the authenticated user profile (as client or freelancer).
* **Headers:** Authenticated. Returns detailed list of active and archived escrow tasks.

#### `GET /:id`
Fetches a single order detailed status model.
* **Headers:** Authenticated (restricted to participants).

#### `PUT /:id/submit-work`
Allows the assigned freelancer to complete the order task. Sets order state to `UNDER_REVIEW`.
* **Headers:** Authenticated (restricted to freelancer).
* **Success Response (200 OK):** Updated order object.

#### `PUT /:id/release-funds`
Allows the client to release the held funds. Applies a **10% platform service fee**, credits the freelancer's wallet balance, logs transaction entries, and sets order state to `COMPLETED`.
* **Headers:** Authenticated (restricted to client).
* **Success Response (200 OK):** Updated order object.
