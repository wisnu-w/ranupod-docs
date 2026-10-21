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
			description: 'Dokumentasi Arsitektur, Panduan Operasional, dan Deployment Platform RanuPod',
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
						{ label: 'Ringkasan & Pengenalan', slug: '' },
						{ label: 'Topologi Sistem', slug: 'architecture/system-topology' },
					],
				},
				{
					label: 'Operasional & Infrastruktur',
					items: [
						{ label: 'Kubernetes & Jaringan', slug: 'operations/kubernetes-and-networking' },
						{ label: 'Railpack & Worker Builder', slug: 'operations/railpack-and-worker' },
						{ label: 'Konfigurasi & Environment', slug: 'operations/configuration-and-env' },
						{ label: 'Production Checklist', slug: 'operations/production-checklist' },
					],
				},
			],
			customCss: [
				'./src/styles/custom.css',
			],
		}),
	],
});
