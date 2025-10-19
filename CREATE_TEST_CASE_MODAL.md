# Create Test Case Modal Implementation

## Overview

Added a modal dialog to create new test cases directly from the Test Case Management interface. The modal appears when clicking the "New" button and allows users to create a test case in the selected folder.

## Implementation Date

October 19, 2025

## Components Created

### 1. CreateTestCaseModal Component

**File:** `components/modals/create-test-case/index.tsx`

Main modal component that wraps the form and handles modal state.

**Props:**

- `children: ReactNode` - Trigger element (the "New" button)
- `folderId: string` - ID of the folder where test case will be created
- `folderName: string` - Name of the folder (for display)
- `onTestCaseCreated: () => void` - Callback after successful creation

**Features:**

- Uses the project's existing modal components (Modal, ModalContent, etc.)
- Manages open/close state internally
- Displays folder context to user

### 2. CreateTestCaseForm Component

**File:** `components/modals/create-test-case/form.tsx`

Form component that handles test case creation logic.

**Props:**

- `folderId: string` - Folder ID for the new test case
- `folderName: string` - Folder name for display
- `setModalIsOpen: (isOpen: boolean) => void` - Function to close modal
- `onTestCaseCreated: () => void` - Callback to refresh test case list

**Form Fields:**

1. **Summary\*** (required)

   - Text input
   - Main description of the test case
   - Auto-focused on modal open

2. **Priority** (dropdown)

   - Options: Critical, High, Medium (default), Normal, Low
   - Default: MEDIUM

3. **Type** (dropdown)

   - Options: Functional (default), Non-Functional, Performance
   - Default: FUNCTIONAL

4. **Review Status** (dropdown)

   - Options: New (default), Approved, Rejected
   - Default: NEW

5. **Progress** (dropdown)

   - Options: To Do (default), In Progress, Done, Cancelled
   - Default: TODO

6. **Labels** (text input)
   - Comma-separated labels
   - Optional field
   - Example: "login, auth, critical"

**Validation:**

- Summary is required (cannot be empty or whitespace-only)
- Labels are parsed and trimmed automatically
- Empty labels are filtered out

**API Integration:**

- Calls `POST /api/test-cases` with form data
- Includes folderId to associate test case with folder
- Returns generated test case key (e.g., FIT-TC-14)

**User Feedback:**

- Shows folder name in blue info box
- Success toast with generated test case key
- Error toast for failures
- Button shows "Creating..." during submission
- Submit button disabled while submitting or if summary is empty

## Integration with Test Cases Component

### Changes to `components/test-cases/index.tsx`

#### 1. Import Statement

```tsx
import { CreateTestCaseModal } from "@/components/modals/create-test-case";
```

#### 2. Modal Wrapper Around "New" Button

The "New" button is now wrapped with the `CreateTestCaseModal`:

```tsx
<CreateTestCaseModal
  folderId={selectedFolder === "all" ? folders[0]?.id || "" : selectedFolder}
  folderName={
    selectedFolder === "all"
      ? folders[0]?.name || "Default Folder"
      : folders.find((f) => f.id === selectedFolder)?.name || "Folder"
  }
  onTestCaseCreated={() => {
    fetchTestCases(selectedFolder === "all" ? undefined : selectedFolder);
  }}
>
  <Button
    customColors
    className="flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
    disabled={selectedFolder === "all" && folders.length === 0}
  >
    <MdAdd className="text-lg" />
    <span>New</span>
  </Button>
</CreateTestCaseModal>
```

#### 3. Folder Selection Logic

- **When "All Test Cases" is selected:** Uses the first available folder as default
- **When specific folder is selected:** Uses that folder's ID and name
- **Button disabled:** When "All Test Cases" is selected and no folders exist

#### 4. Refresh After Creation

After successful creation, the modal triggers `fetchTestCases()` to refresh the list with the new test case.

## User Flow

### Step 1: Select a Folder

User clicks on a folder in the left sidebar (or "All Test Cases").

### Step 2: Click "New" Button

User clicks the blue "New" button in the top toolbar.

### Step 3: Modal Opens

A modal dialog appears with the title "Create New Test Case" and shows:

- Which folder the test case will be created in (blue info box)
- Empty form with default values

### Step 4: Fill Form

User fills in:

- **Required:** Summary (test case description)
- **Optional:** Adjust priority, type, review status, progress, labels

### Step 5: Submit

User clicks "Create Test Case" button:

- Form validates (summary required)
- API call creates test case
- Success toast shows with generated key
- Modal closes automatically
- Test case list refreshes

### Step 6: Cancel

User can click "Cancel" or close modal (X button) to dismiss without creating.

## API Endpoint Used

### POST /api/test-cases

**Request Body:**

```json
{
  "summary": "Test case description",
  "priority": "MEDIUM",
  "type": "FUNCTIONAL",
  "reviewStatus": "NEW",
  "progress": "TODO",
  "labels": ["label1", "label2"],
  "folderId": "folder-id"
}
```

