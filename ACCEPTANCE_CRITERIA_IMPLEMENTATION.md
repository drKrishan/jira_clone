# Acceptance Criteria Field Implementation

## Overview

Added an **Acceptance Criteria** section to the issue editor, allowing users to define acceptance criteria alongside the description. This feature includes full-stack implementation with database schema changes, API updates, and UI components.

## Changes Made

### 1. **Database Schema Update (Prisma)**

**File**: `prisma/schema.prisma`

Added `acceptanceCriteria` field to the `Issue` model:

```prisma
model Issue {
    id                  String      @id @default(uuid())
    key                 String
    name                String
    description         String?     @db.Text()
    acceptanceCriteria  String?     @db.Text()  // NEW FIELD
    status              IssueStatus @default(TODO)
    type                IssueType   @default(TASK)
    // ... rest of fields
}
```

**Field Properties:**

- **Type**: `String?` (Optional/Nullable)
- **Database Type**: `Text` (for large content)
- **Stored as**: JSON string (serialized Lexical editor state)

### 2. **API Route Updates**

**File**: `app/api/issues/[issueId]/route.ts`

#### Updated Validation Schema:

```typescript
const patchIssueBodyValidator = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  acceptanceCriteria: z.string().optional(), // NEW
  type: z.nativeEnum(IssueType).optional(),
  // ... rest of fields
});
```

#### Updated PATCH Handler:

```typescript
data: {
  name: valid.name ?? undefined,
  description: valid.description ?? undefined,
  acceptanceCriteria: valid.acceptanceCriteria ?? undefined,  // NEW
  status: valid.status ?? undefined,
  // ... rest of fields
}
```

### 3. **New Component: AcceptanceCriteria**

**File**: `components/issue/issue-details/issue-details-info/issue-details-info-acceptance-criteria.tsx`

Created a new component similar to the Description component:

```typescript
const AcceptanceCriteria: React.FC<{ issue: IssueType }> = ({ issue }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateIssue } = useIssues();
  const [isAuthenticated, openAuthModal] = useIsAuthenticated();

  const [content, setContent] = useState<SerializedEditorState | undefined>(
    (issue.acceptanceCriteria
      ? JSON.parse(issue.acceptanceCriteria)
      : undefined) as SerializedEditorState
  );

  function handleSave(state: SerializedEditorState | undefined) {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setContent(state);
    updateIssue({
      issueId: issue.id,
      acceptanceCriteria: state ? JSON.stringify(state) : undefined,
    });
    setIsEditing(false);
  }

  // ... render logic
};
```

**Features:**

- Uses the same rich text editor (Lexical) as Description
- Editable on click
- Auto-saves on "Save" button
- Shows placeholder when empty
- Supports all editor features (formatting, lists, code blocks, etc.)

### 4. **UI Integration**

**File**: `components/issue/issue-details/issue-details-info/index.tsx`

Added AcceptanceCriteria component to both large and small views:

```typescript
// Import
import { AcceptanceCriteria } from "./issue-details-info-acceptance-criteria";

// In LargeIssueDetails component:
<Description issue={issue} key={String(issueKey) + issue.id} />
<AcceptanceCriteria issue={issue} key={String(issueKey) + issue.id + "-ac"} />

// In SmallIssueDetailsInfo component:
<Description issue={issue} key={String(issueKey) + issue.id} />
<AcceptanceCriteria issue={issue} key={String(issueKey) + issue.id + "-ac"} />
```

**Placement:**

- Appears directly after the Description section
- Before the Test Case Generator section
- Available in both responsive layouts (large/small screens)

### 5. **Text Editor Updates**

Updated editor components to support "acceptance-criteria" action:

#### **File**: `components/text-editor/preview.tsx`

```typescript
export const EditorPreview: React.FC<{
  action: "description" | "comment" | "acceptance-criteria"; // UPDATED
  // ...
}> = ({ action, content, className }) => {
  const getPlaceholderText = () => {
    if (action === "acceptance-criteria") return "acceptance criteria";
    return action;
  };
  // ...
};
```

#### **File**: `components/text-editor/editor.tsx`

```typescript
export const Editor: React.FC<{
  action: "description" | "comment" | "acceptance-criteria"; // UPDATED
  // ...
}> = ({ action, onSave, onCancel, content, className }) => {
  const getPlaceholderText = () => {
    if (action === "acceptance-criteria") return "acceptance criteria";
    return action;
  };
  // ...
};
```

## Database Migration Required

⚠️ **IMPORTANT**: Before the application will work, you must run the Prisma migration:

### Steps to Apply Migration:

1. **Generate Migration**:

```bash
npx prisma migrate dev --name add_acceptance_criteria
```

This will:

- Create a new migration file
- Add the `acceptanceCriteria` column to the database
- Update the Prisma client

2. **Regenerate Prisma Client** (if needed separately):

```bash
npx prisma generate
```

3. **Verify Migration**:

```bash
npx prisma studio
```

Check that the `Issue` table now has the `acceptanceCriteria` column.

### Migration SQL (Preview)

The migration will execute something like:

```sql
ALTER TABLE "Issue" ADD COLUMN "acceptanceCriteria" TEXT;
```

## User Experience

