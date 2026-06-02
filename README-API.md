# PIANOW API Documentation

## Overview

The backend API is built using Next.js API routes. All endpoints are located in the `app/api` directory.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Endpoints

### Authentication

#### POST `/api/auth/login`
Login user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

#### GET `/api/auth/me`
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Lessons

#### GET `/api/lessons`
Get all lessons.

**Response:**
```json
{
  "lessons": [
    {
      "id": "1",
      "title": "Introduction to Piano",
      "description": "Learn the basics",
      "duration": "30 minutes",
      "level": "Beginner",
      "teacherId": "1",
      "isFree": true
    }
  ]
}
```

#### GET `/api/lessons/[id]`
Get a specific lesson by ID.

#### POST `/api/lessons`
Create a new lesson (requires authentication).

#### PUT `/api/lessons/[id]`
Update a lesson (requires authentication).

#### DELETE `/api/lessons/[id]`
Delete a lesson (requires authentication).

### Products

#### GET `/api/products`
Get all products. Optionally filter by category.

**Query Parameters:**
- `category`: Filter by category (piano, guitar, drums, audio, accessories, instruments)

**Example:**
```
GET /api/products?category=piano
```

#### GET `/api/products/[id]`
Get a specific product by ID.

#### POST `/api/products`
Create a new product (requires authentication).

### Cart

#### GET `/api/cart`
Get user's cart (requires authentication).

#### POST `/api/cart`
Add item to cart (requires authentication).

**Request Body:**
```json
{
  "productId": "1",
  "quantity": 2
}
```

#### PUT `/api/cart`
Update cart items (requires authentication).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 3
    }
  ]
}
```

### Orders

#### GET `/api/orders`
Get user's orders (requires authentication).

#### POST `/api/orders`
Create a new order from cart (requires authentication).

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### Teachers

#### GET `/api/teachers`
Get all teachers.

#### POST `/api/teachers`
Create a new teacher profile (requires authentication).

## Database

Currently using JSON file storage in the `data/` directory. Files are:
- `users.json` - User accounts
- `lessons.json` - Lesson data
- `teachers.json` - Teacher profiles
- `products.json` - Product catalog
- `orders.json` - Order history
- `carts.json` - Shopping carts

**Note:** The `data/` directory is gitignored. For production, consider migrating to:
- MongoDB
- PostgreSQL
- MySQL
- Or any other database solution

## Environment Variables

Create a `.env.local` file:

```env
JWT_SECRET=your-secret-key-here-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., user already exists)
- `500` - Internal Server Error

## Usage Example

```typescript
import { apiClient } from '@/lib/api-client'

// Login
const { user, token } = await apiClient.login('user@example.com', 'password')

// Get products
const { products } = await apiClient.getProducts('piano')

// Add to cart
await apiClient.addToCart('product-id', 2)

// Create order
const { order } = await apiClient.createOrder({
  street: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'USA'
})
```
