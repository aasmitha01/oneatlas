import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
const querySchema = z.object({ q: z.string().optional(), company: z.string().optional(), type: z.string().optional(), capability: z.string().optional(), sort: z.enum(['name','context','price','release']).optional().default('name'), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(50).default(20) });
export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.flatten() }, { status: 400 });
  const { q, company, type, capability, sort, page, limit } = parsed.data;
  const where = { AND: [q ? { OR: [{ name: { contains: q, mode: 'insensitive' as const } }, { description: { contains: q, mode: 'insensitive' as const } }, { family: { contains: q, mode: 'insensitive' as const } }] } : {}, company ? { company: { slug: company } } : {}, type ? { modelType: type } : {}, capability ? { capabilities: { has: capability } } : {}] };
  try {
    const orderBy = sort === 'context' ? { contextWindow: 'desc' as const } : sort === 'release' ? { releaseDate: 'desc' as const } : { name: 'asc' as const };
    const [items, total] = await Promise.all([
      prisma.aIModel.findMany({ where, include: { company: true, providers: { include: { provider: true, pricing: true } }, benchmarks: true }, orderBy, skip: (page - 1) * limit, take: limit }),
      prisma.aIModel.count({ where })
    ]);
    const serialized = items.map(m => ({ ...m, providers: m.providers.map(p => ({ ...p, pricing: p.pricing.map(x => ({ ...x, inputPricePerMillion: Number(x.inputPricePerMillion), outputPricePerMillion: Number(x.outputPricePerMillion) })) })) }));
    return NextResponse.json({ data: serialized, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Unable to retrieve models. Check DATABASE_URL and run migrations/seeding.' }, { status: 503 }); }
}
