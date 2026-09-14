// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://boinkkk.github.io',
	base: '/ppw',
	image: {
		service: passthroughImageService(),
	},
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
			head: [
				{
					tag: 'script',
					attrs: {
						type: 'module',
					},
					content: `
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

function renderMermaid() {
  const elements = document.querySelectorAll(
    'pre.mermaid, pre[data-language="mermaid"], div.expressive-code pre[data-language="mermaid"], pre.language-mermaid'
  );
  if (elements.length === 0) return;

  const isDark = document.documentElement.dataset.theme === 'dark';
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'loose'
  });

  elements.forEach(async (el) => {
    const container = el.closest('.expressive-code') || el;
    if (container.getAttribute('data-mermaid-processed')) return;
    container.setAttribute('data-mermaid-processed', 'true');

    const codeEl = el.querySelector('code') || el;
    let code = codeEl.innerText || codeEl.textContent || '';
    code = code.trim();
    if (!code) return;

    const id = 'mermaid-svg-' + Math.random().toString(36).slice(2, 9);
    try {
      const { svg } = await mermaid.render(id, code);
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-diagram';
      wrapper.style.cssText = 'display:flex;justify-content:center;align-items:center;margin:2rem 0;overflow-x:auto;background:transparent;padding:1rem;border-radius:8px;';
      wrapper.innerHTML = svg;
      container.replaceWith(wrapper);
    } catch (err) {
      console.error('Mermaid render error:', err);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderMermaid);
} else {
  renderMermaid();
}
document.addEventListener('astro:page-load', renderMermaid);
window.addEventListener('load', renderMermaid);

const themeObserver = new MutationObserver(() => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default' });
});
themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
					`,
				},
				{
					tag: 'style',
					content: `
.mermaid-diagram svg {
  max-width: 100% !important;
  height: auto !important;
}
					`,
				},
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
