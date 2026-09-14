---
title: Reduksi Dimensi (PCA)
description: Penerapan Principal Component Analysis (PCA) untuk mengompresi matriks TF-IDF dari 6.486 fitur menjadi 100 komponen utama dengan retensi varians 74.69%.
---

Matriks TF-IDF memiliki **6.486 dimensi fitur**, jauh melampaui jumlah dokumen yang dianalisis ($N = 200$). Kondisi ini dikenal sebagai **Curse of Dimensionality** (kutukan dimensi), yang dapat menyebabkan *overfitting*, peningkatan beban komputasi, serta kesulitan dalam visualisasi data.

Untuk mengatasinya, diterapkan teknik reduksi dimensi tanpa pengawasan (*unsupervised*) menggunakan **Principal Component Analysis (PCA)**.

---

## 1. Mekanisme Kerja PCA

PCA memproyeksikan data dari ruang dimensi tinggi ke subruang berdimensi lebih rendah dengan mencari arah varians maksimal:

1. Menghitung kovarians antar fitur kata.
2. Mengekstraksi nilai eigen (*eigenvalues*) dan vektor eigen (*eigenvectors*).
3. Membentuk sumbu-sumbu baru ortogonal yang disebut **Komponen Utama (*Principal Components*)**, diurutkan dari yang memiliki varians terbesar (PC1, PC2, ..., PCk).

---

## 2. Parameter & Hasil Kompresi Varians

Pada pipeline ini, dipilih $k = 100$ komponen utama:

| Parameter | Nilai Awal (TF-IDF) | Nilai Setelah PCA | Keterangan / Dampak |
| :--- | :---: | :---: | :--- |
| **Dimensi Fitur** | 6.486 kolom kata | **100 kolom PC** | **Penyusutan dimensi sebesar 98,46%** |
| **Bentuk Matriks** | $(200, 6486)$ | $(200, 100)$ | Sangat efisien dan padat (*dense matrix*) |
| **Retensi Informasi Varians** | 100% | **74,69%** | Mempertahankan mayoritas informasi esensial |

> [!NOTE]
> Hanya dengan 100 komponen utama dari total 6.486 fitur asli, model mampu merangkum **74,69% total variasi informasi** korpus berita.

---

## 3. Analisis Varians Kumulatif (Scree Plot)

Kurva varians kumulatif menunjukkan bagaimana akumulasi komponen utama menangkap variansi korpus:
- **PC1 & PC2**: Menjelaskan porsi varians terbesar dan berperan paling signifikan dalam memisahkan kedua topik berita.
- **Komponen 3 – 50**: Menangkap variasi subtopik spesifik (seperti sepak bola vs bulutangkis pada sport, atau perbankan vs bursa saham pada finance).
- **Komponen 51 – 100**: Menyempurnakan detail variansi individual dokumen.

---

## 4. Visualisasi Proyeksi 2D (PC1 vs PC2)

Ketika data diproyeksikan ke dalam bidang dua dimensi menggunakan **PC1** sebagai sumbu horizontal dan **PC2** sebagai sumbu vertikal:

- Titik-titik artikel **Sport** (berwarna biru) dan **Finance** (berwarna hijau) terpisah secara tegas membentuk dua klaster (*clusters*) alami.
- Pemisahan yang nyata ini menegaskan bahwa informasi topikal berhasil dipertahankan meskipun dimensi fitur telah disusutkan lebih dari 98%.

---

## 5. Unduh Dataset Hasil PCA

Dataset hasil reduksi dimensi berisikan 200 baris dengan atribut `kategori_label` serta fitur `PC1` sampai `PC100`:

- 📥 [Unduh data_hasil_pca.csv (421 KB)](/ppw/data/data_hasil_pca.csv)