**Response:**

```json
{
  "id": "...",
  "key": "FIT-TC-14",
  "summary": "...",
  "version": 1,
  "priority": "MEDIUM",
  "type": "FUNCTIONAL",
  "reviewStatus": "NEW",
  "progress": "TODO",
  "labels": ["label1", "label2"],
  "folderId": "folder-id",
  "creatorId": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## UI/UX Features

### Visual Design

- **Modal Size:** Large (max-w-2xl) to accommodate all fields comfortably
- **Grid Layout:** 2-column grid for dropdowns (Priority/Type, Review Status/Progress)
- **Color Coding:** Blue info box highlights target folder
- **Consistent Styling:** Matches existing project design system

### Accessibility

- **Auto-focus:** Summary field automatically focused on modal open
- **Required Indicators:** Red asterisk (\*) on required fields
- **Helper Text:** Guidance text under labels field
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Esc)

### Error Handling

- **Client Validation:** Summary required check before API call
- **API Error Display:** Server errors shown in toast notification
- **Network Issues:** Handled with try-catch and user-friendly messages
- **Loading States:** Button disabled and shows "Creating..." text

### User Feedback

- **Success Message:** "Test case FIT-TC-14 created successfully!"
- **Error Message:** Specific error from server or generic failure message
- **Visual Feedback:** Button changes text during submission
- **Automatic Close:** Modal closes on success
- **List Refresh:** Newly created test case appears immediately

## Testing Checklist

✅ Modal opens when clicking "New" button
✅ Modal shows correct folder name
✅ Form fields have proper default values
✅ Summary validation works (required field)
✅ Labels are parsed correctly (comma-separated)
✅ API call includes folderId
✅ Success toast shows with generated key
✅ Modal closes after successful creation
✅ Test case list refreshes automatically
✅ Cancel button closes modal without creating
✅ Error handling displays appropriate messages
✅ Button disabled when "All Test Cases" selected and no folders exist
✅ Form is responsive and visually consistent

## Edge Cases Handled

### 1. No Folders Exist

- "New" button is disabled when "All Test Cases" is selected and folders array is empty
- Prevents creating orphaned test cases

### 2. "All Test Cases" Selected

- Uses first available folder as default target
- Shows that folder's name in the form
- Falls back to "Default Folder" text if no folders

### 3. Empty Labels

- Empty string labels are filtered out
- Whitespace-only labels are trimmed and removed
- Only valid labels are sent to API

### 4. Network Failures

- Try-catch wraps API call
- User sees error toast with details
- Modal stays open to allow retry

### 5. Long Summary Text

- Text input allows long descriptions
- No artificial character limit
- Database stores as TEXT type

## Future Enhancements

Potential improvements for the create test case feature:

1. **Add Steps Inline**

   - Allow adding test steps during creation
   - Multi-step form or expandable section

2. **Template Selection**

   - Pre-fill form with common test case templates
   - Save custom templates for reuse

3. **Bulk Creation**

   - Create multiple test cases at once
   - Import from CSV/Excel

4. **Rich Text Editor**

   - Format test case description
   - Add images, tables, links

5. **Quick Actions**

   - "Save and Add Another" button
   - "Save and Add Steps" button

6. **Duplicate Test Case**

   - Create from existing test case
   - Copy steps, labels, settings

7. **Auto-generation**

   - AI-powered test case generation
   - Integrate with "Generate Test Cases" button

8. **Folder Creation**

   - Create new folder from modal
   - Useful when desired folder doesn't exist

9. **Field Validation**

   - Custom validation rules
   - Required fields configuration

10. **Keyboard Shortcuts**
    - Ctrl+N to open modal
    - Ctrl+Enter to submit form

## Related Files

### New Files Created

1. `components/modals/create-test-case/index.tsx` - Modal wrapper component
2. `components/modals/create-test-case/form.tsx` - Form component with logic

### Modified Files

1. `components/test-cases/index.tsx` - Added modal integration and import

### Dependent Files

- `components/ui/modal.tsx` - Existing modal primitives
- `components/toast.tsx` - Toast notification system
- `app/api/test-cases/route.ts` - API endpoint for creating test cases
- `prisma/schema.prisma` - TestCase model definition

## Notes

- **Version Field:** Automatically set to 1 by backend for new test cases
- **Test Case Key:** Auto-generated by backend (e.g., FIT-TC-14)
- **Creator ID:** Automatically set from authenticated user session
- **Timestamps:** CreatedAt and updatedAt set automatically
- **Test Steps:** Can be added after test case creation by expanding the row
- **Folder Association:** Test case is immediately visible in selected folder
- **Folder Count:** Backend updates folder count when test case is created

## Dependencies

The implementation relies on:

- React 18+ with hooks (useState)
- Next.js App Router
- Radix UI Modal components
- React Icons (MdClose)
- Custom toast component
- Clerk authentication (for creatorId)
- Prisma ORM for database operations
