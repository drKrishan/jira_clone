const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedTestCases() {
  console.log("Seeding test cases...");

  // Create test folders
  const appModFolder = await prisma.testFolder.upsert({
    where: { id: "folder-app-mod" },
    update: {},
    create: {
      id: "folder-app-mod",
      name: "App Modifications",
      count: 2,
      projectId: "project-1",
      creatorId: "user_2cmLPc7fWPh0ZfAVcdV9PFLvXBi",
    },
  });

  const loginTestsFolder = await prisma.testFolder.upsert({
    where: { id: "folder-login" },
    update: {},
    create: {
      id: "folder-login",
      name: "Login Tests",
      count: 5,
      projectId: "project-1",
      creatorId: "user_2cmLPc7fWPh0ZfAVcdV9PFLvXBi",
    },
  });

  // Create test case 1 - Login Test
  const testCase1 = await prisma.testCase.upsert({
    where: { key: "FIT-TC-6" },
    update: {},
    create: {
      key: "FIT-TC-6",
      summary: "Successful User Login and Bulk import of Parameters",
      version: 5,
      priority: "HIGH",
      type: "FUNCTIONAL",
      reviewStatus: "APPROVED",
      progress: "DONE",
      labels: ["authentication", "login", "critical"],
      folderId: loginTestsFolder.id,
      creatorId: "user_2cmLPc7fWPh0ZfAVcdV9PFLvXBi",
    },
  });

  // Create steps for test case 1
  await prisma.testStep.createMany({
    data: [
      {
        stepNumber: 1,
        summary:
          "Verify that the login form is displayed correctly and all fields are accessible under normal network conditions.",
        preCondition: "User is on the login page and not logged in",
        testData: "",
        expectedResult:
          "The login form is displayed successfully, and all fields are accessible without any issues.",
        testCaseId: testCase1.id,
      },
      {
        stepNumber: 2,
        summary:
          "Enter invalid input (e.g., blank fields or incorrect passwords) and submit the form under normal network conditions.",
        preCondition: "Login form is displayed",
        testData: "Username: blank, Password: blank",
        expectedResult:
          "The system displays an error message indicating that the provided credentials are invalid.",
        testCaseId: testCase1.id,
      },
      {
        stepNumber: 3,
        summary:
          "Simulate slow network connections by adding delays or reducing bandwidth and attempt to log in.",
        preCondition: "Network throttling tools are available",
        testData: "Network delay: 3000ms",
        expectedResult:
          "The system responds appropriately based on the network conditions, either displaying a loading animation or timing out.",
        testCaseId: testCase1.id,
      },
      {
        stepNumber: 4,
        summary:
          "Attempt to log in while the system is offline (no internet connection).",
        preCondition: "Network can be disconnected",
        testData: "Network: Offline",
        expectedResult:
          "The system displays an error message indicating that the system cannot connect to the server.",
        testCaseId: testCase1.id,
      },
      {
        stepNumber: 5,
        summary:
          "Verify that the password is stored securely using hashing under normal network conditions.",
        preCondition: "Database access is available for verification",
        testData: "Password: TestPass123!",
        expectedResult:
          "The password is hashed and stored securely in the database.",
        testCaseId: testCase1.id,
      },
      {
        stepNumber: 6,
        summary:
          "Test for password recovery and account creation functionality, but these features are outside the scope of this test case.",
        preCondition: "User is on the login page",
        testData: "",
        expectedResult:
          "The system does not allow password recovery or account creation during the login process.",
        testCaseId: testCase1.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create test case 2
  const testCase2 = await prisma.testCase.upsert({
    where: { key: "FIT-TC-7" },
    update: {},
    create: {
      key: "FIT-TC-7",
      summary: "Oxygen Monitor",
      version: 4,
      priority: "HIGH",
      type: "FUNCTIONAL",
      reviewStatus: "APPROVED",
      progress: "DONE",
      labels: ["monitoring", "sensors"],
      folderId: appModFolder.id,
      creatorId: "user_2cmLPc7fWPh0ZfAVcdV9PFLvXBi",
    },
  });

  await prisma.testStep.createMany({
    data: [
      {
        stepNumber: 1,
        summary: "Connect the oxygen sensor to the device",
        preCondition: "Device is powered on and sensor port is accessible",
        testData: "Sensor Model: OX-200",
        expectedResult: "Sensor is recognized by the system",
        testCaseId: testCase2.id,
      },
      {
        stepNumber: 2,
        summary: "Start oxygen monitoring",
        preCondition: "Sensor is connected and recognized",
        testData: "",
        expectedResult: "Real-time oxygen levels are displayed",
        testCaseId: testCase2.id,
      },
      {
        stepNumber: 3,
        summary:
          "Verify alarm triggers when oxygen level falls below threshold",
        preCondition: "Monitoring is active and threshold is configured",
        testData: "Threshold: 90%",
        expectedResult: "Alarm is triggered and notification is sent",
        testCaseId: testCase2.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create test case 3
  const testCase3 = await prisma.testCase.upsert({
    where: { key: "FIT-TC-8" },
    update: {},
    create: {
      key: "FIT-TC-8",
      summary: "Set device to Run mode",
      version: 2,
      priority: "MEDIUM",
      type: "FUNCTIONAL",
      reviewStatus: "APPROVED",
      progress: "DONE",
      labels: ["device-config", "modes"],
      folderId: appModFolder.id,
      creatorId: "user_2cmLPc7fWPh0ZfAVcdV9PFLvXBi",
    },
  });

  await prisma.testStep.createMany({
    data: [
      {
        stepNumber: 1,
        summary: "Navigate to device settings",
        preCondition: "User is logged in and device is accessible",
        testData: "",
        expectedResult: "Settings page is displayed",
        testCaseId: testCase3.id,
      },
      {
        stepNumber: 2,
        summary: "Select Run mode from available options",
        preCondition: "Settings page is displayed and Run mode is available",
        testData: "Mode: Run",
        expectedResult: "Device switches to Run mode successfully",
        testCaseId: testCase3.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create test case 4
  await prisma.testCase.upsert({
    where: { key: "FIT-TC-10" },
    update: {},
    create: {
      key: "FIT-TC-10",
      summary: "Login to journal subscription portal",
      version: 1,
      priority: "MEDIUM",
      type: "FUNCTIONAL",
      reviewStatus: "NEW",
      progress: "TODO",
      labels: ["portal", "authentication"],
      folderId: loginTestsFolder.id,
      creatorId: "user_2cmLPc7fWPh0ZfAVcdV9PFLvXBi",
    },
  });

  // Create test case 5
  await prisma.testCase.upsert({
    where: { key: "FIT-TC-11" },
    update: {},
    create: {
      key: "FIT-TC-11",
      summary: "Login to fitness tracker portal",
      version: 1,
      priority: "MEDIUM",
      type: "NON_FUNCTIONAL",
      reviewStatus: "NEW",
      progress: "TODO",
      labels: ["fitness", "portal"],
      folderId: loginTestsFolder.id,
      creatorId: "user_2cmLPc7fWPh0ZfAVcdV9PFLvXBi",
    },
  });

  // Create test case 6
  await prisma.testCase.upsert({
    where: { key: "FIT-TC-12" },
    update: {},
    create: {
      key: "FIT-TC-12",
      summary: "Login to gym payment portal",
      version: 1,
      priority: "LOW",
      type: "PERFORMANCE",
      reviewStatus: "REJECTED",
      progress: "CANCELLED",
      labels: ["payment", "gym"],
      folderId: loginTestsFolder.id,
      creatorId: "user_2cmLPc7fWPh0ZfAVcdV9PFLvXBi",
    },
  });

  // Create test case 7
  await prisma.testCase.upsert({
    where: { key: "FIT-TC-13" },
    update: {},
    create: {
      key: "FIT-TC-13",
      summary:
        "Successful User Login and Bulk import of Parameters with Values",
      version: 3,
      priority: "CRITICAL",
      type: "FUNCTIONAL",
      reviewStatus: "APPROVED",
      progress: "IN_PROGRESS",
      labels: ["bulk-import", "critical-path"],
      folderId: loginTestsFolder.id,
      creatorId: "user_2cmLPc7fWPh0ZfAVcdV9PFLvXBi",
    },
  });

  console.log("✅ Test cases seeded successfully!");
}

// Export for use in main seed script
module.exports = { seedTestCases };

// Allow running this file standalone
if (require.main === module) {
  seedTestCases()
    .catch((e) => {
      console.error("Error seeding test cases:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
