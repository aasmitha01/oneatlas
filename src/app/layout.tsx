import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/app-shell';
export const metadata: Metadata = { title: 'OneAtlas — AI Model Intelligence', description: 'Discover, compare and evaluate AI models across providers.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><AppShell>{children}</AppShell></body></html>; }
