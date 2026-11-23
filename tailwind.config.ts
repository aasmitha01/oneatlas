import type { Config } from 'tailwindcss';
const config: Config = { content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#111827', muted: '#64748b', violet: '#7667f5' }, boxShadow: { soft: '0 12px 40px rgba(15,23,42,.07)' } } }, plugins: [] };
export default config;
