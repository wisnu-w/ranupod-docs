---
title: Deploy Aplikasi Python & FastAPI di RanuPod
description: Panduan deployment aplikasi Python modern menggunakan FastAPI, Django, Flask, Uvicorn, dan Gunicorn di RanuPod.
---

RanuPod mendeteksi aplikasi Python melalui keberadaan file `requirements.txt`, `Pipfile`, atau `pyproject.toml` di repositori Anda.

---

## 1. Menentukan Versi Python

Anda dapat menentukan versi Python yang diinginkan (misalnya `3.11` atau `3.12`) dengan membuat file `.python-version` di root direktori proyek Anda:

```text
3.12
```

---

## 2. Persiapan File Dependensi

### Menggunakan `requirements.txt`:
Pastikan ASGI atau WSGI server terdaftar di dalam dependensi Anda:

```text
fastapi>=0.111.0
uvicorn[standard]>=0.30.0
pydantic>=2.7.0
```

---

## 3. Contoh Implementasi dengan FastAPI

Di file `main.py`:

```python
import os
from fastapi import FastAPI

app = FastAPI(title="RanuPod FastAPI Demo")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Berjalan mulus di RanuPod!"}

@app.get("/healthz")
def healthz():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    # Ambil port dari variabel lingkungan PORT
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
```

### Start Command Rekomendasi di RanuPod:
Di tab **Settings** service Anda, atur **Start Command**:
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2
```

---

## 4. Catatan Khusus Aplikasi Django

Untuk aplikasi Django yang melayani traffic produksi:

1. **Gunakan Gunicorn**:
   Tambahkan `gunicorn` dan `whitenoise` ke `requirements.txt`.
2. **Kelola Static Files dengan WhiteNoise**:
   Di file `settings.py`:
   ```python
   MIDDLEWARE = [
       'django.middleware.security.SecurityMiddleware',
       'whitenoise.middleware.WhiteNoiseMiddleware',
       # middleware lainnya...
   ]
   STATIC_ROOT = BASE_DIR / 'staticfiles'
   ```
3. **Start Command dengan Migrasi Database Otomatis**:
   ```bash
   python manage.py migrate && python manage.py collectstatic --noinput && gunicorn myproject.wsgi:application --bind 0.0.0.0:$PORT --workers 3
   ```

---

## 5. Streaming Log Python (`PYTHONUNBUFFERED`)

RanuPod secara otomatis menyuntikkan variabel:
```ini
PYTHONUNBUFFERED=1
```
Variabel ini memastikan bahwa seluruh pesan `print()` dan output modul `logging` tidak tertahan di buffer memori Python, melainkan langsung dialirkan ke **RanuLog** secara seketika (*real-time*).
