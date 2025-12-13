# Panduan Penggunaan Komponen Notifikasi

Komponen notifikasi ini menyediakan tampilan yang konsisten dan menarik untuk semua notifikasi di aplikasi.

## Jenis-jenis Notifikasi

### 1. Konfirmasi Penyimpanan (`confirm-save`)
Digunakan sebelum menyimpan data

### 2. Konfirmasi Perubahan (`confirm-edit`)
Digunakan sebelum mengubah data

### 3. Peringatan Hapus (`confirm-delete`)
Digunakan sebelum menghapus data

### 4. Notifikasi Berhasil (`success`)
Ditampilkan setelah operasi berhasil

### 5. Notifikasi Gagal (`error`)
Ditampilkan ketika terjadi kesalahan

### 6. Konfirmasi Logout (`confirm-logout`)
Digunakan saat user ingin keluar

### 7. Notifikasi Berhasil Login (`success-login`)
Ditampilkan setelah login berhasil

## Cara Penggunaan

### 1. Import komponen dan hook

```javascript
import Notifikasi from '../notifikasi/Notifikasi';
import { useNotifikasi } from '../notifikasi/useNotifikasi';
```

### 2. Inisialisasi hook di component

```javascript
const { notifikasi, showNotifikasi, hideNotifikasi } = useNotifikasi();
```

### 3. Tampilkan notifikasi

#### Contoh: Konfirmasi Hapus
```javascript
const handleDelete = (id) => {
  showNotifikasi({
    type: 'confirm-delete',
    onConfirm: () => {
      // Lakukan delete
      deleteData(id);
      hideNotifikasi();
    },
    onCancel: hideNotifikasi
  });
};
```

#### Contoh: Notifikasi Sukses dengan Auto Close
```javascript
showNotifikasi({
  type: 'success',
  message: 'Data berhasil disimpan!',
  autoClose: true,
  autoCloseDuration: 2000,
  onConfirm: hideNotifikasi
});
```

#### Contoh: Notifikasi Error
```javascript
showNotifikasi({
  type: 'error',
  message: 'Gagal menyimpan data',
  detail: 'Silakan periksa koneksi internet Anda',
  onConfirm: hideNotifikasi,
  onCancel: hideNotifikasi
});
```

#### Contoh: Konfirmasi Custom
```javascript
showNotifikasi({
  type: 'confirm-save',
  message: 'Apakah Anda yakin ingin menyimpan perubahan?',
  confirmText: 'Simpan',
  cancelText: 'Batal',
  onConfirm: () => {
    saveData();
    hideNotifikasi();
  },
  onCancel: hideNotifikasi
});
```

### 4. Render komponen Notifikasi

Tambahkan di akhir return component:

```javascript
return (
  <div>
    {/* Your component content */}
    
    {/* Komponen Notifikasi */}
    <Notifikasi
      show={notifikasi.show}
      type={notifikasi.type}
      message={notifikasi.message}
      detail={notifikasi.detail}
      onConfirm={notifikasi.onConfirm}
      onCancel={notifikasi.onCancel}
      confirmText={notifikasi.confirmText}
      cancelText={notifikasi.cancelText}
      autoClose={notifikasi.autoClose}
      autoCloseDuration={notifikasi.autoCloseDuration}
    />
  </div>
);
```

## Props Notifikasi

| Prop | Type | Default | Deskripsi |
|------|------|---------|-----------|
| `show` | boolean | false | Menampilkan/menyembunyikan notifikasi |
| `type` | string | 'success' | Jenis notifikasi |
| `message` | string | '' | Pesan custom (opsional) |
| `detail` | string | '' | Detail tambahan (opsional) |
| `onConfirm` | function | null | Handler untuk tombol konfirmasi |
| `onCancel` | function | null | Handler untuk tombol batal |
| `confirmText` | string | 'Ya' | Text untuk tombol konfirmasi |
| `cancelText` | string | 'Tidak' | Text untuk tombol batal |
| `autoClose` | boolean | false | Auto close untuk notifikasi sukses |
| `autoCloseDuration` | number | 3000 | Durasi auto close dalam ms |

## Catatan Penting

1. Untuk notifikasi konfirmasi, tombol Cancel dan Confirm akan ditampilkan
2. Untuk notifikasi success/error, hanya tombol close (X) yang ditampilkan (kecuali autoClose = true)
3. Auto close hanya berfungsi untuk type 'success' dan 'success-login'
4. Notifikasi akan muncul di tengah layar dengan overlay gelap
5. Klik di luar modal tidak akan menutup notifikasi konfirmasi (untuk mencegah close tidak sengaja)

## File yang Sudah Diupdate

- ✅ App.js (logout & login)
- ✅ Jadwal.js (CRUD jadwal)
- ✅ ProfilSaya.js (update profil)
- ⏳ Laporan.js
- ⏳ InformasiPengguna.js
- ⏳ DataPasien.js
- ⏳ File layanan lainnya
