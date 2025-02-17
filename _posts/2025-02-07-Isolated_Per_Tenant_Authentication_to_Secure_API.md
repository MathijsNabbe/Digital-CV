---
title: Isolated Per-Tenant Authentication to Secure API
layout: post
author: Mathijs Nabbe
tags: [MijnOverheid, JWT]
---

In a [previous post]({{ site.baseurl }}{% link _posts/2025-01-21-Secure_minimal_NET8_API_with_JWT_Authentication.md %}) i have talked about an authentication mechanism that relies on a basic JWT-based infrastructure. At present, the API only validates a unique secret key. This setup ensures that the API is accessible exclusively when using the token manually provided by the host. However, this approach presents several drawbacks.

## The Issue

Allowing multiple users on the API introduced a new challenge. To summarize the scenario, each user is identified by an Organizational Identification Number (OIN), which serves to distinguish organizations. If multiple organizations have access to the service, have obtained a valid JWT token, and the service has been authorized to transmit messages on both organization’s behalf as an intermediary, both organizations can successfully submit requests to the service.

The primary issue with the current authentication setup arises if Organization A were to discover the OIN of Organization B. Since the OIN is not considered sensitive information and can be easily determined, Organization A could potentially send requests using Organization B’s OIN. This represents a significant security concern, as multiple users of the same service should always remain isolated from one another. Addressing this vulnerability is the primary objective of the upcoming research.

## Possible solutions
### Conditional IP-whitelisting Middleware

One potential solution is to implement a middleware that validates the OIN in the request against a whitelist of IP addresses associated with that OIN. If the origin IP does not match the OIN specified in the request body, the middleware would return a 403 Forbidden response, preventing unauthorized access.

The IP collections could be stored in either of the following locations:

1. Environment Variables (appsettings.json)
  - Storing the IP collections in environment variables ensures easy access within the application configuration.
  - Any changes to these values would require a service restart for the updates to take effect.
2. Remote Database
  - Storing the IP collections in a database allows for dynamic updates without requiring a service restart.
  - This approach introduces additional costs for database hosting and maintenance.
  - Managing the SQL server configuration would require technical expertise, making it less suitable for non-developers.

### Extra JWT token claims with validation middleware

Another potential solution is to include the OIN as a new claim in the JWT token. Each organization would have a unique JWT token granting them access to send requests only with their own OIN. A middleware component would then validate whether the OIN in the request matches the OIN extracted from the JWT token.

The main challenge with this approach is determining how the JWT token will be distributed to customers:

1. Create an Authentication Endpoint
  - An open authentication endpoint could be developed, allowing an organization to submit claims and generate a JWT token.
  - This approach would enable additional security features, such as validating the token’s lifetime, preventing the use of outdated tokens.
  - This approach does not eliminate the core security flaw in this research—organizations would still be able to create a token using a different OIN, bypassing the intended isolation.
2. Provide the JWT Token Manually
  - The JWT token would be generated manually and issued directly to the user.
  - A record of all issued tokens and their corresponding organizations would need to be maintained.
  - This approach introduces additional administrative overhead and requires ongoing maintenance.

## Conclusion

Both proposed solutions offer potential improvements but come with their own limitations. Conditional IP-whitelisting provides stricter access control but requires either manual service restarts or additional database infrastructure. Using extra JWT claims allows for automated validation but does not fully prevent OIN spoofing. Further evaluation is necessary to determine the most secure and practical approach for ensuring proper authentication and authorization while maintaining ease of management.

## Solution
### Expand JWT Token Claims

To enhance the security and complexity of JWT tokens, the Organizational Identification Number (OIN) can be included as a claim in the JWT payload. This additional validation step ensures that the authorization header corresponds to the request body, preventing a user from utilizing a token issued for Company A while making requests using Company B's OIN.

### User-Specific Secrets

For an added layer of security, each user should have a unique secret key. This approach allows the system to deactivate a specific secret to revoke a user's access if necessary. These secrets are never exposed to users but are securely stored within a controlled collection. Without access to their designated secret, a user cannot tamper with or generate valid JWT tokens.

### Azure Key Vault

To securely store the collection of OINs and corresponding secrets, Azure Key Vault can be leveraged. This solution ensures that the collection remains centralized, protected, and dynamically accessible without requiring service restarts after modifications. Additionally, Azure Key Vault provides an intuitive user interface, enabling non-technical administrators to manage keys and configure token lifetimes as needed.

### Authentication Middleware

In a .NET 8 API application, middleware can be implemented to validate incoming requests before passing them to the endpoint. This middleware will perform the following security checks:

* **Retrieve the Correct JWT Secret**: Upon receiving a request, the middleware scans the request body for the OIN. Using this identifier, it queries Azure Key Vault to retrieve the corresponding secret key.
* **Validate the Authorization Header**: The retrieved secret is then used to validate the JWT token provided in the authorization header. If the token cannot be validated against the secret, the request is considered unauthorized.
* **Filter JWT Token Malpractice**: If the JWT token is valid, the middleware compares the OIN in the token payload with the OIN from the request body. If these values do not match, the request is rejected to prevent token abuse or impersonation attempts.