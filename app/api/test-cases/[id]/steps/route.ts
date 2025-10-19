import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { auth } from "@clerk/nextjs";

// Get all steps for a test case
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const steps = await prisma.testStep.findMany({
      where: { testCaseId: params.id },
      orderBy: { stepNumber: "asc" },
    });

    return NextResponse.json(steps);
  } catch (error) {
    console.error("Error fetching steps:", error);
    return NextResponse.json(
      { error: "Failed to fetch steps" },
      { status: 500 }
    );
  }
}

// Create a new step
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Creating step for test case:", params.id);

    const body = await request.json();
    const { summary, preCondition, testData, expectedResult } = body;

    console.log("Step data:", {
      summary,
      preCondition,
      testData,
      expectedResult,
    });

    if (!summary || !expectedResult) {
      return NextResponse.json(
        { error: "Summary and expected result are required" },
        { status: 400 }
      );
    }

    // Get the last step number
    const lastStep = await prisma.testStep.findFirst({
      where: { testCaseId: params.id },
      orderBy: { stepNumber: "desc" },
    });

    const newStepNumber = lastStep ? lastStep.stepNumber + 1 : 1;
    console.log("New step number:", newStepNumber);

    const step = await prisma.testStep.create({
      data: {
        stepNumber: newStepNumber,
        summary,
        preCondition: preCondition || "",
        testData: testData || "",
        expectedResult,
        testCaseId: params.id,
      },
    });

    console.log("Step created successfully:", step);
    return NextResponse.json(step);
  } catch (error) {
    console.error("Error creating step:", error);
    return NextResponse.json(
      {
        error: "Failed to create step",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
