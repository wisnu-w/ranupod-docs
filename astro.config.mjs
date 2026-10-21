// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import 'dotenv/config';

const site = process.env.SITE_URL || 'https://docs-dev.ranuoutdoor.id';
const port = Number(process.env.PORT) || 5176;
const allowedHosts = process.env.ALLOWED_HOSTS
	? (process.env.ALLOWED_HOSTS === 'true'
		? true
		: process.env.ALLOWED_HOSTS.split(',').map((h) => h.trim()).filter(Boolean))
	: ['docs-dev.ranuoutdoor.id', '.ranuoutdoor.id', 'localhost', '127.0.0.1'];

// https://astro.build/config
export default defineConfig({
	site,
	server: {
		host: true,
		port,
	},
	vite: {
		server: {
			allowedHosts,
		},
		preview: {
			allowedHosts,
		},
	},
	integrations: [
		starlight({
			title: 'RanuPod Docs',
			description: 'Panduan Pengembang untuk Deploy, Mengelola, dan Memantau Aplikasi di RanuPod',
			logo: {
				src: './src/assets/logo.svg',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/wisnu-w/ranupod-ui' }
			],
			sidebar: [
				{
					label: 'Memulai',
					items: [
						{ label: 'Pengantar RanuPod', slug: '' },
						{ label: 'Quickstart Deploy (60 Detik)', slug: 'getting-started/quickstart' },
						{ label: 'Ranu CLI Reference', slug: 'getting-started/cli' },
					],
				},
				{
					label: 'Framework & Bahasa',
					items: [
						{ label: 'Node.js & Next.js', slug: 'frameworks/nodejs' },
						{ label: 'Go (Golang)', slug: 'frameworks/golang' },
						{ label: 'Python & FastAPI', slug: 'frameworks/python' },
						{ label: 'PHP & Laravel', slug: 'frameworks/php' },
						{ label: 'Custom Dockerfile', slug: 'frameworks/dockerfile' },
					],
				},
				{
					label: 'Fitur & Konfigurasi',
					items: [
						{ label: 'Environment Variables & Secrets', slug: 'guides/environment-variables' },
						{ label: 'Custom Domain & Auto-SSL', slug: 'guides/custom-domains' },
						{ label: 'Persistent Storage & Database', slug: 'guides/persistent-storage' },
						{ label: 'Alokasi Sumber Daya & Scaling', slug: 'guides/scaling' },
					],
				},
				{
					label: 'Observabilitas (RanuObserve)',
					items: [
						{ label: 'RanuLog (Live Streaming Log)', slug: 'observability/ranulog' },
						{ label: 'RanuTrace (Distributed Latency)', slug: 'observability/ranutrace' },
						{ label: 'RanuRUM (Web Vitals Monitoring)', slug: 'observability/ranurum' },
					],
				},
				{
					label: 'Billing & Langganan',
					items: [
						{ label: 'Paket Bulanan & Pay-As-You-Go', slug: 'billing/pricing-and-payg' },
					],
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
		}),
	],
});
