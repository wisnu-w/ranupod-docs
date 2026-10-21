---
title: Konfigurasi & Matriks Environment
description: Matriks port service, environment variables, dan kredensial untuk ranu-core, worker, operator, console, dan admin.
---

Dokumen ini memuat seluruh konfigurasi environment variable, port service, dan template kredensial untuk setiap microservice di ekosistem **RanuPod**.

---

## 1. Port & Network Matrix

| Service | Port | Deskripsi |
|---|---|---|
| `ranu-core` | `8080` | REST API Control Plane |
| `ranu-console` | `5173` | SvelteKit Frontend User Portal |
| `ranu-admin` | `5174` | SvelteKit Superadmin / Ops Portal |
| PostgreSQL | `5432` | Database State Utama |
| Redis | `6379` | Asynq Task Queue & Cache |
| K3s API Server | `6443` | Kubernetes Master API Server |
| Container Registry | `30500` | In-cluster Docker Registry v2 (NodePort) |
| Cilium Ingress | `80`, `443` | HTTP/HTTPS Reverse Proxy & Envoy Gateway |
| Cilium NodePort | `31298`, `32527` | Direct NodePort Ingress Fallback |

---

## 2. Konfigurasi `ranu-core` (`ranu-core/.env`)

```ini
# Server Port
PORT=8080

# Database Configuration (PostgreSQL)
DB_HOST=192.10.1.89
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=ranu_db
DB_SSLMODE=disable

# Redis (Asynq Message Broker)
REDIS_ADDR=192.10.1.89:6379
REDIS_PASSWORD=

# Logto Authentication (B2B Multi-Tenancy)
LOGTO_ENDPOINT=https://auth.ranupod.com
LOGTO_APP_ID=your_logto_app_id
LOGTO_APP_SECRET=your_logto_app_secret
LOGTO_JWKS_URL=https://auth.ranupod.com/oidc/jwks

# Platform Superadmin Secret (ranu-admin auth)
ADMIN_SECRET_TOKEN=ranupod_admin_super_secret_token_123

# GitHub OAuth Integration (Opsional untuk deployment Git)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## 3. Konfigurasi `ranu-worker` (`ranu-worker/.env`)

```ini
# Redis Connection
REDIS_ADDR=192.10.1.89:6379
REDIS_PASSWORD=

# Railpack & BuildKit Builder Configurations
BUILDKIT_HOST=192.10.1.204:31234
RAILPACK_BIN=/Users/wisnu_withanto/go/bin/railpack
BUILDCTL_BIN=/opt/homebrew/bin/buildctl

# Container Registry Configuration
CONTAINER_REGISTRY_HOST=192.10.1.203:30500

# Database Access (Untuk update build logs & deployment status)
DB_HOST=192.10.1.89
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=ranu_db
DB_SSLMODE=disable
```

---

## 4. Konfigurasi `ranu-operator` (`ranu-operator/.env`)

```ini
# Redis Connection
REDIS_ADDR=192.10.1.89:6379
REDIS_PASSWORD=

# Database Access (Untuk mengambil kubeconfig kluster dan mencatat status deployment)
DB_HOST=192.10.1.89
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=ranu_db
DB_SSLMODE=disable

# Ingress & Routing Configurations
DEFAULT_INGRESS_DOMAIN=ranupod.local
INGRESS_CLASS=cilium
```

---

## 5. Konfigurasi `ranu-admin` (`ranu-admin/.env`)

```ini
# Backend API Endpoint
VITE_API_BASE_URL=http://localhost:8080

# Admin Secret (harus sama dengan ADMIN_SECRET_TOKEN di ranu-core)
VITE_ADMIN_SECRET=ranupod_admin_super_secret_token_123
```

---

## 6. Konfigurasi `ranu-console` (`ranu-console/.env`)

```ini
# Backend API Public URL
PUBLIC_API_URL=http://localhost:8080/api/v1

# Logto Client Configuration
PUBLIC_LOGTO_ENDPOINT=https://auth.ranupod.com
PUBLIC_LOGTO_APP_ID=your_logto_app_id
```
