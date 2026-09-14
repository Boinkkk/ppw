---
title: Implementasi Kode Scraper
description: Kode program Python scraper Detikcom sederhana, efisien, dengan mekanisme anti-duplikasi.
---

Berikut adalah implementasi kode program scraper Python sederhana yang digunakan untuk menambang berita dari kanal Sport dan Finance Detik.com.

## Kode Lengkap (`main.py`)

```python title="main.py"
import csv
import json
import time
import requests
from bs4 import BeautifulSoup

# ==============================================================================
# KONFIGURASI
# ==============================================================================
BASE_URLS = [
    "https://sport.detik.com/indeks",
    "https://finance.detik.com/indeks"
]
TOTAL_PAGES = 20
DELAY = 0.3  # Jeda waktu (detik) antar request
CSV_FILE = "hasil_scraping_detik.csv"
JSON_FILE = "hasil_scraping_detik.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
}


# ==============================================================================
# 1. PENGUMPULAN LINK (DEDUPLIKASI DENGAN SET)
# ==============================================================================
def collect_article_links(base_urls, total_pages):
    print("=== TAHAP 1: Mengumpulkan Link Artikel ===")
    unique_links = []
    seen_links = set()
    session = requests.Session()

    for base_url in base_urls:
        print(f"\n[*] Mengambil link dari: {base_url}")
        for page in range(1, total_pages + 1):
            url = f"{base_url}?page={page}"
            print(f"    -> Membuka halaman {page}/{total_pages}...")

            try:
                res = session.get(url, headers=HEADERS, timeout=10)
                if res.status_code != 200:
                    continue

                soup = BeautifulSoup(res.text, "html.parser")
                articles = soup.find_all("article")

                for article in articles:
                    link_tag = article.find("a")
                    if not link_tag or "href" not in link_tag.attrs:
                        continue

                    href = link_tag["href"].strip()

                    # Lewati link video atau link non-artikel
                    if not href or "20.detik.com" in href:
                        continue

                    # Menjamin link tidak diduplikasi
                    if href not in seen_links:
                        seen_links.add(href)
                        unique_links.append(href)

            except Exception as e:
                print(f"    [!] Error pada halaman {page}: {e}")

            time.sleep(DELAY)

    print(f"\n[+] Total link unik terkumpul: {len(unique_links)} link.\n")
    return unique_links


# ==============================================================================
# 2. SCRAPING DETAIL ARTIKEL (Judul, Link, Waktu, Isi Berita)
# ==============================================================================
def scrape_article_detail(session, url):
    try:
        # Tambahkan ?single=1 agar artikel multi-halaman dimuat lengkap
        request_url = url + ("?single=1" if "?" not in url else "&single=1")
        res = session.get(request_url, headers=HEADERS, timeout=10)
        if res.status_code != 200:
            return None

        soup = BeautifulSoup(res.text, "html.parser")

        # 1. Judul
        title_tag = soup.find("h1", class_="detail__title") or soup.find("h1")
        judul = title_tag.get_text(strip=True) if title_tag else ""
        if not judul:
            return None

        # 2. Waktu
        date_tag = soup.find("div", class_="detail__date") or soup.find("div", class_="date")
        waktu = date_tag.get_text(strip=True) if date_tag else ""

        # 3. Isi Berita
        body = soup.find("div", class_="detail__body-text") or soup.find("div", id="detikdetailtext")
        isi_berita = ""

        if body:
            # Hapus elemen pengganggu (iklan, script, widget baca juga, dll)
            for unwanted in body.find_all(["script", "style", "table", "iframe", "figure"]):
                unwanted.decompose()
            for unwanted in body.find_all(
                "div",
                class_=["linkbaca", "detail__body-tag", "inner-linkbaca", "sisip_video_inarticle", "advertisement"]
            ):
                unwanted.decompose()

            # Ambil seluruh teks paragraf
            paragraphs = []
            for p in body.find_all("p"):
                text = p.get_text(strip=True)
                if text and "SCROLL TO CONTINUE WITH CONTENT" not in text and "ADVERTISEMENT" not in text:
                    paragraphs.append(text)

            isi_berita = "\n\n".join(paragraphs) if paragraphs else body.get_text(separator=" ", strip=True)

        return {
            "judul": judul,
            "link": url,
            "waktu": waktu,
            "isi_berita": isi_berita
        }

    except Exception as e:
        print(f"      [!] Error saat scraping {url}: {e}")
        return None


# ==============================================================================
# 3. PROSES UTAMA (ANTI-DUPLIKASI SAAT SCRAPING)
# ==============================================================================
def main():
    # 1. Kumpulkan link artikel dari sport dan finance (masing-masing 20 halaman)
    links = collect_article_links(BASE_URLS, TOTAL_PAGES)

    # Simpan daftar link ke file teks
    with open("links.txt", "w", encoding="utf-8") as f:
        for link in links:
            f.write(f"{link}\n")

    # 2. Scraping detail tiap artikel (memastikan link yang sama tidak discrape 2x)
    print("=== TAHAP 2: Scraping Detail Berita ===")
    scraped_data = []
    scraped_links = set()
    session = requests.Session()
    total = len(links)

    for idx, url in enumerate(links, 1):
        # Proteksi anti-duplikasi: lewati jika link sudah pernah discrape
        if url in scraped_links:
            print(f"[{idx}/{total}] [SKIP] Link sudah pernah discrape: {url}")
            continue

        print(f"[{idx}/{total}] Scraping: {url}")
        article = scrape_article_detail(session, url)

        if article:
            scraped_data.append(article)
            scraped_links.add(url)  # Tandai link agar tidak discrape lagi

        time.sleep(DELAY)

    # 3. Simpan hasil ekstraksi (Hanya 4 kolom: judul, link, waktu, isi_berita)
    print("\n=== TAHAP 3: Menyimpan Hasil ===")

    # Simpan ke CSV
    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["judul", "link", "waktu", "isi_berita"])
        writer.writeheader()
        writer.writerows(scraped_data)
    print(f"[+] Berhasil disimpan ke CSV: {CSV_FILE} ({len(scraped_data)} artikel)")

    # Simpan ke JSON
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(scraped_data, f, ensure_ascii=False, indent=4)
    print(f"[+] Berhasil disimpan ke JSON: {JSON_FILE}")


if __name__ == "__main__":
    main()
```

