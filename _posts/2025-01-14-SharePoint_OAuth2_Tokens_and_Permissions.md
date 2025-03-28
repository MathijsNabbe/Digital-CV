---
title: SharePoint OAuth2 Tokens & Permissions
layout: post
author: Mathijs Nabbe
tags: [SharePoint, Azure]
---

This research was conducted in the context of developing a service that interacts with **Microsoft Graph** to manage a SharePoint site. The study provides a comprehensive definition of the various tokens issued by **Microsoft Graph**, detailing their respective purposes and lifetimes. Additionally, it outlines the Azure Entra ID roles and permissions required to authenticate an external Azure Enterprise Application within an Azure Tenant.

## Token Definitions
To ensure secure communication, Microsoft Graph uses three distinct tokens, each with specific lifespans and purposes. The details of these tokens are outlined below:

### Authorization Code
During the initial login to Microsoft Graph, an Authorization Code (commonly referred to as an Auth Code) is issued. This code has a brief **lifespan of 3-5 minutes** and is used in the initial authentication step to obtain an Access Token and Refresh Token. The Authorization Code authorizes the client to access a specified site on behalf of a user, within a predefined set of scopes (permissions).

### Access Token
An Access Token is required to authenticate the client to the tenant during each request to **Microsoft Graph**. It is included in the Authorization Headers of every request and contains encrypted data crucial for request authorization. The Access Token is short-lived, with a **lifespan of 3-5 minutes**, but may be used multiple times within this period.

### Refresh Token
Since Access Tokens expire after a few minutes, repeatedly requesting user credentials through a login process is not practical. To address this, the “offline_access” scope can be requested during the interactive authorization step. When an Access Token is obtained using the Auth Code from the browser, a Refresh Token is also provided. The Refresh Token, similar to the Authorization Code, is long-lived, with a **lifespan of 90 days**. It enables the client service to request new Access Tokens as needed. Each request to Microsoft Graph results in the issuance of a new Refresh Token, ensuring continuous functionality as long as at least one request is made within 90 days.

## Permission Definitions
To enable a client service to communicate with a SharePoint site within a tenant, an Azure App Registration should be created and added to the client's Azure Tenant as an Enterprise Application. This Enterprise Application grants the registered Application Registration the required permissions to access the tenant. These permissions are authorized by the account used in the interactive authentication process, commonly referred to as **Delegated Permissions**. Delegated Permissions allow an application to act on behalf of the signed-in user and access resources that the user has been granted permissions for, within the boundaries of the scopes defined during the authentication flow.

### Permissions Assigned to the Azure Enterprise Application
The following permissions are commonly assigned to the Azure Application Registration to facilitate interaction with the SharePoint site and other resources within the tenant:

* **Files.ReadWrite.All**: This permission grants the application the ability to read and write files, folders, and metadata within the tenant, specifically within SharePoint sites. This permission ensures that the client service can manage files on behalf of the user, with the ability to upload, modify, and delete files across the tenant’s SharePoint libraries.

* **Sites.ReadWrite.All**: This permission allows the application to read and write site data within the tenant, providing broad access to site collections and individual SharePoint sites. It enables the application to make changes to site content and structure, including site creation, modification of site settings, and management of content and configurations within SharePoint sites.

* **RecordsManagement.ReadWrite.All**: This permission is specifically designed for advanced records management and compliance operations. It enables the reading of retention labels and the association of these labels with files, allowing the application to enforce compliance policies such as retention and deletion of documents. This permission is essential for services that need to apply and manage retention labels within SharePoint.

* **offline_access**: This permission ensures that the application retains long-term access to the tenant without requiring frequent reauthentication. It allows the application to use Refresh Tokens to obtain new Access Tokens as needed, maintaining a persistent connection to the resources in the tenant over an extended period.

> **NOTE:** Permissions of type **RecordsManagement** always require Admin consent, and are only asked for if the tenant has an E5 subscription. E3 subscriptions do not have access to Azure’s compliance tools, so the permission is invalid. An Enterprise Application can still authenticate to an E3 tenant, it will simply not ask for the **RecordsManagement** permissions.

### Optional Azure Roles for Configuration
The account performing the configuration must have the appropriate Azure permissions to assign the necessary enterprise application permissions. The top-level roles, which means the roles needed to authenticate the corresponding permissions without any blockage, are:

* **Application Administrator**
    * Files.ReadWrite.All
    * Sites.ReadWrite.All
    * offline_access
* **Compliance Administrator (only on E5 subscriptions)**
    * RecordsManagement.ReadWrite.All

> **NOTE:** Non-admin users may still authenticate the service based on the security settings in the Azure tenant. If the user is not allowed to grant the permissions, the option is given to send a request to an admin to approve the request.

### Aditional Azure Settings
If admin consent is repeatedly required, it may be due to settings within the tenant's enterprise applications configuration. These settings can be managed in the Azure Portal:

1. Navigate to Azure Portal → Enterprise Applications → Security → Consent and Permissions.

2. In the User Settings section, you can configure whether users can register applications without admin consent, for instance, only when the application is from a verified publisher.

3. In the Admin Consent Settings section, configurations can be made to allow additional Azure users, groups, or roles to review enterprise application requests. You can also set the validity period for consent requests.

## Revoking Permissions
If permissions for an enterprise application need to be revoked without removing the application itself, follow these steps:

1.  Go to Azure Portal → Enterprise Applications → APPLICATION_NAME → Security → Permissions.

2. Review all permissions granted to the application by admins or users.

3. Revoke specific permissions as needed, provided you have the required role.

> **NOTE:** Revoking permissions may disrupt the functionality of the Enterprise Application. Caution is recommend, as unexpected errors are likely if essential permissions are removed.