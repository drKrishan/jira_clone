import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { auth } from "@clerk/nextjs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    const { userId } = auth();
    console.log("DELETE folder - userId:", userId);

    if (!userId) {
      console.log("DELETE folder - Unauthorized: no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId } = await params;
    console.log("DELETE folder - folderId:", folderId);

    // Check if folder exists
    const folder = await prisma.testFolder.findUnique({
      where: { id: folderId },
      include: {
        _count: {
          select: {
            testCases: true,
          },
        },
      },
    });

    console.log("DELETE folder - found folder:", folder);

    if (!folder) {
      console.log("DELETE folder - Folder not found");
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Check if user owns the folder (commented out for development)
    // if (folder.creatorId !== userId) {
    //   console.log("DELETE folder - Forbidden: creatorId mismatch", folder.creatorId, userId);
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    // Check if folder has test cases
    if (folder._count.testCases > 0) {
      console.log("DELETE folder - Has test cases:", folder._count.testCases);
      return NextResponse.json(
        {
          error: "Cannot delete folder with test cases",
          message:
            "Please move or delete all test cases before deleting the folder.",
        },
        { status: 400 }
      );
    }

    // Delete the folder
    console.log("DELETE folder - Deleting folder:", folderId);
    await prisma.testFolder.delete({
      where: { id: folderId },
    });

    console.log("DELETE folder - Successfully deleted");
    return NextResponse.json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderId } = await params;
    const body = await request.json();
    const { name } = body;

    // Check if folder exists and user owns it
    const folder = await prisma.testFolder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Check if user owns the folder (commented out for development)
    // if (folder.creatorId !== userId) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    // Update the folder
    const updatedFolder = await prisma.testFolder.update({
      where: { id: folderId },
      data: { name },
    });

    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.error("Error updating folder:", error);
    return NextResponse.json(
      { error: "Failed to update folder" },
      { status: 500 }
    );
  }
}
