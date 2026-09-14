---
title: Pemodelan Machine Learning & Evaluasi
description: Evaluasi performa model klasifikasi supervised (Multinomial Naive Bayes, Linear SVM, dan Logistic Regression) pada klasifikasi berita Detikcom Sport vs Finance.
---

Tahap pemodelan bertujuan untuk membangun sistem cerdas yang mampu memprediksi kategori suatu artikel berita secara otomatis (*Sport* atau *Finance*) berdasarkan fitur teks yang telah diekstraksi.

---

## 1. Desain Eksperimen & Pembagian Data

Eksperimen klasifikasi dilakukan dengan protokol validasi standar industri:

- **Total Sampel**: 200 artikel (100 Sport & 100 Finance).
- **Pembagian Data (*Split Ratio*)**: **80% Data Latih** (160 artikel) dan **20% Data Uji** (40 artikel).
- **Strategi Pemisahan**: *Stratified Split* dengan seed `random_state=42`, menjamin data latih dan data uji masing-masing memiliki perbandingan kelas yang seimbang (50% Sport : 50% Finance).

---

## 2. Model Klasifikasi yang Diuji

Tiga algoritma dengan karakteristik pendekatan berbeda diuji secara komparatif:

1. **Multinomial Naive Bayes (TF-IDF)**:
   Model berbasis probabilitas Bayes yang sangat populer untuk pemrosesan teks, mengasumsikan independensi fitur kata bersyarat.
2. **Linear Support Vector Machine / LinearSVC (TF-IDF)**:
   Model berbasis *hyperplane* batas keputusan maksimal (*maximum margin classifier*), sangat efektif pada ruang berdimensi tinggi (*sparse text features*).
3. **Logistic Regression (PCA 100 Komponen)**:
   Model regresi logistik linier yang dilatih pada ruang fitur terkompresi hasil reduksi dimensi PCA.

---

## 3. Hasil & Komparasi Metrik Evaluasi

Pengujian pada data uji (*test set*) yang belum pernah dilihat model menghasilkan skor evaluasi sebagai berikut:

| Model Klasifikasi | Representasi Fitur | Akurasi | Precision | Recall | F1-Score |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Multinomial Naive Bayes** | TF-IDF (6.486 dimensi) | **100,00%** | **100,00%** | **100,00%** | **100,00%** |
| **Linear SVM (LinearSVC)** | TF-IDF (6.486 dimensi) | **100,00%** | **100,00%** | **100,00%** | **100,00%** |
| **Logistic Regression** | PCA (100 komponen) | **100,00%** | **100,00%** | **100,00%** | **100,00%** |

---

## 4. Analisis Confusion Matrix & Laporan Klasifikasi

### Matriks Konfusi (*Confusion Matrix*):
Pada data uji berjumlah 40 sampel (20 Finance dan 20 Sport):

- **True Negative (Finance terprediksi Finance)**: 20
- **False Positive (Finance terprediksi Sport)**: 0
- **False Negative (Sport terprediksi Finance)**: 0
- **True Positive (Sport terprediksi Sport)**: 20

```
                   Prediksi Finance    Prediksi Sport
Aktual Finance            20                  0
Aktual Sport               0                 20
```

### Laporan Klasifikasi (*Classification Report*):
```text
              precision    recall  f1-score   support

 Finance (0)       1.00      1.00      1.00        20
   Sport (1)       1.00      1.00      1.00        20

    accuracy                           1.00        40
   macro avg       1.00      1.00      1.00        40
weighted avg       1.00      1.00      1.00        40
```

---

## 5. Kesimpulan & Temuan Kunci

1. **Pemisahan Semantik Sangat Kuat (*Linearly Separable*)**:
   Domain pemberitaan olahraga dan keuangan memiliki leksikon bahasa yang sangat berbeda secara fundamental. Preprocessing yang teliti (menghilangkan noise iklan dan menstandardisasi bentuk dasar kata via Sastrawi) membuat perbedaan kedua kategori ini menjadi mutlak terpisah.
2. **Efektivitas Reduksi Dimensi PCA**:
   Hasil pengujian *Logistic Regression* yang dilatih menggunakan 100 fitur PCA menghasilkan akurasi 100%, setara dengan model yang menggunakan 6.486 fitur TF-IDF penuh. Hal ini membuktikan bahwa 100 komponen utama PCA sudah cukup menangkap seluruh informasi pembeda esensial.
3. **Rekomendasi Implementasi**:
   Untuk sistem produksi nyata dengan latensi rendah, **Linear SVM pada TF-IDF** atau **Logistic Regression pada PCA** sangat direkomendasikan karena kecepatan inferensi yang sangat tinggi serta penggunaan memori yang efisien.
