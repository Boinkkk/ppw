---
title: Ekstraksi Fitur Teks (TF-IDF)
description: Penjelasan pembobotan kata menggunakan TF-IDF (Term Frequency - Inverse Document Frequency), pembentukan Document-Term Matrix (DTM), dan analisis kata kunci dominan.
---

Model pembelajaran mesin (*Machine Learning*) bekerja pada representasi numerik. Oleh karena itu, kumpulan dokumen teks yang telah dibersihkan perlu ditransformasikan menjadi matriks angka menggunakan metode pembobotan **TF-IDF** (*Term Frequency - Inverse Document Frequency*).

---

## 1. Konsep & Formulasi TF-IDF

TF-IDF merefleksikan seberapa esensial suatu kata ($t$) terhadap dokumen tertentu ($d$) dalam korpus ($D$):

$$
\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)
$$

1. **Term Frequency (TF)**:
   Mengukur frekuensi kemunculan term $t$ dalam dokumen $d$. Semakin sering kata tersebut muncul, semakin besar nilainya:

   $$
   \text{TF}(t, d) = \frac{f_{t, d}}{\sum_{t' \in d} f_{t', d}}
   $$

2. **Inverse Document Frequency (IDF)**:
   Memberikan bobot penalti (penurunan nilai) terhadap kata-kata yang muncul di hampir semua dokumen, dan memberikan bobot tinggi pada kata-kata spesifik yang hanya muncul di sedikit dokumen:

   $$
   \text{IDF}(t, D) = \log\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1
   $$

---

## 2. Struktur Matriks Dokumen-Term (DTM)

Dengan menerapkan `TfidfVectorizer()` dari Scikit-Learn pada 200 artikel yang telah di-stem:

| Properti Matriks | Nilai / Dimensi | Keterangan |
| :--- | :---: | :--- |
| **Jumlah Baris ($N$)** | **200** | Jumlah artikel (100 Sport + 100 Finance) |
| **Jumlah Kolom ($M$)** | **6.486** | Total kosakata unik (*vocabulary features*) |
| **Tingkat Kepadatan (*Density*)** | $\approx 2,4\%$ | Sebagian besar sel bernilai 0 (*sparse matrix*) |

Setiap baris matriks merepresentasikan satu artikel sebagai vektor berdimensi 6.486, di mana tiap elemennya adalah nilai pembobotan TF-IDF untuk kata yang bersangkutan.

---

## 3. Kata Kunci Paling Berpengaruh per Kategori

Berdasarkan nilai rata-rata skor TF-IDF tertinggi pada masing-masing kelas, diperoleh kata-kata yang paling membedakan kedua domain berita:

### Kategori Detik Sport:
1. **atlet** (skor rata-rata tinggi pada liputan cabor)
2. **tanding** (pertandingan, kompetisi)
3. **juara** (kejuaraan, medali emas)
4. **poin** (skor pertandingan, klasemen)
5. **laga** (turnamen, babak final)
6. **tim / skuad** (kontingen nasional, PBSI, timnas)
7. **raket / bulutangkis** (kejurnas, audisi PB Djarum)
8. **pembalap** (MotoGP, gokart nasional)

### Kategori Detik Finance:
1. **investasi** (penanaman modal, KEK)
2. **nasabah** (perbankan, tabungan syariah)
3. **persen / %** (suku bunga, dividen, inflasi)
4. **saham** (IHSG, bursa efek, emiten)
5. **ekonomi** (pertumbuhan makro, neraca dagang)
6. **bank** (BSI, BRI, Danantara, perbankan)
7. **industri** (manufaktur, ekspor, hilirisasi)
8. **harga** (harga komoditas, pangan, tarif)

> [!TIP]
> Perbedaan leksikal yang sangat kontras ini membuktikan bahwa teks berita Detik Sport dan Detik Finance memiliki separasi semantik yang kuat (*high discriminatory power*), menjadikannya kandidat ideal untuk klasifikasi linier.
