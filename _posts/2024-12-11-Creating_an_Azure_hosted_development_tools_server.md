---
title: Creating an Azure hosted development tools server
layout: post
author: Mathijs Nabbe
tags: [Azure, Docker]
---

As a developer, it can be beneficial to have a dedicated server for hosting tools that enhance efficiency and maintain quality while also providing a sandbox environment for experimentation. This document outlines the process of setting up a development environment in Microsoft Azure, including best practices for configuration, cost management, and version control of related scripts and compose files.

## 1. Microsoft Azure Environment
### 1.1 Resource Group
To ensure proper organization and isolation of resources, all components related to development should be grouped within a **Resource Group**. When creating a resource group, it is essential to select a distinct and unique name. This name should also be used as a prefix for all associated services to maintain consistency.

### 1.2 Cost Management and Alerts
Azure costs can escalate quickly, making it critical to configure **Cost Alerts** to prevent unexpected expenses. The Budget settings can be found in the **Cost Management > Budgets** section of the Resource Group settings. It is best practice to configure two alerts:

* **Actual expenses**: Triggered at 95% of the allocated budget.
* **Forecasted expenses**: Triggered at 100% of the allocated budget.

Ensure that email notifications are enabled for all relevant stakeholders (up to five recipients).

### 1.3 Virtual Machine
A **Virtual Machine (VM)** serves as the foundation of the development environment. While many settings can remain at their default values, the following considerations are crucial:

* **Region**: Select **West Europe** for optimal performance in European regions.
* **Security Type**: Use **Standard** to reduce costs, as no public ports other than HTTP (80) and HTTPS (443) will be open.
* **Image**: Choose the latest **Ubuntu x64** distribution.
**VM Size**: Opt for **Standard_B2s**, a burstable instance suitable for development workloads with intermittent processing needs.
* **Public Inbound Ports**: Set to **None** to restrict access (configured later in networking settings).
* **Disk Size**: A **64GB Premium SSD** is recommended for better performance without significantly increasing costs.
* **Public IP Address**: Required for remote access but with inbound ports disabled initially.

### 1.4 Network Settings
Inbound and outbound traffic rules should be configured to allow necessary communications. These settings can be modified under **Networking > Network Settings** in the VM settings. By default, all inbound traffic is blocked. The following rules should be created:

| Source | Service / Port | Purpose |
| :----: | :------------: | ------ |
| Any | HTTP / 80 | Unsecured web traffic. |
| Any | HTTPS / 443 | Secured web traffic. |
| My IP address | SSH / 22 | Secure terminal access. **Never open this port publicly!** |

## 2. Service Deployment
The primary purpose of the VM is to host development services. **Docker** is a preferred platform for containerized services, managed through a **Portainer Agent** and configured using scripts stored in a **GitHub repository**.

### 2.1 Docker
Docker can be installed via SSH using PowerShell. Follow **Step 1** of [**this guide**](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-22-04) for installation. **Step 2** is optional but removes the need to invoke `sudo` to Docker commands.

