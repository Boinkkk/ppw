---
title: Pembersihan & Preprocessing Teks
description: Dokumentasi lengkap tahapan pembersihan data, seleksi artikel representatif, penghapusan noise regex, stopword removal, dan stemming Sastrawi.
---

Tahap **Text Preprocessing** merupakan fondasi krusial dalam alur *Web Content Mining*. Teks berita mentah hasil scraping umumnya sarat dengan elemen *noise* (iklan, tag editorial, tanda baca, huruf kapital acak, serta kata sambung yang tidak bermakna diskriminatif).

---

## 1. Seleksi Data Representatif (Top-100 Berita Terpanjang)

Dari total 778 artikel hasil scraping (392 Detik Sport dan 386 Detik Finance), dilakukan seleksi berbasis panjang teks artikel (*word count*):

| Kategori Berita | Total Hasil Scraping | Jumlah Terpilih (Top-100) | Rentang Panjang Kata |
| :--- | :---: | :---: | :---: |
| **Detik Sport** | 392 artikel | **100 artikel** | 225 – 1.482 kata |
| **Detik Finance** | 386 artikel | **100 artikel** | 338 – 1.153 kata |
| **Total Korpus** | **778 artikel** | **200 artikel** | **Dataset Seimbang (Balanced 50:50)** |

### Alasan Pengambilan Top-100:
1. **Kekayaan Semantik Dokumen**: Artikel berita pendek sering kali hanya berisi pengumuman kilat atau foto dengan deskripsi minim. Dengan mengambil 100 artikel terpanjang, setiap dokumen memiliki kekayaan kosakata dan konteks tematik yang optimal.
2. **Keseimbangan Kelas (*Balanced Class*)**: Mencegah model klasifikasi mengalami bias terhadap kategori yang memiliki jumlah sampel lebih dominan.

---

## 2. Alur Pembersihan Bertahap (Noise Sanitization)

Pembersihan teks dilakukan secara berurutan menggunakan ekspresi reguler (*regex*) dan pustaka NLP **Sastrawi**:

```mermaid
flowchart LR
    A["Teks Berita Mentah"] --> B["1. Regex Noise Removal<br/>(Gambas, Iklan, Prefix)"]
    B --> C["2. Case Folding & Sanitasi<br/>(Lowercase & Hapus Simbol)"]
    C --> D["3. Stopword Removal<br/>(Kata Tugas Sastrawi)"]
    D --> E["4. Morphological Stemming<br/>(Akar Kata Sastrawi)"]
    E --> F["Teks Bersih & Terstandarisasi"]
```

### 2.1 Regex Noise Cleaning
Menghilangkan elemen struktural khas portal berita Detikcom yang tidak relevan dengan topik berita:
- **Tag Video & Widget Embed**: Menghapus pola `\[Gambas:.*?\]`.
- **Rekomendasi Redaksi**: Menghapus kalimat sisipan seperti `"Lihat juga Video: ..."` dan `"Baca juga: ..."`.
- **Prefix Kota & Wilayah**: Menghapus penanda lokasi berita di awal paragraf seperti `"Jakarta - "`, `"Surabaya - "`, atau `"Denpasar -"`.
- **Watermark Redaksi**: Menghapus identitas portal `"detikcom"`, `"detikSport"`, dan `"detikFinance"`.

### 2.2 Case Folding & Sanitasi Simbol
- Mengonversi semua huruf kapital menjadi huruf kecil (*lowercase*).
- Menghapus seluruh karakter numerik (angka `0-9`), tanda baca, dan karakter non-alfabet (`[^a-z\s]`).
- Menormalisasi spasi ganda menjadi spasi tunggal.

### 2.3 Stopword Removal
Menghapus kata-kata fungsional umum Bahasa Indonesia yang memiliki frekuensi tinggi namun minim informasi leksikal (seperti *yang, di, ke, dari, pada, untuk, adalah, ini, itu, dan, dengan*).

### 2.4 Stemming Bahasa Indonesia (Sastrawi)
Mengembalikan seluruh kata berimbuhan (awalan, akhiran, sisipan, dan apitan) ke bentuk kata dasarnya. 
- Contoh: *memenangkan* $\rightarrow$ **menang**, *keuangan* $\rightarrow$ **uang**, *dipertandingkan* $\rightarrow$ **tanding**.

### 2.5 Implementasi Kode Inti Preprocessing (Python)

Berikut adalah potongan kode inti yang digunakan dalam pipeline untuk membersihkan dan menstandarisasi teks berita:

```python title="preprocessing.py"
import re
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

# 1. Pembersihan noise regex & case folding
def bersihkan_noise_teks(text):
    # Hapus tag embed video & rekomendasi redaksi
    text = re.sub(r"\[Gambas:.*?\]", " ", text)
    text = re.sub(r"(Lihat juga Video:|Baca juga:).*?(\n|$)", " ", text)
    
    # Hapus prefix kota dan watermark redaksi
    text = re.sub(r"^[A-Z\s]+-\s*", " ", text)
    text = re.sub(r"detikcom|detikSport|detikFinance", " ", text, flags=re.IGNORECASE)
    
    # Case folding & eliminasi simbol numerik
    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()

# 2. Stopword Removal & Morphological Stemming (Sastrawi)
stopword_remover = StopWordRemoverFactory().create_stop_word_remover()
stemmer = StemmerFactory().create_stemmer()

def stopword_dan_stemming(text):
    text = stopword_remover.remove(text)
    return stemmer.stem(text)

# Eksekusi pipeline pada korpus
df['isi_berita_clean'] = df['isi_berita'].apply(bersihkan_noise_teks)
df['isi_berita_stemmed'] = df['isi_berita_clean'].apply(stopword_dan_stemming)
```

---

## 3. Hasil & Rekapitulasi Reduksi Teks

Efektivitas pembersihan teks dapat diukur dari penurunan jumlah token keseluruhan serta penyusutan kosakata unik (*vocabulary*):

| Tahapan Preprocessing | Total Token Kata | Kosakata Unik (*Vocab*) | Reduksi Token | Reduksi Vocab |
| :--- | :---: | :---: | :---: | :---: |
| **1. Teks Asli (Raw Scraped)** | 104.889 | 9.674 | Baseline (0%) | Baseline (0%) |
| **2. Noise Cleaning & Case Folding** | 101.479 | 9.076 | -3,25% | -6,18% |
| **3. Stopwords & Stemming Sastrawi** | **79.781** | **6.486** | **-23,94%** | **-32,95%** |

> [!NOTE]
> Tahap stemming berhasil memangkas **3.188 variasi kata inflektif (-32,95%)**, menyederhanakan ruang fitur (*feature space*) secara signifikan sebelum proses pembobotan TF-IDF.

---

## 4. Unduh Dataset Hasil Preprocessing

Berkas hasil preprocessing lengkap berisi 200 artikel (100 Sport & 100 Finance) dengan atribut `judul`, `link`, `waktu`, `isi_berita` (yang sudah dibersihkan dan di-stem), serta `kategori`:

- 📥 [Unduh data_berita_processed.csv (567 KB)](/ppw/data/data_berita_processed.csv)
