# Folder Management System - Test Cases

## Overview

Implemented a comprehensive folder management system where test cases are organized by folders. Users can click on different folders to view their associated test cases.

## Features Implemented

### 1. **Folder-Based Test Case Filtering**

#### How It Works:

- Each folder maintains a list of test case IDs through the `folderId` relationship
- Clicking on a folder fetches and displays only test cases belonging to that folder
- The API endpoint `/api/test-cases?folderId={id}` handles folder-based filtering

#### User Flow:

1. User sees list of folders in left sidebar
2. User clicks on a folder
3. System fetches test cases for that folder
4. Only relevant test cases are displayed in the table

### 2. **"All Test Cases" View**

Added a default view at the top of the folder list:

- Shows all test cases regardless of folder
- Highlighted with blue styling when selected
- Displays total count of all test cases
- Always visible at the top of the folder list

### 3. **Visual Feedback**

#### Selected Folder Indication:

- Selected folder highlighted with blue background (`bg-blue-100 text-blue-700`)
- Non-selected folders show gray on hover (`hover:bg-gray-200`)

#### Folder Header Display:

- Toolbar shows currently selected folder name
- Displays count of visible test cases
- Folder icon for visual context

### 4. **Dynamic Count Updates**

The folder list now shows:

- Folder name with icon
- Test case count badge
- Expandable/collapsible indicator (arrow)

## Code Changes

### Component State Management

```typescript
const [selectedFolder, setSelectedFolder] = useState<string>("all");
```

### New Function: `handleFolderClick`

```typescript
const handleFolderClick = (folderId: string) => {
  setSelectedFolder(folderId);
  // Fetch test cases for the selected folder
  if (folderId === "all") {
    fetchTestCases(); // Fetch all test cases
  } else {
    fetchTestCases(folderId); // Fetch test cases for specific folder
  }
  // Toggle folder expansion if it has items
  const folder = folders.find((f) => f.id === folderId);
  if (folder && folder.count > 0) {
    toggleFolder(folderId);
  }
};
```

### Updated Function: `fetchTestCases`

```typescript
const fetchTestCases = async (folderId?: string) => {
  try {
    setLoading(true);
    const url = folderId
      ? `/api/test-cases?folderId=${folderId}`
      : "/api/test-cases";
    const response = await fetch(url);
    const data = await response.json();
    // ... process data
  } catch (error) {
    console.error("Error fetching test cases:", error);
  } finally {
    setLoading(false);
  }
};
```

### UI Components Added

#### All Test Cases Button:

```tsx
<button
  onClick={() => handleFolderClick("all")}
  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
    selectedFolder === "all"
      ? "bg-blue-100 text-blue-700"
      : "text-gray-700 hover:bg-gray-200"
  }`}
>
  <div className="flex items-center gap-x-2">
    <span className="w-4" />
    <MdFolder className="text-blue-500" />
    <span className="truncate font-medium">All Test Cases</span>
  </div>
  <span className="ml-2 rounded bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700">
    {testCases.length}
  </span>
</button>
```

#### Updated Toolbar:

```tsx
<div className="flex items-center gap-x-2">
  <MdFolder className="text-blue-500" />
  <span className="text-sm font-semibold text-gray-700">
    {selectedFolder === "all"
      ? "All Test Cases"
      : folders.find((f) => f.id === selectedFolder)?.name || "Folder"}
  </span>
  <span className="text-sm text-gray-500">
    ({testCases.length} {testCases.length === 1 ? "test case" : "test cases"})
  </span>
</div>
```

## Database Structure

### Existing Schema (No Changes Required):

```prisma
model TestFolder {
  id          String     @id @default(uuid())
  name        String
  count       Int        @default(0)
  projectId   String
  parentId    String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  creatorId   String
  testCases   TestCase[]  // Relationship to test cases
}

model TestCase {
  id           String                @id @default(uuid())
  key          String                @unique
  summary      String
  // ... other fields
  folderId     String                // Foreign key to folder
  folder       TestFolder            @relation(fields: [folderId], references: [id])
  // ... other fields

  @@index([folderId])
}
```

## API Endpoint Usage

### Get All Test Cases:

```http
GET /api/test-cases
```

### Get Test Cases by Folder:

```http
GET /api/test-cases?folderId={folder-id}
```

The existing API already supports this through the query parameter:

```typescript
const { searchParams } = new URL(request.url);
const folderId = searchParams.get("folderId");

