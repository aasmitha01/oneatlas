import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() { try { const data = await prisma.aIModel.findMany({ include: { company: true, benchmarks: true, providers: { include: { provider: true, pricing: true } } } }); const ranked = data.map(m => ({ ...m, score: Math.max(0, ...m.benchmarks.map(b => b.score)) })).sort((a,b) => b.score-a.score); return NextResponse.json({ data: ranked }); } catch (e) { console.error(e); return NextResponse.json({ error: 'Unable to retrieve rankings' }, { status: 503 }); } }
