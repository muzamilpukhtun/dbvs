// app/api/users/signup/route.js
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { arid, name, password } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { arid: arid },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: 'ARID already exists' }), { status: 409 });
    }

    const user = await prisma.user.create({
      data: { arid, name, password },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('User creation failed:', error);
    return new Response(JSON.stringify({
      message: 'User creation failed',
      error: error.message
    }), { status: 500 });
  }
}