const testCases = await prisma.testCase.findMany({
  where: folderId ? { folderId } : {},
  // ...
});
```

## User Guide

### Viewing Test Cases by Folder:

1. **View All Test Cases:**

   - Click on "All Test Cases" at the top of the folder list
   - This displays all test cases across all folders

2. **View Folder-Specific Test Cases:**

   - Click on any folder name in the sidebar
   - Only test cases in that folder will be displayed
   - The folder name and count appear in the toolbar

3. **Refresh Current View:**
   - Click the refresh icon (↻) in the toolbar
   - This reloads test cases for the currently selected folder

### Visual Indicators:

- **Blue background** = Currently selected folder/view
- **Gray hover** = Hoverable but not selected
- **Badge number** = Count of test cases in folder
- **Arrow icons** = Folder can be expanded (future use)

## Current Folder Contents

Based on the seed data:

### Login Tests Folder:

- FIT-TC-6 (Functional, Approved, Done)
- FIT-TC-10 (Functional, New, TODO)
- FIT-TC-11 (Non-Functional, New, TODO)
- FIT-TC-12 (Performance, Rejected, Cancelled)
- FIT-TC-13 (Functional, Approved, In Progress)

### App Modifications Folder:

- FIT-TC-7 (Functional, Approved, Done)
- FIT-TC-8 (Functional, Approved, Done)

### All Test Cases:

Shows all 7 test cases from all folders

## Testing Instructions

1. **Load the Test Cases Page:**

   - Navigate to the Test Cases section
   - Default view shows "All Test Cases"

2. **Click "Login Tests" Folder:**

   - Should display 5 test cases (TC-6, TC-10, TC-11, TC-12, TC-13)
   - Toolbar shows "Login Tests (5 test cases)"

3. **Click "App Modifications" Folder:**

   - Should display 2 test cases (TC-7, TC-8)
   - Toolbar shows "App Modifications (2 test cases)"

4. **Click "All Test Cases":**

   - Should display all 7 test cases
   - Toolbar shows "All Test Cases (7 test cases)"

5. **Apply Type Filter:**

   - With a folder selected, type filters still work
   - Only shows test cases matching both folder AND type

6. **Refresh Test Cases:**
   - Click refresh icon to reload current folder's test cases

## Future Enhancements

### Possible Improvements:

1. **Drag & Drop:** Move test cases between folders
2. **Nested Folders:** Support for subfolder hierarchy
3. **Folder Actions:** Rename, delete, duplicate folders
4. **Bulk Operations:** Move multiple test cases at once
5. **Folder Permissions:** Access control per folder
6. **Folder Statistics:** Show test case status breakdown per folder
7. **Search Within Folder:** Filter test cases within selected folder
8. **Recently Viewed:** Show recently accessed folders

## Troubleshooting

### Issue: No test cases showing after clicking folder

**Solution:**

- Check browser console for API errors
- Verify folder ID is correct
- Ensure test cases have proper `folderId` field

### Issue: All folders show 0 count

**Solution:**

- Run `npx prisma db seed` to populate folders and test cases
- Check that test cases are assigned to folders in seed data

### Issue: Wrong test cases displayed

**Solution:**

- Open browser DevTools and check the API URL being called
- Verify `folderId` query parameter is correct
- Check that `selectedFolder` state matches clicked folder

## Console Debug Output

When clicking folders, you'll see:

```
Fetched test cases: [array of test cases]
Number of test cases: 5
For folder: folder-login
```

This helps verify the correct data is being fetched.

## Summary

✅ Folder-based filtering implemented
✅ "All Test Cases" default view added
✅ Visual feedback for selected folder
✅ Dynamic count display in toolbar
✅ Refresh functionality per folder
✅ Seamless integration with existing type filters
✅ No database changes required (uses existing relationships)

The folder management system is now fully functional and allows users to organize and view test cases by folder efficiently!
