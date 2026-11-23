
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() || '';

  if (q.length < 2) {
    return NextResponse.json({
      data: { models: [], companies: [], providers: [] },
    });
  }

  try {
    const [models, companies, providers] = await Promise.all([
      prisma.aIModel.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { family: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          modelType: true,
          company: {
            select: { name: true },
          },
        },
        take: 5,
        orderBy: { name: 'asc' },
      }),

      prisma.company.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 5,
        orderBy: { name: 'asc' },
      }),

      prisma.provider.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 5,
        orderBy: { name: 'asc' },
      }),
    ]);

    return NextResponse.json({
      data: { models, companies, providers },
    });
  } catch (error) {
    console.error('Global search error:', error);

    return NextResponse.json(
      { error: 'Unable to perform search' },
      { status: 503 }
    );
  }
}
