# User Service API

The User Service API handles user management tasks such as registration, login, profile updates, password resets, and email verification.

## Base URL

http://localhost:3000/api/v1

## Endpoints

### 1. Register User

- **Endpoint:** `/register`
- **Method:** `POST`
- **Description:** Registers a new user.

**Request Body:**

{
"username": "string",
"email": "string",
"password": "string"
}

**Response:**

- **Success:** `201 Created`

  {
  "message": "User registered"
  }

- **Error:** `400 Bad Request`

  {
  "error": "Validation error message"
  }

### 2. Login User

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Logs in a user and returns a JWT token.

**Request Body:**

{
"email": "string",
"password": "string"
}

**Response:**

- **Success:** `200 OK`

  {
  "token": "JWT Token"
  }

- **Error:** `400 Bad Request`

  {
  "error": "Invalid credentials"
  }

### 3. Get Profile

- **Endpoint:** `/profile`
- **Method:** `GET`
- **Description:** Retrieves the user’s profile. Requires authentication.

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

**Response:**

- **Success:** `200 OK`

  {
  "message": "This is a protected route",
  "user": {
  "id": "string",
  "username": "string",
  "email": "string",
  "createdAt": "ISO Date"
  }
  }

- **Error:** `401 Unauthorized` or `500 Internal Server Error`

  {
  "error": "Error message"
  }

### 4. Update Profile

- **Endpoint:** `/profile`
- **Method:** `PUT`
- **Description:** Updates the user’s profile. Requires authentication.

**Headers:**

- `Authorization: Bearer YOUR_JWT_TOKEN`

**Request Body:**

{
"username": "string",
"email": "string"
}

**Response:**

- **Success:** `200 OK`

  {
  "message": "Profile updated"
  }

- **Error:** `400 Bad Request` or `401 Unauthorized`

  {
  "error": "Error message"
  }

### 5. Forgot Password

- **Endpoint:** `/forgot-password`
- **Method:** `POST`
- **Description:** Initiates password reset process by sending a reset token via email.

**Request Body:**

{
"email": "string"
}

**Response:**

- **Success:** `200 OK`

  {
  "message": "Password reset email sent"
  }

- **Error:** `400 Bad Request`

  {
  "error": "Error message"
  }

### 6. Reset Password

- **Endpoint:** `/reset-password`
- **Method:** `POST`
- **Description:** Resets the password using a reset token.

**Request Body:**

{
"resetToken": "string",
"newPassword": "string"
}

**Response:**

- **Success:** `200 OK`

  {
  "message": "Password reset successfully"
  }

- **Error:** `400 Bad Request`

  {
  "error": "Error message"
  }

### 7. Verify Email

- **Endpoint:** `/verify-email`
- **Method:** `POST`
- **Description:** Verifies a user’s email address.

**Request Body:**

{
"verificationToken": "string"
}

**Response:**

- **Success:** `200 OK`

  {
  "message": "Email verified"
  }

- **Error:** `400 Bad Request`

  {
  "error": "Error message"
  }

## Authentication

- **Token Type:** JWT
- **Token Expiration:** 1 hour
- **Refresh Token Expiration:** 7 days

## Error Codes

- `400 Bad Request`: Invalid request data.
- `401 Unauthorized`: Authentication or authorization failure.
- `404 Not Found`: Endpoint or resource not found.
- `500 Internal Server Error`: Server-side error.

## Rate Limiting

- **Rate Limit:** 100 requests per hour per IP address.

## Security Considerations

- **Password Storage:** Passwords are hashed using bcrypt.
- **Token Storage:** JWT tokens are used for authentication.
- **Data Encryption:** Sensitive data is encrypted.
