# API Endpoints Documentation

## Base URL
All API endpoints are prefixed with `/api`

## Authentication
Most endpoints require authentication. Include the JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## Categories

### Get All Categories
- **URL**: `/api/category`
- **Method**: `GET`
- **Description**: Retrieve all categories
- **Response**: Array of category objects
- **Example Response**:
  ```json
  [
    {
      "_id": "5f8d0d55b54764421b7156c7",
      "name": "Antipasti",
      "description": "Appetizers and starters"
    },
    ...
  ]
  ```

### Create Category (Admin)
- **URL**: `/api/category`
- **Method**: `POST`
- **Authentication**: Required (Admin)
- **Body**:
  ```json
  {
    "name": "Desserts",
    "description": "Sweet dishes and desserts"
  }
  ```
- **Response**: Created category object

### Update Category (Admin)
- **URL**: `/api/category/:id`
- **Method**: `PUT`
- **Authentication**: Required (Admin)
- **URL Parameters**:
  - `id`: Category ID
- **Body**: Fields to update
- **Response**: Updated category object

### Delete Category (Admin)
- **URL**: `/api/category/:id`
- **Method**: `DELETE`
- **Authentication**: Required (Admin)
- **URL Parameters**:
  - `id`: Category ID
- **Response**: Success message

## Dishes

### Get All Dishes
- **URL**: `/api/dishes`
- **Method**: `GET`
- **Query Parameters**:
  - `category`: Filter by category ID (optional)
- **Response**: Array of dish objects with category details
- **Example Response**:
  ```json
  [
    {
      "_id": "5f8d0d55b54764421b7156c8",
      "name": "Pizza Margherita",
      "description": "Classic pizza with tomato and mozzarella",
      "price": 8.50,
      "category": {
        "_id": "5f8d0d55b54764421b7156c7",
        "name": "Pizze"
      },
      "image": "pizza-margherita.jpg"
    },
    ...
  ]
  ```

### Get Single Dish
- **URL**: `/api/dishes/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: Dish ID
- **Response**: Dish details

### Create Dish (Admin)
- **URL**: `/api/dishes`
- **Method**: `POST`
- **Authentication**: Required (Admin)
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `name`: String (required)
  - `description`: String
  - `price`: Number (required)
  - `category`: Category ID (required)
  - `image`: Image file (optional)
- **Response**: Created dish object

### Update Dish (Admin)
- **URL**: `/api/dishes/:id`
- **Method**: `PUT`
- **Authentication**: Required (Admin)
- **Content-Type**: `multipart/form-data`
- **URL Parameters**:
  - `id`: Dish ID
- **Body**: Fields to update (same as create)
- **Response**: Updated dish object

### Delete Dish (Admin)
- **URL**: `/api/dishes/:id`
- **Method**: `DELETE`
- **Authentication**: Required (Admin)
- **URL Parameters**:
  - `id`: Dish ID
- **Response**: Success message

### Get Dish Image
- **URL**: `/api/dishes/image/:filename`
- **Method**: `GET`
- **Response**: Image file

### Get Popular Dishes
- **URL**: `/api/dishes/popular`
- **Method**: `GET`
- **Description**: Get most ordered dishes
- **Response**: Array of popular dishes with order count

## Error Responses

### 401 Unauthorized
```json
{
  "status": "fail",
  "message": "You are not logged in. Please log in to get access."
}
```

### 403 Forbidden
```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "status": "fail",
  "message": "No category found with that ID"
}
```

### 400 Bad Request
```json
{
  "status": "fail",
  "message": "Validation error message here"
}
```
