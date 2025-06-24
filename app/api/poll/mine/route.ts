import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body);
  
    const { userId } = body;
    console.log("userId received:", userId);
  
    if (!userId || (typeof userId !== "string" && typeof userId !== "number")) {
      return NextResponse.json({ error: "Valid userId (arid) required" }, { status: 400 });
    }
  
    const polls = await prisma.poll.findMany({
      where: {
        createdBy: String(userId),
      },
      include: {
        options: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  
    return NextResponse.json({ polls });
  
  } catch (error: any) {
    console.error("Error in /poll/mine:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  
}
