// poll/public-ended
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      where: {
        endDate: { lte: new Date() },
        isResultAnnounced: true,
      },
      include: { options: true },
    orderBy: {
    createdAt: 'desc',  // Latest poll sabse pehle
  },
      take: 10, 
    });

    return Response.json({ polls });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}