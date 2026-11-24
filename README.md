# Graduation Ceremony OTP "Ora Mingkuh" 2026

Undangan digital — 29 November 2026 · Gaia Cosmo Hotel, Yogyakarta.

- Link per tamu: `/?to=Nama%20Tamu&t=Mr&r=Peran` (`t` sapaan dan `r` peran opsional)
- Buat link (panitia): `/?admin=1`
- Ubah isi acara di objek `CONFIG` dalam `index.html`.

## Daftar kehadiran otomatis (Rangers Check-in)

Tombol **I'm in!** / **Can't make it** mencatat jawaban lewat `api/rsvp.js`,
lalu bagian "Rangers Check-in" menampilkan lingkaran inisial untuk Hadir,
Berhalangan, dan Belum konfirmasi.

Penyiapan sekali saja di Vercel:
1. Buka project → **Storage** → **Create Database** → pilih **Upstash for Redis** (gratis) → hubungkan ke project ini.
2. **Redeploy** project (Deployments → … → Redeploy).

Selama database belum ditambahkan, bagian daftar kehadiran otomatis tersembunyi
dan undangan tetap berjalan normal.

Daftar tamu yang boleh tercatat ada di `GUESTS` dalam `api/rsvp.js`
(nama harus sama dengan nilai `to` di link undangan).
