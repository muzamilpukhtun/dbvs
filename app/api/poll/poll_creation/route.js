import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { pollName, endDate, options, createdBy } = await request.json();

    // Basic validation
    if (!pollName || !endDate || !options || !createdBy) {
      return new Response(JSON.stringify({ message: "Invalid poll data" }), {
        status: 400,
      });
    }
    console.log(pollName,endDate,options,createdBy)

    const poll = await prisma.poll.create({
      data: {
        name: pollName,
        endDate: new Date(endDate),
        createdBy, // ✅ this line is critical
        options: {
          create: options.map((option) => ({
            text: option,
            votes: 0,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return new Response(JSON.stringify({ poll }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Poll creation failed:", error);
    return new Response(
      JSON.stringify({
        message: "Poll creation failed",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
