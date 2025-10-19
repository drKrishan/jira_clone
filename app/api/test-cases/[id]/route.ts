import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { summary, priority, type, reviewStatus, progress, labels } = body;

    // Get current test case to increment version
    const currentTestCase = await prisma.testCase.findUnique({
      where: { id },
    });

    if (!currentTestCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    const testCase = await prisma.testCase.update({
      where: { id },
      data: {
        summary: summary || currentTestCase.summary,
        priority: priority || currentTestCase.priority,
        type: type || currentTestCase.type,
        reviewStatus: reviewStatus || currentTestCase.reviewStatus,
        progress: progress || currentTestCase.progress,
        labels: labels !== undefined ? labels : currentTestCase.labels,
        version: currentTestCase.version + 1, // Auto-increment version
      },
      include: {
        steps: {
          orderBy: {
            stepNumber: "asc",
          },
        },
        folder: true,
      },
    });

    return NextResponse.json(testCase);
  } catch (error) {
    console.error("Error updating test case:", error);
    return NextResponse.json(
      { error: "Failed to update test case" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const testCase = await prisma.testCase.findUnique({
      where: { id },
      include: { folder: true },
    });

    if (!testCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    // Delete test case (steps will be cascaded)
    await prisma.testCase.delete({
      where: { id },
    });

    // Update folder count
    await prisma.testFolder.update({
      where: { id: testCase.folderId },
      data: {
        count: { decrement: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting test case:", error);
    return NextResponse.json(
      { error: "Failed to delete test case" },
      { status: 500 }
    );
  }
}
