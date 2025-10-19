import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { auth } from "@clerk/nextjs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId");

    const testCases = await prisma.testCase.findMany({
      where: folderId ? { folderId } : {},
      include: {
        steps: {
          orderBy: {
            stepNumber: "asc",
          },
        },
        folder: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(testCases);
  } catch (error) {
    console.error("Error fetching test cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch test cases" },
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
    const {
      summary,
      priority,
      type,
      reviewStatus,
      progress,
      folderId,
      labels,
      steps,
    } = body;

    // Get the last test case to generate key
    const lastTestCase = await prisma.testCase.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const lastNumber = lastTestCase
      ? parseInt(lastTestCase.key.split("-TC-")[1] || "0")
      : 0;
    const newKey = `FIT-TC-${lastNumber + 1}`;

    const testCase = await prisma.testCase.create({
      data: {
        key: newKey,
        summary,
        priority: priority || "MEDIUM",
        type: type || "FUNCTIONAL",
        reviewStatus: reviewStatus || "NEW",
        progress: progress || "TODO",
        labels: labels || [],
        folderId,
        creatorId: userId,
        steps: steps
          ? {
              create: steps.map((step: any, index: number) => ({
                stepNumber: index + 1,
                summary: step.summary,
                testData: step.testData || "",
                expectedResult: step.expectedResult,
              })),
            }
          : undefined,
      },
      include: {
        steps: true,
        folder: true,
      },
    });

    // Update folder count
    await prisma.testFolder.update({
      where: { id: folderId },
      data: {
        count: { increment: 1 },
      },
    });

    return NextResponse.json(testCase);
  } catch (error) {
    console.error("Error creating test case:", error);
    return NextResponse.json(
      { error: "Failed to create test case" },
      { status: 500 }
    );
  }
}
