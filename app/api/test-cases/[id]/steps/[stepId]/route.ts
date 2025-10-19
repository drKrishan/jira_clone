import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { auth } from "@clerk/nextjs";

// Update a step
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; stepId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { summary, preCondition, testData, expectedResult } = body;

    const step = await prisma.testStep.update({
      where: { id: params.stepId },
      data: {
        summary: summary,
        preCondition: preCondition || "",
        testData: testData || "",
        expectedResult: expectedResult,
      },
    });

    return NextResponse.json(step);
  } catch (error) {
    console.error("Error updating step:", error);
    return NextResponse.json(
      { error: "Failed to update step" },
      { status: 500 }
    );
  }
}

// Delete a step
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; stepId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.testStep.delete({
      where: { id: params.stepId },
    });

    // Reorder remaining steps
    const remainingSteps = await prisma.testStep.findMany({
      where: { testCaseId: params.id },
      orderBy: { stepNumber: "asc" },
    });

    // Update step numbers to be sequential
    for (let i = 0; i < remainingSteps.length; i++) {
      await prisma.testStep.update({
        where: { id: remainingSteps[i].id },
        data: { stepNumber: i + 1 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting step:", error);
    return NextResponse.json(
      { error: "Failed to delete step" },
      { status: 500 }
    );
  }
}
