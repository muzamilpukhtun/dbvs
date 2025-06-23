import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const aridParam = searchParams.get('arid');

    if (!aridParam) {
      return new Response(JSON.stringify({ message: 'ARID is required' }), { status: 400 });
    }

    const arid = parseInt(aridParam);

    if (isNaN(arid)) {
      return new Response(JSON.stringify({ message: 'ARID must be a valid number' }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { arid },
      select: {
        id: true,
        arid: true,
        name: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch profile', error: error.message }), { status: 500 });
  }
}
