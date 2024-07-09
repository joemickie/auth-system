# Auth System

This project implements a NestJS user authentication and authorization system using PostgreSQL and JWT.

## Setup

1. Set Up a New NestJS Project:
    ```bash
    npm install -g @nestjs/cli
    nest new auth-system
    ```

2. Install Necessary Dependencies:
    ```bash
    cd auth-system
    npm install @nestjs/typeorm typeorm pg @nestjs/jwt @nestjs/config @nestjs/passport passport passport-jwt bcryptjs dotenv
    npm install --save-dev @types/bcryptjs @types/passport-jwt
    ```

3. Set up the environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
    DATABASE_USER=root
    DATABASE_PASSWORD=rootpassword
    DATABASE_NAME=auth_system

    JWT_SECRET=mysecretkey
    JWT_EXPIRATION_TIME=3600
    ```

4. Run the application:
    ```bash
    npm run start
    ```

## Endpoints

### Register
- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```

### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```

### Protected Admin Route
- **URL:** `/auth/admin`
- **Method:** `POST`
- **Headers:**
    ```json
    {
      "Authorization": "Bearer <JWT_TOKEN>"
    }
    ```
- **Body:** Empty

## User Roles

Roles are used to restrict access to certain endpoints. The available roles are:
- `user`: Default role for all users.
- `admin`: Special role for administrators.

## Authorization

Authorization is handled using JWTs and role-based guards. A user must include a valid JWT in the `Authorization` header to access protected routes.
