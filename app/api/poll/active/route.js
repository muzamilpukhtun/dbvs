// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// export async function GET() {
//   const allPolls = await prisma.poll.findMany({
//     include: {
//       options: true
//     }
//   });

//   return NextResponse.json({ polls: allPolls });
// }

// app/poll/active
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const today = new Date();

  const activePolls = await prisma.poll.findMany({
    where: {
      endDate: {
        gte: today  // Greater than or equal to today's date
      }
    },
    include: {
      options: true
    }
  });

  return NextResponse.json({ polls: activePolls });
}
