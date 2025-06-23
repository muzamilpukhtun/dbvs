// app/api/poll/mine/route.js
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userId } = await request.json(); // could be arid, email, or uid

    const polls = await prisma.poll.findMany({
      where: {
        createdBy: 4302,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        options: true,
      },
    });

    return new Response(JSON.stringify({ polls }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed to fetch user polls" }), {
      status: 500,
    });
  }
}
