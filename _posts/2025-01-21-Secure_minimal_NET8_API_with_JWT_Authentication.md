---
title: Secure minimal NET8 API with JWT Authentication
layout: post
author: Mathijs Nabbe
tags: [MijnOverheid, JWT]
---

Securing APIs is a fundamental aspect of modern application development. JSON Web Token (JWT) authentication provides a robust and efficient way to authenticate and authorize requests in a stateless manner. This research documentation walks you through implementing simple JWT authentication in a .NET Minimal API.

1. [Introduction](#introduction)  
   - [Why Authenticate Incoming Requests](#why-authenticate-incoming-requests)  
   - [What is a JWT](#what-is-a-jwt)  
   - [Example JWT structure](#example-jwt-structure)  
2. [Setup minimal API authentication](#setup-minimal-api-authentication)  
   - [Step 1: Configure JWT Authentication](#step-1-configure-jwt-authentication)  
   - [Step 2: Add Middleware for Authentication and Authorization](#step-2-add-middleware-for-authentication-and-authorization)  
   - [Step 3: Secure API Endpoints](#step-3-secure-api-endpoints)  
3. [Generating a Valid JWT](#generating-a-valid-jwt)  
   - [JWT Header](#jwt-header)  
   - [JWT Payload](#jwt-payload)  
   - [Secret Key](#secret-key)  
4. [Send a Valid Request](#send-a-valid-request)  

## Introduction
### Why Authenticate Incoming Requests
Authentication is essential to:

* Protect sensitive data by ensuring only verified users can access your API.
* Enforce controlled access to specific resources.
* Prevent unauthorized access, reducing the risk of data breaches.
* Ensure compliance with security standards and protocols.

JWT-based authentication is particularly useful as it is stateless, lightweight, and widely supported across platforms.

### What is a JWT
**JSON Web Tokens (JWTs)** are a compact and self-contained way of securely transmitting information between parties as a JSON object. This guide demonstrates how to secure your Minimal API using JWT authentication in .NET, ensuring only authenticated and authorized users can access your endpoints.

A JWT is a token that contains claims about a user or system. It has three parts:

* **Header**: Contains metadata about the token, such as the algorithm used.
* **Payload**: Contains claims—information about the user or context, such as issuer, audience, and expiration.
* **Signature**: A cryptographic signature that verifies the token’s authenticity.

### Example JWT structure
``` 
Header.Payload.Signature 
```
The JWT is signed using a secret key, which the server validates to ensure the token's integrity.

## Setup minimal API authentication
Follow these steps to secure your API with JWT authentication:

### Step 1: Configure JWT Authentication
Add the following code to your `Program.cs` file:

``` csharp
var secretString = "GENERATE_A_SECRET_KEY";
var issuer = "ADD_TOKEN_PROVIDER_DOMAIN";
var audience = "ADD_TOKEN_USER_DOMAIN";
var secretKey = Encoding.UTF8.GetBytes(secretString);

services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = issuer, 

        ValidateAudience = true,
        ValidAudience = audience, 

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),

        ValidateLifetime = false
    };
});
services.AddAuthorizationBuilder();
```

### Step 2: Add Middleware for Authentication and Authorization
After building the application, enable authentication and authorization middleware:

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

### Step 3: Secure API Endpoints
Apply authentication and authorization to your endpoints:

```csharp
// This is an example for adding the Authorization to Yarp
app.MapReverseProxy().RequireAuthorization();
```

## Generating a Valid JWT
To interact with your secured API, you need to generate a valid JWT. One of the simplest ways to achieve this is by using online tools like [JWT.IO](https://jwt.io/). Below is some example data corresponding to the example given above:

### JWT Header
```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

### JWT Payload
```json
{
  "iss": "ADD_TOKEN_PROVIDER_DOMAIN",
  "aud": "ADD_TOKEN_USER_DOMAIN"
}
```

### Secret Key
```json
{
    "GENERATE_A_SECRET_KEY"
}
```

## Send a Valid Request
Once you have a valid JWT, include it in the Authorization header of your API requests. 

```
[Authorization: "Bearer <JWT>"]
```