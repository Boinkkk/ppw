---
title: Pengelompokan Teks (K-Means Clustering)
description: Penerapan algoritma K-Means Clustering tanpa pengawasan (unsupervised learning) pada representasi fitur PCA (k=2) lengkap dengan evaluasi kemurnian klaster (purity 94.5%), Silhouette Score, dan visualisasi grafik klaster vs ground truth.
---

Selain klasifikasi terarah (*supervised learning*), penambangan teks juga bertujuan untuk mengeksplorasi apakah dokumen berita dapat mengelompok secara mandiri berdasarkan kedekatan geometris semantiknya tanpa pernah melihat label kategori sama sekali (*pure unsupervised learning*).

Untuk membuktikannya, diterapkan algoritma **K-Means Clustering** pada ruang fitur hasil reduksi dimensi PCA dengan parameter jumlah klaster $k = 2$.

---

## 1. Konsep & Mekanisme K-Means Clustering

K-Means bekerja dengan mempartisi $N$ dokumen ke dalam $k$ kelompok terpisah berdasarkan jarak Euclidean ke pusat massa klaster (*centroid*):

1. **Inisialisasi Centroid**: Memilih $k$ titik awal secara acak (atau menggunakan strategi cerdas `k-means++`).
2. **Penetapan Anggota Klaster**: Setiap dokumen dimasukkan ke klaster yang memiliki centroid terdekat.
3. **Pembaruan Posisi Centroid**: Posisi centroid dihitung ulang berdasarkan rata-rata (*mean*) posisi seluruh dokumen anggota klaster.
4. **Konvergensi**: Langkah 2 dan 3 diulang secara iteratif hingga posisi centroid tidak lagi berubah secara signifikan.

---

## 2. Implementasi Kode Inti K-Means (Python)

Berikut adalah potongan kode inti yang digunakan untuk melatih model K-Means serta mengevaluasi kualitas klaster secara matematis:

```python title="clustering_kmeans.py"
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score
import pandas as pd

# Inisialisasi K-Means dengan k=2 (Sport & Finance)
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
cluster_labels = kmeans.fit_predict(pca_result)

# Evaluasi metrik pemisahan dan kepadatan klaster
sil_score = silhouette_score(pca_result, cluster_labels)
db_score = davies_bouldin_score(pca_result, cluster_labels)

# Menghitung tabel kontinjensi (Ground Truth vs Klaster K-Means)
crosstab = pd.crosstab(
    df['kategori'],
    cluster_labels,
    rownames=['Aktual'],
    colnames=['Klaster']
)
print(f"Silhouette Score: {sil_score:.4f}")       # 0.0259
print(f"Davies-Bouldin Index: {db_score:.4f}")    # 5.8830
```

---

## 3. Visualisasi Grafik Hasil Clustering vs Ground Truth

Perbandingan komparatif antara label aktual (*ground truth*) dengan hasil pengelompokan mandiri algoritma K-Means divisualisasikan pada bidang proyeksi dua komponen utama (**PC1** dan **PC2**):

![Hasil K-Means Clustering vs Ground Truth](/ppw/images/clustering_kmeans_result.png)

### Penjelasan Komparasi Grafik:
- **Panel Kiri (Kategori Aktual / Ground Truth)**:
  Menampilkan sebaran 200 artikel berita berdasarkan label aslinya (**Sport** berwarna biru dan **Finance** berwarna hijau). Terlihat jelas adanya batas pemisah alami di antara kedua tema besar tersebut.
- **Panel Kanan (Hasil Pengelompokan K-Means)**:
  Menampilkan partisi wilayah klaster yang dihasilkan oleh K-Means tanpa dibimbing label kelas:
  - **Klaster 0** (merah muda) merepresentasikan mayoritas dokumen Sport.
  - **Klaster 1** (oranye kemerahan) merepresentasikan mayoritas dokumen Finance.
  - Tanda **Silang Merah (X)** menunjukkan titik pusat massa (*centroids*) masing-masing klaster.

---

## 4. Evaluasi Kualitas & Kemurnian Klaster

Efektivitas pengelompokan diukur menggunakan metrik internal (*unsupervised metrics*) dan metrik eksternal (*purity against ground truth*):

| Metrik Evaluasi | Nilai | Interpretasi Matematis |
| :--- | :---: | :--- |
| **Silhouette Score** | **0,0259** | Mengukur derajat kedekatan sampel dengan klasternya sendiri dibandingkan klaster tetangga. Nilai positif menunjukkan tidak ada tumpang tindih mayoritas. |
| **Davies-Bouldin Index** | **5,8830** | Rasio sebaran intra-klaster terhadap jarak antar-centroid. |
| **Kemurnian Klaster (*Clustering Purity*)** | **94,50%** | **189 dari 200 artikel** berhasil terkelompokkan secara tepat ke dalam domain temanya masing-masing. |

### Matriks Kontinjensi (Tabel Silang):

```text
==================================================
Klaster K-Means          Klaster 0     Klaster 1
==================================================
Aktual Finance (Aktual)      4             96
Aktual Sport (Aktual)       93              7
==================================================
Total Dokumen               97            103
==================================================
```

Perhitungan kemurnian (*purity*):
$$\text{Purity} = \frac{93 + 96}{200} = \frac{189}{200} = 94{,}50\%$$

---

## 5. Analisis & Temuan Ilmiah

1. **Struktur Semantik Kuat**:
   Fakta bahwa K-Means mampu mencapai kemurnian **94,50%** tanpa intervensi manusia membuktikan bahwa representasi TF-IDF yang dikompresi oleh PCA menangkap sinyal leksikal dan semantik yang sangat kuat dan berbeda secara ortogonal antara domain olahraga dan keuangan.
2. **Analisis Dokumen Minoritas (Overlap)**:
   Sebanyak 11 artikel (4 berita Finance di Klaster 0 dan 7 berita Sport di Klaster 1) mengalami perbedaan klaster. Berdasarkan penelusuran konten, hal ini terjadi pada berita-berita bertema irisan (*boundary cases*), seperti berita olahraga yang membahas nilai transfer pemain atau sponsor korporasi, serta berita keuangan yang mengulas industri hiburan dan olahraga.
