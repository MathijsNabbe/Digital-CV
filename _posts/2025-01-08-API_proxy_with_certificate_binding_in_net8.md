---
title: API Proxy with Certificate Binding in .NET8
layout: post
author: Mathijs Nabbe
tags: [MijnOverheid]
---

This document outlines the implementation of a secure proxy to facilitate communication between multiple users and a remote API which enforces strict security requirements, including the mandatory use of client certificates for all API requests. The proposed solution utilizes .NET technologies and integrates **Azure Key Vault** for efficient certificate management.

## Table of Contents
1. [Disclosure](#disclosure)  
2. [Introduction](#introduction)  
3. [Certified API Requests](#certified-api-requests)  
   - [HttpClient Certificate Usage](#httpclient-certificate-usage)  
   - [Challenges of Direct Certificate Distribution](#challenges-of-direct-certificate-distribution)  
4. [Proxy](#proxy)  
   - [Key Benefits](#key-benefits)  
5. [Azure Key Vault Integration](#azure-key-vault-integration)  
   - [Implementation](#implementation)  
6. [Efficient `HttpClient` Management with HttpClientFactory](#efficient-httpclient-management-with-httpclientfactory)  
   - [Implementation](#implementation)  
   - [Code Example](#code-example)  
   - [Benefits](#benefits)  
7. [Deployment and Maintenance](#deployment-and-maintenance)  
8. [Summary](#summary)  


## Disclosure
This research documentation does not include implementation examples for API functionality. Instead, it focuses exclusively on certificate handling within a proxy-oriented Minimal API developed in .NET8.

## Introduction
As mentioned above, the remote API requires a client certificate to ensure secure communication. Distributing this certificate directly to the users is insecure and necessitates frequent updates to any host configurations when the certificate expires. Additionally, mismanagement of HttpClient instances can lead to performance issues, such as socket exhaustion.

To address these challenges, a proxy server can be developed to centralize certificate management and handle API requests securely and efficiently.

## Certified API Requests
### HttpClient Certificate Usage
The remote API requires every request to include a valid certificate. elow is an example of how certificates are typically attached to `HttpClient` requests:

```csharp
// Load the certificate from a file
var certificate = new X509Certificate2("path-to-certificate.pfx", "certificate-password");

// Add the certificate to a HttpClientHandler
var handler = new HttpClientHandler();
handler.ClientCertificates.Add(certificate);

// Create a HttpClient
var httpClient = new HttpClient(handler);
```

### Challenges of Direct Certificate Distribution
While this setup is functional, it comes with significant downsides. Specifically, the certificate must be distributed to the end users. This approach is inherently insecure as it exposes sensitive certificate data to the users. Furthermore, whenever the certificate is updated, users must update the configurations and embed the updated certificate.

A more robust solution is to implement a proxy service hosted as an Azure Web App (Linux) that centralizes certificate management and ensures secure communication without exposing certificates to end users.

## Proxy
The proposed proxy is a .NET8 ASP.NET Core Web API application using FastEndpoints for performance and simplicity. This proxy should:

1. Mimic the required endpoints of the remote API.
2. Forward user requests to Yenlo after appending the necessary certificate.
3. Manage certificates securely via **Azure Key Vault**.

### Key Benefits
1. Eliminates the need to distribute certificates to users.
2. Decouples application updates from certificate updates.
3. Centralizes and secures certificate management.
4. Minimizes downtime when certificates are updated.

## Azure Key Vault Integration
Storing certificates locally in the proxy’s resources requires redeploying the proxy whenever a certificate changes, leading to downtime. **Azure Key Vault** provides a centralized, secure, and flexible solution for certificate management.

### Implementation
ertificates are retrieved from **Azure Key Vault** dynamically when a new `HttpClient` instance is created. Example code snippet:

```csharp
// Create KeyVaultCertificateClient
var keyVaultCertificateClient = new CertificateClient(
    vaultUri: new Uri("https://keyvaultname.vault.azure.net/"),
    credential: new DefaultAzureCredential()
);

// Get Certificate by name
KeyVaultCertificateWithPolicy certificateWithPolicy = keyVaultCertificateClient.GetCertificate("certificate-name");
```

By integrating **Azure Key Vault**, certificate updates can be performed without modifying or redeploying the proxy. However, applications need to be restarted if certificates are cached indefinitely, which can still cause downtime.

## Efficient `HttpClient` Management with HttpClientFactory
`HttpClientFactory` is a feature in .NET designed to manage the lifecycle of HttpClient instances, mitigating issues such as **socket exhaustion**. It supports:

1. Centralized configuration of `HttpClient` instances.
2. Scoped lifetimes for `HttpClient` instances.
3. Dynamic reconfiguration and **dependency injection**.

### Implementation
The `HttpClientFactory` can be extended to retrieve certificates from **Azure Key Vault** whenever a new `HttpClient` is instantiated. This ensures certificates are refreshed without manual intervention.

### Code Example
```csharp
builder.Services.AddHttpClient<IAuthenticatedProxyService, AuthenticatedProxyService>()
    .SetHandlerLifetime(TimeSpan.FromSeconds(15))
    .ConfigurePrimaryHttpMessageHandler(() =>
    {
        var handler = new HttpClientHandler();
        handler.ClientCertificates.Add("add-certificate-here.pfx");
        return handler;
    });
```

### Benefits
* Automatically refreshes certificates upon update.
* Prevents socket exhaustion by managing HttpClient lifetimes.
* Reduces downtime associated with certificate updates.

## Deployment and Maintenance
* **Hosting:** The proxy will be hosted as an **Azure Web App (Linux)**.
* **Certificate Updates:** Updates are performed centrally in **Azure Key Vault**. The proxy retrieves updated certificates during its lifecycle, ensuring minimal downtime.
* **Monitoring:** Regular monitoring of proxy health and certificate expiration is recommended. This can be done with a **simple health endpoint** using the code-snippet below and a ping-tool like **Uptime Robot**.

# Summary
This proxy implementation provides a secure and efficient solution for managing communication with a remote API. By leveraging **Azure Key Vault** and **HttpClientFactory**, the approach addresses key challenges, including security, performance, and maintainability, ensuring reliable operations for end-users.