// app/api/users/login/route.js
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { arid, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { arid: arid },
    });

    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, arid: user.arid },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return new Response(JSON.stringify({
      message: 'Login successful',
      token,
      name: user.name,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Login failed:', error);
    return new Response(JSON.stringify({ message: 'Login failed', error: error.message }), { status: 500 });
  }
}
