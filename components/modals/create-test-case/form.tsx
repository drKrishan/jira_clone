"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { toast } from "@/components/toast";

interface CreateTestCaseFormProps {
  folderId: string;
  folderName: string;
  setModalIsOpen: (isOpen: boolean) => void;
  onTestCaseCreated: () => void;
}

export const CreateTestCaseForm: React.FC<CreateTestCaseFormProps> = ({
  folderId,
  folderName,
  setModalIsOpen,
  onTestCaseCreated,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    summary: "",
    priority: "MEDIUM" as "CRITICAL" | "HIGH" | "MEDIUM" | "NORMAL" | "LOW",
    type: "FUNCTIONAL" as "FUNCTIONAL" | "NON_FUNCTIONAL" | "PERFORMANCE",
    reviewStatus: "NEW" as "NEW" | "APPROVED" | "REJECTED",
    progress: "TODO" as "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED",
    labels: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.summary.trim()) {
      toast.error({
        message: "Validation Error",
        description: "Test case summary is required",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const labelsArray = formData.labels
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const response = await fetch("/api/test-cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: formData.summary,
          priority: formData.priority,
          type: formData.type,
          reviewStatus: formData.reviewStatus,
          progress: formData.progress,
          labels: labelsArray,
          folderId: folderId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create test case");
      }

      const newTestCase = await response.json();
      toast.success({
        message: "Test Case Created",
        description: `Test case ${newTestCase.key} created successfully!`,
      });
      setModalIsOpen(false);
      onTestCaseCreated();
    } catch (error) {
      console.error("Error creating test case:", error);
      toast.error({
        message: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create test case",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setModalIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Folder Info */}
      <div className="rounded-md bg-blue-50 p-3">
        <div className="text-xs font-medium text-gray-600">
          Creating test case in:
        </div>
        <div className="text-sm font-semibold text-blue-700">{folderName}</div>
      </div>

      {/* Summary */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Summary <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.summary}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
          placeholder="Enter test case summary"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoFocus
        />
      </div>

      {/* Priority and Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as typeof formData.priority,
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as typeof formData.type,
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="FUNCTIONAL">Functional</option>
            <option value="NON_FUNCTIONAL">Non-Functional</option>
            <option value="PERFORMANCE">Performance</option>
          </select>
        </div>
      </div>

      {/* Review Status and Progress */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Review Status
          </label>
          <select
            value={formData.reviewStatus}
            onChange={(e) =>
              setFormData({
                ...formData,
                reviewStatus: e.target.value as typeof formData.reviewStatus,
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="NEW">New</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Progress
          </label>
          <select
            value={formData.progress}
            onChange={(e) =>
              setFormData({
                ...formData,
                progress: e.target.value as typeof formData.progress,
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Labels */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Labels
        </label>
        <input
          type="text"
          value={formData.labels}
          onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
          placeholder="Enter labels separated by commas (e.g., login, auth, critical)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Separate multiple labels with commas
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-x-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          <MdClose className="text-base" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !formData.summary.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Test Case"}
        </button>
      </div>
    </form>
  );
};
