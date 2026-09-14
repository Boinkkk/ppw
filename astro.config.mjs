// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://boinkkk.github.io',
	base: '/ppw',
	integrations: [
		starlight({
			title: 'Web Mining - Ivan Roisus Salam',
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Bahasa Indonesia',
					lang: 'id',
				},
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/Boinkkk/ppw' }
			],
			sidebar: [
				{
					label: 'Pengantar',
					items: [
						{ label: 'Pengantar Web Mining', slug: 'pengantar-web-mining' },
					],
				},
				{
					label: 'Proyek Web Scraping',
					items: [
						{ label: 'Metodologi & Desain', slug: 'proyek-scraping/metodologi' },
						{ label: 'Implementasi Kode Scraper', slug: 'proyek-scraping/kode-scraper' },
						{ label: 'Hasil Scraping & Dataset', slug: 'proyek-scraping/hasil-dataset' },
					],
				},
			],
		}),
	],
});
