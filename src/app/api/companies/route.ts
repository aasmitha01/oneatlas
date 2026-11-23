import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() { try { const data = await prisma.company.findMany({ include: { _count: { select: { models: true } } }, orderBy: { name: 'asc' } }); return NextResponse.json({ data }); } catch (e) { console.error(e); return NextResponse.json({ error: 'Unable to retrieve companies' }, { status: 503 }); } }
