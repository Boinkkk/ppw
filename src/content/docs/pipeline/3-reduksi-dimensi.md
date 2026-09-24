---
title: Reduksi Dimensi (PCA)
description: Penerapan Principal Component Analysis (PCA) untuk mengompresi matriks TF-IDF dari 6.486 fitur menjadi 100 komponen utama dengan retensi varians 74.69%.
---

Matriks TF-IDF memiliki **6.486 dimensi fitur**, jauh melampaui jumlah dokumen yang dianalisis ($N = 200$). Kondisi ini dikenal sebagai **Curse of Dimensionality** (kutukan dimensi), yang dapat menyebabkan *overfitting*, peningkatan beban komputasi, serta kesulitan dalam visualisasi data.

Untuk mengatasinya, diterapkan teknik reduksi dimensi linier tanpa pengawasan (*unsupervised*) menggunakan **Principal Component Analysis (PCA)**.

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

### Implementasi Kode Inti PCA (Python)

```python title="pca_reduction.py"
from sklearn.decomposition import PCA
import pandas as pd

# Mereduksi matriks TF-IDF menjadi 100 Komponen Utama
n_components = 100
pca = PCA(n_components=n_components, random_state=42)
pca_result = pca.fit_transform(tfidf_matrix.toarray())

# Menyusun DataFrame hasil reduksi
kolom_pc = [f"PC{i+1}" for i in range(n_components)]
df_pca = pd.DataFrame(pca_result, columns=kolom_pc)
df_pca.insert(0, 'kategori_label', df['kategori'].values)

# Evaluasi total varians tertangkap
varians_total = pca.explained_variance_ratio_.sum() * 100
print(f"Total Varians yang Dipertahankan: {varians_total:.2f}%") # 74.69%
```

> [!NOTE]
> Hanya dengan 100 komponen utama dari total 6.486 fitur leksikal asli, model berhasil merangkum **74,69% total variasi informasi** korpus berita.

---

## 3. Analisis Varians Kumulatif (Scree Plot)

Kurva varians kumulatif menunjukkan bagaimana akumulasi komponen utama menangkap variansi korpus secara bertahap:

![Kurva Varians Kumulatif PCA](/ppw/images/pca_scree_plot.png)

- **PC1 & PC2**: Menjelaskan porsi varians individual terbesar dan berperan paling signifikan dalam memisahkan kedua topik berita secara makro.
- **Komponen 3 – 50**: Menangkap variasi subtopik spesifik (seperti sepak bola vs bulutangkis pada sport, atau perbankan vs bursa saham pada finance).
- **Komponen 51 – 100**: Menyempurnakan detail variansi individual dokumen hingga melampaui ambang batas 70% representasi informasi.

---

## 4. Visualisasi Proyeksi 2D (PC1 vs PC2)

Ketika data dokumen diproyeksikan ke dalam bidang dua dimensi menggunakan **PC1** sebagai sumbu horizontal dan **PC2** sebagai sumbu vertikal:

![Proyeksi 2D Klaster Dokumen](/ppw/images/pca_scatter_2d.png)

- **Pemisahan Alami Antartopik**:
  Titik-titik artikel **Sport** (berwarna biru) dan **Finance** (berwarna hijau) terpisah secara tegas membentuk dua klaster (*clusters*) alami.
- **Kepadatan Intra-Kelas**:
  Dokumen dengan tema sejenis berkumpul rapat (*dense clustering*), membuktikan bahwa struktur semantik berita tetap utuh meskipun dimensi fitur telah disusutkan lebih dari **98%**.

---

## 5. Unduh Dataset Hasil PCA

Dataset hasil reduksi dimensi berisikan 200 baris dengan atribut `kategori_label` serta fitur `PC1` sampai `PC100`:

- 📥 [Unduh data_hasil_pca.csv (421 KB)](/ppw/data/data_hasil_pca.csv)