---

## Analisis Komponen Kode

### 1. `collect_article_links(base_urls, total_pages)`
- Melakukan iterasi melalui daftar `BASE_URLS` dan membuka halaman 1 sampai 20 dengan menambahkan parameter `?page={page}`.
- Menggunakan `session = requests.Session()` untuk efisiensi *TCP Connection pooling*.
- Menggunakan objek `seen_links = set()` untuk memastikan setiap link yang ditambahkan ke `unique_links` bernilai unik.
- Menyaring dan membuang link dari domain `20.detik.com` yang merupakan laman pemutar video (bukan teks berita).

### 2. `scrape_article_detail(session, url)`
- Menyematkan `?single=1` pada URL untuk memastikan berita multi-halaman tersaji dalam 1 halaman utuh.
- Mengidentifikasi judul melalui selektor `h1.detail__title`.
- Mengidentifikasi tanggal dan waktu publikasi dari `div.detail__date`.
- Mengambil blok isi berita dari `div.detail__body-text`, kemudian membersihkan elemen pengganggu menggunakan `tag.decompose()`.
- Menggabungkan paragraf dengan pemisah baris baru ganda (`\n\n`).

### 3. `main()`
- Mengoordinasikan eksekusi dari Tahap 1, Tahap 2, hingga penyimpanan data ke CSV dan JSON.
- Menerapkan `scraped_links = set()` sebagai penjaga agar jika terdapat link yang identik, proses ekstraksi langsung dilewati (*skip*), menjamin **tidak ada artikel yang discrape 2x**.
