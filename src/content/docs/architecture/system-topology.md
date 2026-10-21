---
title: Topologi Sistem & Microservices
description: Arsitektur sistem decoupled, aliran event asynchronous, dan peran tiap microservice RanuPod.
---

Dokumentasi resmi arsitektur sistem, konfigurasi runtime, build engine, network isolation, dan panduan deployment production untuk platform **RanuPod**.

---

## 1. Topologi Sistem & Aliran Data

```text
                           +---------------------------+
                           |  Developers / End-Users   |
                           +-------------+-------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
             [ ranu-console ]                      [ ranu-admin ]
         (SvelteKit Frontend :5173)           (SvelteKit Ops :5174)
                       |                                   |
                       +-----------------+-----------------+
                                         | REST API
                                         v
                                  [ ranu-core ]
                            (Control Plane API :8080)
                                         |
                         +---------------+---------------+
                         |                               |
                         v                               v
                  [(PostgreSQL)]                  [(Redis Asynq)]
                   Port :5432                       Port :6379
                                                         |
                                 +-----------------------+-----------------------+
                                 | Queue: "builds"                               | Queue: "deployments"
                                 v                                               v
                          [ ranu-worker ]                                 [ ranu-operator ]
                     (Railpack + BuildKit Client)                    (K3s Cluster Controller)
                                 |                                               |
                                 | Compile & Push via BuildKit                   | Apply K8s Manifests
                                 v                                               v
                     [(Container Registry)]                          +-----------------------+
                     192.10.1.203:30500                             |     K3s Cluster       |
                                                                     |  (Cilium eBPF CNI)    |
                                                                     |  Namespaces:          |
                                                                     |  rp-{proj}-{env}      |
                                                                     +-----------------------+
```

---

## 2. Peran Tiap Komponen

1. **`ranu-core` (Go + Chi + GORM)**:
   - Central Control Plane API.
   - Mengelola state platform di PostgreSQL, autentikasi berbasis Logto (OAuth2 / OIDC / RBAC scopes), dan billing.
   - Tidak memiliki akses langsung ke kluster K3s demi keamanan.

2. **`ranu-console` & `ranu-admin` (SvelteKit + Tailwind)**:
   - Portal dashboard pengguna untuk membuat project, deploy service, mengelola variabel lingkungan, dan memantau log / traces.
   - Portal admin internal untuk mengelola node K3s, resource quotas, dan katalog SKU.

3. **`ranu-worker` (Go + Redis Asynq)**:
   - Factory CI/CD yang mengkloning repositori Git, mendeteksi bahasa/framework secara otomatis, dan membuild container image OCI menggunakan Railpack & BuildKit daemon.
   - Mendorong hasil build ke private registry lokal.

4. **`ranu-operator` (Go + client-go)**:
   - Executor kluster K3s yang berjalan dengan hak terbatas.
   - Mengambil intent deployment dari antrean Redis `deployments` dan menerapkan manifest K8s (Deployment, Service, Ingress, Cilium NetworkPolicy).