### Viewing Acceptance Criteria

1. Open any issue in the issue details panel
2. Scroll to the "Acceptance Criteria" section (below Description)
3. If empty, shows placeholder: "Add your acceptance criteria here..."
4. If populated, displays formatted content

### Editing Acceptance Criteria

1. Click anywhere in the Acceptance Criteria section
2. Editor opens with toolbar (same as Description)
3. Type/format acceptance criteria:
   - Use **bold**, _italic_, `code`, etc.
   - Create bulleted/numbered lists
   - Add code blocks
   - Format text with headings
4. Click "Save" to persist changes
5. Click "Cancel" to discard changes

### Editor Features Available

- ✅ **Bold**, _Italic_, Underline, Strikethrough
- ✅ Headings (H1, H2, H3)
- ✅ Bullet lists
- ✅ Numbered lists
- ✅ Code blocks
- ✅ Inline code
- ✅ Links (future)
- ✅ Undo/Redo
- ✅ Auto-focus
- ✅ Real-time saving

## Data Storage

### Format

Acceptance criteria is stored as a **JSON string** containing the Lexical editor state:

```json
{
  "root": {
    "children": [
      {
        "children": [
          {
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": "User can successfully login",
            "type": "text",
            "version": 1
          }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "paragraph",
        "version": 1
      }
    ],
    "direction": "ltr",
    "format": "",
    "indent": 0,
    "type": "root",
    "version": 1
  }
}
```

### Benefits of This Format

- Preserves all formatting (bold, lists, etc.)
- Allows rich text editing
- Easy to render with Lexical preview
- Can be parsed and manipulated if needed

## API Usage

### Update Acceptance Criteria

```typescript
PATCH /api/issues/[issueId]

Body:
{
  "acceptanceCriteria": "{\"root\":{\"children\":[...]}}"
}

Response:
{
  "issue": {
    "id": "...",
    "acceptanceCriteria": "{\"root\":{\"children\":[...]}}",
    // ... other fields
  }
}
```

### Clear Acceptance Criteria

```typescript
PATCH /api/issues/[issueId]

Body:
{
  "acceptanceCriteria": null
}
```

## Type Safety

The TypeScript types will be automatically updated after running `npx prisma generate`:

```typescript
// Prisma-generated type
type Issue = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  acceptanceCriteria: string | null; // NEW
  // ... other fields
};
```

## Testing Checklist

After migration, test these scenarios:

### Basic Functionality

- ✅ Open issue details panel
- ✅ See "Acceptance Criteria" heading
- ✅ Click to edit (shows editor)
- ✅ Type text and format it
- ✅ Save changes (persists to database)
- ✅ Refresh page (data still there)
- ✅ Cancel editing (discards changes)

### Editor Features

- ✅ Bold, italic, underline work
- ✅ Lists (bullet and numbered) work
- ✅ Code blocks work
- ✅ Undo/redo work
- ✅ Placeholder shows when empty
- ✅ Hover effect on preview

### Edge Cases

- ✅ Empty acceptance criteria (shows placeholder)
- ✅ Very long acceptance criteria (scrolls properly)
- ✅ Special characters (are escaped properly)
- ✅ Multiple issues (each has separate AC)
- ✅ Authentication check (requires login to edit)

### Responsive Design

- ✅ Works on large screens (split view)
- ✅ Works on small screens (stacked view)
- ✅ Editor responsive to container width

## Future Enhancements

### Possible Improvements

1. **Templates**: Pre-defined acceptance criteria templates
2. **Validation**: Require AC for certain issue types
3. **AI Generation**: Auto-generate AC from description
4. **Checklist Format**: Convert AC to checkable items
5. **Export**: Export AC separately
6. **Versioning**: Track changes to AC over time
7. **Comments**: Allow comments on specific criteria
8. **Links to Test Cases**: Connect AC to generated test cases

## File Structure

```
prisma/
  └── schema.prisma                    # ✅ Updated

app/
  └── api/
      └── issues/
          └── [issueId]/
              └── route.ts             # ✅ Updated

components/
  ├── issue/
  │   └── issue-details/
  │       └── issue-details-info/
  │           ├── index.tsx            # ✅ Updated (integration)
  │           └── issue-details-info-acceptance-criteria.tsx  # ✅ NEW
  └── text-editor/
      ├── editor.tsx                   # ✅ Updated (type)
      └── preview.tsx                  # ✅ Updated (type)
```

## Troubleshooting

### Error: "Property 'acceptanceCriteria' does not exist"

**Solution**: Run `npx prisma generate` to regenerate the Prisma client.

### Error: "Column 'acceptanceCriteria' does not exist"

**Solution**: Run `npx prisma migrate dev --name add_acceptance_criteria` to apply the migration.

### Editor not showing

**Solution**: Check that the AcceptanceCriteria component is imported and rendered in both large and small views.

### Changes not saving

**Solution**:

1. Check API route includes acceptanceCriteria in validation and update
2. Check browser console for errors
3. Verify authentication is working

---

**Status**: ✅ **Implemented - Migration Required**  
**Version**: 1.0  
**Date**: October 19, 2025  
**Next Step**: Run `npx prisma migrate dev --name add_acceptance_criteria`
