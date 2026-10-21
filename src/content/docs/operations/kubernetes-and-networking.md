---
title: Kubernetes & Jaringan Cilium
description: Konfigurasi kluster K3s, isolasi multi-tenancy eBPF, Ingress Envoy, dan manajemen NetworkPolicy.
---

Dokumen ini menjelaskan konfigurasi kluster Kubernetes (K3s), arsitektur multi-tenancy, isolasi eBPF (Cilium), dan routing Ingress di RanuPod.

---

## 1. Topologi Kluster K3s

Kluster K3s terdiri dari node master dan node worker:
- **Master Node (`master-k8s`)**: `192.10.1.203` (Control plane, K8s API server `:6443`)
- **Agent Node (`agent-k8s`)**: `192.10.1.204` (Worker node compute workloads)
- **CNI / eBPF Engine**: **Cilium v1.19.6** (Routing mode: `tunnel` / vxlan)
- **Ingress Controller**: **Cilium Ingress** (`ingressclass.networking.k8s.io/cilium`) didukung oleh Cilium Envoy proxy.

---

## 2. Multi-Tenancy & Naming Convention

Workload pengguna diisolasi secara ketat berdasarkan pasangan **Project** dan **Environment**, **BUKAN** berdasarkan Personal User.

### Format Namespace
```text
rp-{projectID[:8]}-{environmentID[:8]}
```
*Contoh:*
- Project UUID: `40845f6d-3121-4f12-921d-a342b4512999`
- Environment UUID: `67ef09dc-2731-4e4b-bb66-07755ba9b441`
- Namespace K3s: `rp-40845f6d-67ef09dc`

### Kenapa Bukan Berdasarkan User ID?
1. **Sharing & Organisasi**: Sebuah project dapat dibagikan ke banyak anggota (`ProjectMember` role: `owner`, `editor`, `viewer`) atau dipindahkan ke Organisasi lain.
2. **Zero Downtime**: Ketika kolaborator ditambahkan atau izin diubah di Control Plane DB (`ranu-core`), Pod dan persistent volume di K3s **TIDAK PERLU** dimigrasi atau di-recreate sama sekali.

---

## 3. Network Isolation (Cilium eBPF NetworkPolicy)

Setiap kali `ranu-operator` membuat namespace baru, policy `rp-isolate-network` di-apply secara otomatis.

### Kebijakan Isolasi:
1. **Default Deny Cross-Namespace**: Pod pada `rp-projectA-prod` tidak dapat mengakses pod atau database pada `rp-projectB-prod`.
2. **Intra-Namespace Allow**: Semua service di dalam namespace yang sama bebas berkomunikasi via Service DNS K8s (contoh: `http://backend-api:3000`).
3. **DNS Egress Allow**: Semua pod diizinkan melakukan query DNS ke `kube-system/kube-dns` pada port 53 UDP/TCP.
4. **Ingress Inbound Allow**: Traffic masuk dari Ingress Controller (`cilium-ingress` / Envoy) ke pod diizinkan.

### Manifest Referensi (`rp-isolate-network`):
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: rp-isolate-network
  namespace: rp-40845f6d-67ef09dc
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector: {}
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: kube-system
  egress:
  - to:
    - podSelector: {}
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
```

---

## 4. Ingress Routing & Domain Format

### IngressClass
Setiap Ingress manifest yang dibuat `ranu-operator` wajib menggunakan:
```yaml
spec:
  ingressClassName: cilium
```

### Format Domain
```text
{cleanServiceName}-{environmentID[:8]}.{BASE_DOMAIN}
```
*Contoh:*
- Service: `web-antrian`
- Environment ID: `67ef09dc...`
- Base Domain: `ranupod.local`
- Host: `web-antrian-67ef09dc.ranupod.local`

---

## 5. Manajemen Kubeconfig

1. **Penyimpanan**: Kubeconfig disimpan terenkripsi di PostgreSQL (`clusters` table).
2. **Koneksi Dinamis**: `ranu-operator` dan `ranu-core` membaca kubeconfig dari database saat runtime, lalu menginisialisasi `kubernetes.Clientset` via memory buffer (`clientcmd.RESTConfigFromKubeConfig`).
3. **Stateless**: Tidak membutuhkan file kubeconfig permanen di disk worker/operator, menjadikannya aman saat container di-restart.
