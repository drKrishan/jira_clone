import { prisma } from "../server/db";

/**
 * Script to update all test folders to have the correct creatorId
 * Run this with: npx tsx scripts/fix-folder-owners.ts YOUR_USER_ID
 */

async function fixFolderOwners() {
  const newUserId = process.argv[2];

  if (!newUserId) {
    console.error("Please provide a userId as an argument");
    console.log("Usage: npx tsx scripts/fix-folder-owners.ts YOUR_USER_ID");
    console.log("\nTo get your userId:");
    console.log("1. Open your app in the browser");
    console.log("2. Open DevTools console");
    console.log("3. Check the DELETE folder logs for 'userId: ...'");
    process.exit(1);
  }

  try {
    console.log(`Updating all folders to userId: ${newUserId}`);

    const result = await prisma.testFolder.updateMany({
      data: {
        creatorId: newUserId,
      },
    });

    console.log(`✅ Successfully updated ${result.count} folders`);

    // Show all folders
    const folders = await prisma.testFolder.findMany({
      select: {
        id: true,
        name: true,
        creatorId: true,
      },
    });

    console.log("\nAll folders:");
    folders.forEach((folder) => {
      console.log(`  - ${folder.name} (creatorId: ${folder.creatorId})`);
    });
  } catch (error) {
    console.error("Error updating folders:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixFolderOwners();
