import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try { const { slug } = await params; const model = await prisma.aIModel.findUnique({ where: { slug }, include: { company: true, providers: { include: { provider: true, pricing: true } }, benchmarks: true } });
    if (!model) return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    return NextResponse.json({ data: { ...model, providers: model.providers.map(p => ({ ...p, pricing: p.pricing.map(x => ({ ...x, inputPricePerMillion: Number(x.inputPricePerMillion), outputPricePerMillion: Number(x.outputPricePerMillion) })) })) });
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Unable to retrieve model' }, { status: 503 }); }
}
