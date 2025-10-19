import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    const folders = await prisma.testFolder.findMany({
      include: {
        _count: {
          select: {
            testCases: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Map folders to include actual test case count
    const foldersWithActualCount = folders.map((folder: any) => ({
      ...folder,
      count: folder._count.testCases, // Use actual count from database
    }));

    return NextResponse.json(foldersWithActualCount);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, projectId } = body;

    const folder = await prisma.testFolder.create({
      data: {
        name,
        projectId: projectId || "project-1",
        creatorId: userId,
        count: 0,
      },
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
}
