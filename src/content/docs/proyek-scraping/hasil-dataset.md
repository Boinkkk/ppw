---
title: Hasil Scraping & Dataset
description: Dokumentasi hasil ekstraksi berita Detikcom Sport dan Finance, struktur dataset, dan contoh data.
---

Dokumentasi ini menyajikan ringkasan hasil data yang berhasil dikumpulkan dari proses scraping pada kanal **Detik Sport** dan **Detik Finance**.

## Ringkasan Ekstraksi Dataset

| Parameter | Keterangan |
| :--- | :--- |
| **Sumber Data** | Detikcom (`sport.detik.com` dan `finance.detik.com`) |
| **Cakupan Halaman** | Masing-masing 20 halaman indeks |
| **Atribut yang Diekstrak** | `judul`, `link`, `waktu`, `isi_berita` |
| **Format Berkas** | CSV (`.csv`) dan JSON (`.json`) |
| **Total Artikel Unik** | ± 700 - 800 artikel berita |
| **Integritas Data** | Bebas duplikasi link dan bersih dari teks iklan |

---

## Struktur Kolom Dataset

Data yang diekstrak disimpan dengan struktur tabular sebagai berikut:

```
judul,link,waktu,isi_berita
```

1. **`judul`**: String judul berita (misal: `"Bos Ducati: Marc Marquez Bukan Favorit Juara!"`).
2. **`link`**: URL artikel berita (misal: `"https://sport.detik.com/moto-gp/d-8661830/..."`).
3. **`waktu`**: Waktu publikasi (misal: `"Senin, 14 Sep 2026 11:50 WIB"`).
4. **`isi_berita`**: Isi lengkap artikel yang sudah dibersihkan dan dipisahkan per paragraf.

---

## Contoh Sampel Data JSON

Berikut adalah contoh representasi data dalam format JSON:

```json title="hasil_scraping_detik.json"
[
  {
    "judul": "Bos Ducati: Marc Marquez Bukan Favorit Juara!",
    "link": "https://sport.detik.com/moto-gp/d-8661830/bos-ducati-marc-marquez-bukan-favorit-juara",
    "waktu": "Senin, 14 Sep 2026 11:50 WIB",
    "isi_berita": "Marc Marquez akhirnya puncaki Klasemen MotoGP 2026 sementara. Bos Ducati, Davide Tardozzi tolak label favorit juara buat Marquez!..."
  },
  {
    "judul": "Harga Masker Mahal Imbas Abu Anak Krakatau, Pengawasan Mesti Diperketat",
    "link": "https://finance.detik.com/berita-ekonomi-bisnis/d-8654240/harga-masker-mahal-imbas-abu-anak-krakatau-pengawasan-mesti-diperketat",
    "waktu": "Selasa, 08 Sep 2026 17:58 WIB",
    "isi_berita": "Ketua Badan Perlindungan Konsumen Nasional (BPKN) Muhammad Mufti Mubarok menyebut masyarakat ramai-ramai berburu masker imbas sebaran abu vulkanik Gunung Anak Krakatau..."
  }
]
```

---

## Rencana Pemanfaatan Lanjutan (Web & Text Mining)

Dataset berita yang telah terkumpul ini siap digunakan untuk tahapan analisis penambangan teks (*Text Mining*) selanjutnya:

1. **Text Preprocessing**:
   - *Case Folding*: Mengubah teks menjadi huruf kecil.
   - *Cleaning & Tokenizing*: Menghilangkan tanda baca dan memecah teks menjadi token kata.
   - *Filtering / Stopwords Removal*: Membuang kata-kata umum dalam Bahasa Indonesia (seperti "dan", "yang", "di").
   - *Stemming*: Mengembalikan kata berimbuhan ke bentuk kata dasarnya dengan algoritma Sastrawi.
2. **Feature Extraction (TF-IDF)**:
   - Menghitung bobot relevansi kata pada masing-masing dokumen artikel.
3. **Klasifikasi Teks (Text Classification)**:
   - Melatih model pembelajaran mesin (seperti *Naive Bayes*, *SVM*, atau *Logistic Regression*) untuk membedakan kategori berita (*Sport* vs *Finance*).
4. **Pengelompokan Topik (Topic Modeling)**:
   - Menemukan tema-tema utama yang sedang hangat diperbincangkan menggunakan algoritma *Latent Dirichlet Allocation* (LDA).