### 2.2 Portainer Agent
Portainer provides a web UI for managing Docker containers. Detailed installation steps can be found in the [**Portainer documentation**](https://docs.portainer.io/). Setting up a **Portainer Agent** allows integration with an existing on-premises Portainer instance for remote container management.

To permit agent communication, configure an Inbound Port Rule in Azure:
| Source | Service / Port | Reason |
| :----: | :------------: | ------ |
| My IP Address | Custom / 9001 | Communication with the Portainer agent. |

### 2.3 Development Resources Repository
A dedicated **GitHub repository** should be used for storing Docker Compose scripts. When creating **Stacks** in Portainer, it is recommended to select the **Repository** option, linking the Stack to a `.yml` file in the repository. Authentication requires a [**GitHub Personal Access Token (PAT)**](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with private repository permissions.

## 3. Development Services
### 3.1 Traefik Reverse Proxy

[**Traefik**](https://doc.traefik.io/traefik/getting-started/quick-start/) is a reverse proxy service that routes requests to specific containers based on predefined conditions. A Docker Compose configuration for Traefik is provided below:

```yml
version: '3'

networks:
  traefik:
    external: true

volumes:
  traefik-ssl-certs:
    driver: local
    
services:
  traefik:
    image: traefik:latest
    container_name: traefik
    ports:
      - 80:80
      - 443:443
      - 8080:8080
    volumes:
      - traefik-ssl-certs:/ssl-certs
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - traefik
    restart: unless-stopped
    environment:
      - TRAEFIK_GLOBAL_CHECKNEWVERSION=true
      - TRAEFIK_GLOBAL_SENDANONYMOUSUSAGE=false
      - TRAEFIK_API_DASHBOARD=true
      - TRAEFIK_API_DISABLEDASHBOARDAD=true
      - TRAEFIK_API_INSECURE=true
      - TRAEFIK_ENTRYPOINTS_web=true
      - TRAEFIK_ENTRYPOINTS_web_ADDRESS=:80
      - TRAEFIK_ENTRYPOINTS_web_HTTP_REDIRECTIONS_ENTRYPOINT_TO=websecure
      - TRAEFIK_ENTRYPOINTS_web_HTTP_REDIRECTIONS_ENTRYPOINT_SCHEME=https

      - TRAEFIK_ENTRYPOINTS_websecure=true
      - TRAEFIK_ENTRYPOINTS_websecure_ADDRESS=:443
      - TRAEFIK_CERTIFICATESRESOLVERS_staging=true
      - TRAEFIK_CERTIFICATESRESOLVERS_staging_ACME_EMAIL=example@gmail.com
      - TRAEFIK_CERTIFICATESRESOLVERS_staging_ACME_STORAGE=/ssl-certs/acme.json
      - TRAEFIK_CERTIFICATESRESOLVERS_staging_ACME_CASERVER=https://acme-staging-v02.api.letsencrypt.org/directory
      - TRAEFIK_CERTIFICATESRESOLVERS_staging_ACME_HTTPCHALLENGE=true
      - TRAEFIK_CERTIFICATESRESOLVERS_staging_ACME_HTTPCHALLENGE_ENTRYPOINT=web
      - TRAEFIK_CERTIFICATESRESOLVERS_production=true
      - TRAEFIK_CERTIFICATESRESOLVERS_production_ACME_EMAIL=example@gmail.com
      - TRAEFIK_CERTIFICATESRESOLVERS_production_ACME_STORAGE=/ssl-certs/acme.json
      - TRAEFIK_CERTIFICATESRESOLVERS_production_ACME_CASERVER=https://acme-v02.api.letsencrypt.org/directory
      - TRAEFIK_CERTIFICATESRESOLVERS_production_ACME_HTTPCHALLENGE=true
      - TRAEFIK_CERTIFICATESRESOLVERS_production_ACME_HTTPCHALLENGE_ENTRYPOINT=web
      - TRAEFIK_PROVIDERS_DOCKER=true
      - TRAEFIK_PROVIDERS_DOCKER_EXPOSEDBYDEFAULT=false
```

Ensure the following Inbound Port Rules are set in Azure:

| Source | Service / Port | Purpose |
| :----: | :------------: | ------ |
| Any | HTTP / 80 | Unsecured web traffic. |
| Any | HTTPS / 443 | Secured web traffic. |
| My IP address | Custom / 8080 | Traefik Dashboard access. **Never open this port publicly!** |

To make Traefik track a container, the target container must be in the **same Docker network** as Traefik. The following **Environment Variables** can be added to any container, both in the Docker Compose as on a running container, to let Traefik do it's job:

| Label | Value | Reason |
| ----- | :---: | ------ |
| traefik.enable | "true" | Enables Traefik to track this container. |
| traefik.http.routers.`name`.rule | "Host(`hostname`)" | The hostname as a condition to redirect a request to this container. |
| traefik.http.routers.`name`.entrypoints | "web,websecure" | “Web“ for insecure (http) traffic, “Websecure“  for secure (https) traffic. |
| traefik.http.routers.`name`.tls | "true" | Enforces a secure connection. |
| traefik.http.routers.`name`.tls.certresolver | "production, staging" | Allows Let’s Encrypt to generate an SSL. |
| traefik.docker.network | "traefik" | Binds this container to the Traefik Network in Portainer. |

There are also some optional labels, which are listed below:

| Label | Value | Reason |
| ----- | :---: | ------ |
| traefik.http.middlewares.`name`-ipallowlist.ipallowlist.sourcerange | `ip-address` | Enables whitelisting and only allows this IP to the container. |

### 3.2 Uptime Kuma
[**Uptime Kuma**](https://uptime.kuma.pet/) is a very simple & straightforward tool to check the up&downtime of websites, API endpoints, and everything that responds to a web address or IP address. Apart from uptime, this service can also log response times, send notifications to various platforms like Teams or Email, and even configure retries and accepted status codes. 

The installation of Uptime Kuma is very easy as seen in the example below. No Azure configuration should be edited, since this container traffic will be handled by Traefik.

```yml
version: '3.7'

services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    restart: always
    volumes:
      - uptime-kuma-data:/app/data
    environment:
      - TZ=UTC
    networks:
      - traefik
    labels:
      # Add Traefik labels here

volumes:
  uptime-kuma-data:

networks:
  traefik:
    external: true
```

### 3.3 SonarQube (including Community Branch Plugin)
#### 3.3.1 Installing SonarQube
[**SonarQube**](https://docs.sonarsource.com/sonarqube-server/10.8/setup-and-upgrade/install-the-server/introduction/) is a code analysis platform which plays a great role in enforcing the quality we expect in the code we deliver. It features a static code analysis on each commit, with pull request decoration as feedback, and even a Visual Studio extension to have live coding analysis, called **SonarLint**. 

An example of a Docker Compose file for installing SonarQube is provided below.

```yml
version: "3"

services:
  sonarqube:
    image: sonarqube:10.6-community
    depends_on:
      - db
    restart: unless-stopped
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://db:5432/sonar
      SONAR_JDBC_USERNAME: # Enter username
      SONAR_JDBC_PASSWORD: # Enter password
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs
      - sonarqube_conf:/opt/sonarqube/conf
    ports:
      - "9000:9000"
    networks:
      - traefik
      - sonarqube

    labels:
      ## Don't forget to add Traefik labels

  db:
    image: postgres:12
    restart: unless-stopped
    environment:
      POSTGRES_USER: # Enter username
      POSTGRES_PASSWORD: # Enter password
    volumes:
      - postgresql:/var/lib/postgresql
      - postgresql_data:/var/lib/postgresql/data
    networks:
      - sonarqube

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
  sonarqube_conf:
  postgresql:
  postgresql_data:

networks:
  sonarqube:
  traefik:
    external: true
``` 

#### 3.3.2 Community Branch Plugin
The [**SonarQube Community Branch Plugin**](https://github.com/mc1arke/sonarqube-community-branch-plugin) enables certain features that are behind a paywall, one of which is the **Pull Request Decoration**. The steps to install this plugin in SonarQube are clearly stated in the README of the plugin repository, but requires some advanced knowledge of Linux and Docker to follow. 

The required SonarQube volumes are mapped to a **Named Volume** in the example Docker Compose file above, and can be found in the docker directory. The needed volume directories for the Installation Manual are:

1. `/var/lib/docker/<containername>-sonarqube_extensions/_data/plugins`
2. `/var/lib/docker/<containername>-sonarqube_conf/_data/sonar.properties`

#### 3.3.3 Migrating SonarQube
If an existing SonarQube instance must be migrated to this new instance, the following directories can be copied:

1. `/var/lib/docker/<containername>-sonarqube_data`
2. `/var/lib/docker/<containername>-postgresql_data`
3. `/var/lib/docker/<containername>-postgresql`

A useful tool to access these folders is [**WinSCP**](https://winscp.net/eng/index.php), which allows a file-explorer-like UI to browse the remote Linux environment. Make sure the SSH connection is authenticates as SuperUser and be very careful with moving or deleting files.