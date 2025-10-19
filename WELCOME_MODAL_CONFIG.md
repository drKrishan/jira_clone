# Test Case Welcome Modal Configuration

This document explains how to customize the welcome modal that appears when users first visit the Test Cases page.

## Configuration File

The welcome modal content is configured in `/config/test-case-welcome.json`

## Structure

```json
{
  "title": "Hello, I am QI. Your Test Case Generator.",
  "description": "Message describing QI's purpose...",
  "currentSession": {
    "testCasesCreated": 4,
    "timeSaved": "2 Hours",
    "timeSavedLabel": "Approximate Time Saving"
  },
  "userStats": {
    "testCasesCreated": 14,
    "testCasesUpdated": 0,
    "timeSaved": "7 Hours",
    "timeSavedLabel": "Approximate Time Saving"
  },
  "projectStats": {
    "testCasesCreated": 14,
    "testCasesUpdated": 0,
    "timeSaved": "7 Hours",
    "timeSavedLabel": "Approximate Time Saving",
    "projectName": "QA Test Automation"
  }
}
```

## Customizable Fields

### Title

- **Field**: `title`
- **Usage**: Main heading of the modal
- **Note**: The user's first name from Clerk will be automatically inserted

### Description

- **Field**: `description`
- **Usage**: Introductory text explaining QI's benefits

### Current Session Stats

- **testCasesCreated**: Number of test cases created in current session
- **timeSaved**: Time saved (e.g., "2 Hours", "30 Minutes")
- **timeSavedLabel**: Label for time saved metric

### User Stats

- **testCasesCreated**: Total test cases created by user across all projects
- **testCasesUpdated**: Total test cases updated by user
- **timeSaved**: Total time saved by user
- **timeSavedLabel**: Label for time saved metric

### Project Stats

- **testCasesCreated**: Total test cases created in project
- **testCasesUpdated**: Total test cases updated in project
- **timeSaved**: Total time saved in project
- **timeSavedLabel**: Label for time saved metric
- **projectName**: Name of the current project

## Dynamic Data Integration

Currently, the welcome modal uses static data from the JSON file. To make it dynamic:

1. **User Name**: Already integrated - fetched from Clerk automatically
2. **Project Name**: Can be fetched from project context
3. **Statistics**: Can be calculated from database queries

### Example API Integration

To fetch real-time statistics, you could create an API endpoint:

```typescript
// /api/test-cases/stats/route.ts
export async function GET() {
  const stats = await prisma.testCase.aggregate({
    // Your aggregation logic
  });
  return NextResponse.json(stats);
}
```

## Resetting the Welcome Modal

The modal is shown only once per user (tracked via localStorage key: `testCaseWelcomeShown`).

To show it again:

1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Delete the `testCaseWelcomeShown` key
4. Refresh the page

Or run in console:

```javascript
localStorage.removeItem("testCaseWelcomeShown");
location.reload();
```

## Styling

The modal uses Tailwind CSS with:

- Gradient background (blue-50 to white)
- Responsive design
- Shadow and border effects
- Blue accent colors matching JIRA theme

To customize colors, modify the className properties in `/components/test-cases/index.tsx`
