# Graduation Ceremony OTP "Ora Mingkuh" 2026

Undangan digital — 29 November 2026 · Gaia Cosmo Hotel, Yogyakarta.

- Link per tamu: `/?to=Nama%20Tamu&t=Mr&r=Peran` (`t` sapaan dan `r` peran opsional)
- Buat link (panitia): `/?admin=1`
- Ubah isi acara di objek `CONFIG` dalam `index.html`.

## Konfirmasi kehadiran & halaman admin

- Tamu menekan **I'm in!** / **Can't make it** → jawaban tercatat lewat `api/rsvp.js`,
  muncul notifikasi "Booking Confirmed", dan WhatsApp ke panitia tetap terbuka.
- Daftar siapa yang hadir / berhalangan / belum konfirmasi hanya bisa dilihat di
  **`/admin`** (dikunci PIN). Tamu tidak bisa melihat jawaban orang lain.

Penyiapan sekali saja di Vercel:
1. **Storage** → **Create Database** → **Upstash for Redis** (gratis) → hubungkan ke project ini.
2. **Settings → Environment Variables** → tambah `ADMIN_PIN` berisi PIN pilihan panitia.
3. **Deployments** → … → **Redeploy**.

Daftar tamu yang boleh tercatat ada di `GUESTS` dalam `api/rsvp.js`
(nama harus sama dengan nilai `to` di link undangan).
