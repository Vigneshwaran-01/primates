// import type { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(req.url); // Use req.url directly
        const q = searchParams.get('q');

        if (!q || typeof q !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid query parameter "q"' }, { status: 400 });
        }

        const suggestions = await prisma.product.findMany({
            where: {
                name: {
                    contains: q,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                name: true,
            },
            take: 5,
        });

        return NextResponse.json(suggestions);
    } catch (error) {
        console.error("Error fetching product suggestions:", error);
        return NextResponse.json({ error: 'Failed to fetch product suggestions' }, { status: 500 });
    }
}