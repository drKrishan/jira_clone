"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { IoSparkles } from "react-icons/io5";
import {
  MdAdd,
  MdFolder,
  MdRefresh,
  MdSearch,
  MdMoreVert,
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdFileUpload,
  MdNotificationsNone,
  MdEdit,
  MdDelete,
  MdClose,
  MdSave,
} from "react-icons/md";
import {
  BiSortAlt2,
  BiFilterAlt,
  BiDotsHorizontalRounded,
} from "react-icons/bi";
import { FiFileText, FiBarChart2, FiCalendar, FiFile } from "react-icons/fi";
import {
  MdArrowUpward,
  MdArrowDownward,
  MdSortByAlpha,
  MdCheck,
} from "react-icons/md";
import toast from "react-hot-toast";
import { CreateTestCaseModal } from "@/components/modals/create-test-case";

interface TestStep {
  id: string;
  stepNumber: number;
  summary: string;
  preCondition?: string;
  testData?: string;
  expectedResult: string;
}

interface TestCase {
  id: string;
  key: string;
  summary: string;
  version: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "NORMAL" | "LOW";
  type: "FUNCTIONAL" | "NON_FUNCTIONAL" | "PERFORMANCE";
  reviewStatus: "NEW" | "APPROVED" | "REJECTED";
  progress: "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  labels: string[];
  steps?: TestStep[];
  expanded?: boolean;
}

interface Folder {
  id: string;
  name: string;
  count: number;
  expanded?: boolean;
  subFolders?: Folder[];
}

const TestCaseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "test-case" | "test-cycle" | "test-plan" | "test-report"
  >("test-case");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    | "name-asc"
    | "name-desc"
    | "count-asc"
    | "count-desc"
    | "type-asc"
    | "type-desc"
  >("name-asc");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestCase, setEditingTestCase] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    summary: string;
    priority: string;
    type: string;
    reviewStatus: string;
    progress: string;
  }>({ summary: "", priority: "", type: "", reviewStatus: "", progress: "" });

  // Step CRUD state
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [addingStepToTestCase, setAddingStepToTestCase] = useState<
    string | null
  >(null);
  const [newStep, setNewStep] = useState({
    summary: "",
    preCondition: "",
    testData: "",
    expectedResult: "",
  });
  const [editStepForm, setEditStepForm] = useState({
    summary: "",
    preCondition: "",
    testData: "",
    expectedResult: "",
  });

  const sortMenuRef = useRef<HTMLDivElement>(null);

  // Fetch folders on mount
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/test-folders");
      const data = await response.json();
      setFolders(data);

      // Set first folder as selected by default
      if (data.length > 0) {
        const firstFolder = data[0];
        setSelectedFolder(firstFolder.id);
        fetchTestCases(firstFolder.id);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
      toast.error("Failed to load folders");
    }
  };

  const fetchTestCases = async (folderId?: string) => {
    try {
      setLoading(true);
      const url = folderId
        ? `/api/test-cases?folderId=${folderId}`
        : "/api/test-cases";
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched test cases:", data);
      console.log("Number of test cases:", data.length);
      console.log("For folder:", folderId || "all");
      setTestCases(
        data.map((tc: any) => ({
          ...tc,
          expanded: false,
        }))
      );
    } catch (error) {
      console.error("Error fetching test cases:", error);
      toast.error("Failed to load test cases");
    } finally {
      setLoading(false);
    }
  };

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        setIsSortMenuOpen(false);
      }
    };

    if (isSortMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortMenuOpen]);

  const toggleFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, expanded: !folder.expanded }
          : folder
      )
    );
  };

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId);
    // Fetch test cases for the selected folder
    fetchTestCases(folderId);
    // Toggle folder expansion if it has items
    const folder = folders.find((f) => f.id === folderId);
    if (folder && folder.count > 0) {
      toggleFolder(folderId);
    }
  };

  const toggleTestCase = (testCaseId: string) => {
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === testCaseId ? { ...tc, expanded: !tc.expanded } : tc
      )
    );
  };

  const startEditing = (testCase: TestCase) => {
    setEditingTestCase(testCase.id);
    setEditForm({
      summary: testCase.summary,
      priority: testCase.priority,
      type: testCase.type,
      reviewStatus: testCase.reviewStatus,
      progress: testCase.progress,
    });
  };

  const cancelEditing = () => {
    setEditingTestCase(null);
    setEditForm({
      summary: "",
      priority: "",
      type: "",
      reviewStatus: "",
      progress: "",
    });
  };

  const saveTestCase = async (testCaseId: string) => {
    try {
      const response = await fetch(`/api/test-cases/${testCaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedTestCase = await response.json();
        setTestCases((prev) =>
          prev.map((tc) =>
            tc.id === testCaseId
              ? { ...updatedTestCase, expanded: tc.expanded }
              : tc
          )
        );
        toast.success(
          `Test case updated! Version incremented to ${updatedTestCase.version}`
        );
        cancelEditing();
      } else {
        toast.error("Failed to update test case");
      }
    } catch (error) {
      console.error("Error updating test case:", error);
      toast.error("Failed to update test case");
    }
  };

  // Step CRUD operations
  const addStep = async (testCaseId: string) => {
    if (!newStep.summary.trim() || !newStep.expectedResult.trim()) {
      toast.error("Step summary and expected result are required");
      return;
    }

    try {
      console.log("Adding step to test case:", testCaseId);
      console.log("Step data:", newStep);

      const response = await fetch(`/api/test-cases/${testCaseId}/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStep),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const createdStep = await response.json();
        console.log("Created step:", createdStep);
        setTestCases((prev) =>
          prev.map((tc) =>
            tc.id === testCaseId
              ? {
                  ...tc,
                  steps: [...(tc.steps || []), createdStep].sort(
                    (a, b) => a.stepNumber - b.stepNumber
                  ),
                }
              : tc
          )
        );
        setNewStep({
          summary: "",
          preCondition: "",
          testData: "",
          expectedResult: "",
        });
        setAddingStepToTestCase(null);
        toast.success("Step added successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        toast.error(errorData.error || "Failed to add step");
      }
    } catch (error) {
      console.error("Error adding step:", error);
      toast.error(
        "Failed to add step: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const startEditingStep = (step: TestStep) => {
    setEditingStep(step.id);
    setEditStepForm({
      summary: step.summary,
      preCondition: step.preCondition || "",
      testData: step.testData || "",
      expectedResult: step.expectedResult,
    });
  };

  const cancelEditingStep = () => {
    setEditingStep(null);
    setEditStepForm({
      summary: "",
      preCondition: "",
      testData: "",
      expectedResult: "",
    });
  };

  const saveStep = async (testCaseId: string, stepId: string) => {
    if (!editStepForm.summary.trim() || !editStepForm.expectedResult.trim()) {
      toast.error("Step summary and expected result are required");
      return;
    }

    try {
      const response = await fetch(
        `/api/test-cases/${testCaseId}/steps/${stepId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editStepForm),
        }
      );

      if (response.ok) {
        const updatedStep = await response.json();
        setTestCases((prev) =>
          prev.map((tc) =>
            tc.id === testCaseId
              ? {
                  ...tc,
                  steps: (tc.steps || []).map((s) =>
                    s.id === stepId ? updatedStep : s
                  ),
                }
              : tc
          )
        );
        toast.success("Step updated successfully!");
        cancelEditingStep();
      } else {
        toast.error("Failed to update step");
      }
    } catch (error) {
      console.error("Error updating step:", error);
      toast.error("Failed to update step");
    }
  };

  const deleteStep = async (testCaseId: string, stepId: string) => {
    if (!confirm("Are you sure you want to delete this step?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/test-cases/${testCaseId}/steps/${stepId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Fetch updated steps with reordered step numbers
        const stepsResponse = await fetch(
          `/api/test-cases/${testCaseId}/steps`
        );
        const updatedSteps = await stepsResponse.json();

        setTestCases((prev) =>
          prev.map((tc) =>
            tc.id === testCaseId ? { ...tc, steps: updatedSteps } : tc
          )
        );
        toast.success("Step deleted successfully!");
      } else {
        toast.error("Failed to delete step");
      }
    } catch (error) {
      console.error("Error deleting step:", error);
      toast.error("Failed to delete step");
    }
  };

  const sortFolders = (foldersToSort: Folder[], sortType: typeof sortBy) => {
    const sorted = [...foldersToSort];

    switch (sortType) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "count-asc":
        return sorted.sort((a, b) => a.count - b.count);
      case "count-desc":
        return sorted.sort((a, b) => b.count - a.count);
      case "type-asc":
      case "type-desc":
        // Type sorting only affects test cases, not folders
        return sorted;
      default:
        return sorted;
    }
  };

  const sortTestCases = (
    testCasesToSort: TestCase[],
    sortType: typeof sortBy
  ) => {
    const sorted = [...testCasesToSort];

    switch (sortType) {
      case "type-asc":
        return sorted.sort((a, b) => a.type.localeCompare(b.type));
      case "type-desc":
        return sorted.sort((a, b) => b.type.localeCompare(a.type));
      default:
        return sorted;
    }
  };

  const handleSortChange = (sortType: typeof sortBy) => {
    setSortBy(sortType);
    setFolders((prev) => sortFolders(prev, sortType));
    setTestCases((prev) => sortTestCases(prev, sortType));
    setIsSortMenuOpen(false);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) {
      return;
    }

    const createFolderAsync = async () => {
      try {
        const response = await fetch("/api/test-folders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newFolderName.trim(),
            projectId: "project-1",
          }),
        });

        if (response.ok) {
          const newFolder = await response.json();
          setFolders((prev) => sortFolders([...prev, newFolder], sortBy));
          toast.success("Folder created successfully!");
          setNewFolderName("");
          setIsCreateFolderModalOpen(false);
        } else {
          toast.error("Failed to create folder");
        }
      } catch (error) {
        console.error("Error creating folder:", error);
        toast.error("Failed to create folder");
      }
    };

    createFolderAsync();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      createFolder();
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return { icon: "↑↑", color: "text-red-600", bg: "bg-red-50" };
      case "HIGH":
        return { icon: "↑", color: "text-orange-600", bg: "bg-orange-50" };
      case "MEDIUM":
        return { icon: "→", color: "text-yellow-600", bg: "bg-yellow-50" };
      case "NORMAL":
        return { icon: "→", color: "text-blue-600", bg: "bg-blue-50" };
      case "LOW":
        return { icon: "↓", color: "text-gray-600", bg: "bg-gray-50" };
      default:
        return { icon: "→", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "FUNCTIONAL":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "NON_FUNCTIONAL":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "PERFORMANCE":
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const getReviewStatusColor = (reviewStatus: string) => {
    switch (reviewStatus) {
      case "NEW":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "APPROVED":
        return "bg-green-100 text-green-700 border-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case "TODO":
        return "bg-gray-200 text-gray-700 border-gray-400";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "DONE":
        return "bg-green-600 text-white border-green-700";
      case "CANCELLED":
        return "bg-gray-400 text-white border-gray-500";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ");
  };

  const TabButton: React.FC<{
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }> = ({ active, icon, label, onClick }) => (
    <button
      onClick={onClick}
      className={`border-b-3 group flex items-center gap-x-2.5 px-5 py-3.5 text-sm font-medium transition-all ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800"
      }`}
    >
      <span
        className={active ? "" : "transition-transform group-hover:scale-110"}
      >
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
        <div className="flex items-center gap-x-1">
          <TabButton
            active={activeTab === "test-case"}
            icon={<FiFileText className="text-base" />}
            label="Test Case"
            onClick={() => setActiveTab("test-case")}
          />
          <TabButton
            active={activeTab === "test-cycle"}
            icon={<FiCalendar className="text-base" />}
            label="Test Cycle"
            onClick={() => setActiveTab("test-cycle")}
          />
          <TabButton
            active={activeTab === "test-plan"}
            icon={<FiFile className="text-base" />}
            label="Test Plan"
            onClick={() => setActiveTab("test-plan")}
          />
          <TabButton
            active={activeTab === "test-report"}
            icon={<FiBarChart2 className="text-base" />}
            label="Test Report"
            onClick={() => setActiveTab("test-report")}
          />
        </div>

        <div className="flex items-center gap-x-3">
          <Button
            customColors
            className="flex items-center gap-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-md"
          >
            <IoSparkles className="text-base" />
            <span className="font-semibold">Generate Test Cases</span>
          </Button>
          <CreateTestCaseModal
            folderId={selectedFolder}
            folderName={
              folders.find((f) => f.id === selectedFolder)?.name || "Folder"
            }
            onTestCaseCreated={() => {
              fetchTestCases(selectedFolder);
            }}
          >
            <Button
              customColors
              className="flex items-center gap-x-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedFolder || folders.length === 0}
            >
              <MdAdd className="text-lg" />
              <span>New</span>
            </Button>
          </CreateTestCaseModal>
          <Button
            customColors
            className="flex items-center gap-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50"
          >
            <MdFileUpload className="text-base" />
            <span>Import</span>
          </Button>
          <Button
            customColors
            className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-600 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50"
          >
            <MdNotificationsNone className="text-xl" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Folder Tree */}
        <div className="w-80 border-r border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Folders
            </h2>
            <div className="flex items-center gap-x-2">
              <Button
                customColors
                className="rounded-lg bg-blue-600 p-2 text-white shadow-sm transition-all hover:bg-blue-700"
                title="Folder View"
              >
                <MdFolder className="text-lg" />
              </Button>
              <Button
                customColors
                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                onClick={() => setIsCreateFolderModalOpen(true)}
                title="Create New Folder"
              >
                <MdAdd className="text-lg" />
              </Button>
              <Button
                customColors
                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                title="Refresh"
              >
                <MdRefresh className="text-lg" />
              </Button>
              <div className="relative" ref={sortMenuRef}>
                <Button
                  customColors
                  className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  title="Sort Folders"
                >
                  <BiSortAlt2 className="text-lg" />
                </Button>

                {/* Sort Dropdown Menu */}
                {isSortMenuOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                        Sort By
                      </div>
                      <button
                        onClick={() => handleSortChange("name-asc")}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-x-2">
                          <MdSortByAlpha className="text-lg" />
                          <span>Name (A-Z)</span>
                        </div>
                        {sortBy === "name-asc" && (
                          <MdCheck className="text-lg text-blue-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSortChange("name-desc")}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-x-2">
                          <MdSortByAlpha className="rotate-180 text-lg" />
                          <span>Name (Z-A)</span>
                        </div>
                        {sortBy === "name-desc" && (
                          <MdCheck className="text-lg text-blue-600" />
                        )}
                      </button>
                      <div className="my-1 border-t border-gray-200"></div>
                      <button
                        onClick={() => handleSortChange("count-asc")}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-x-2">
                          <MdArrowUpward className="text-lg" />
                          <span>Count (Low to High)</span>
                        </div>
                        {sortBy === "count-asc" && (
                          <MdCheck className="text-lg text-blue-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSortChange("count-desc")}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-x-2">
                          <MdArrowDownward className="text-lg" />
                          <span>Count (High to Low)</span>
                        </div>
                        {sortBy === "count-desc" && (
                          <MdCheck className="text-lg text-blue-600" />
                        )}
                      </button>
                      <div className="my-1 border-t border-gray-200"></div>
                      <button
                        onClick={() => handleSortChange("type-asc")}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-x-2">
                          <MdSortByAlpha className="text-lg" />
                          <span>Type (A-Z)</span>
                        </div>
                        {sortBy === "type-asc" && (
                          <MdCheck className="text-lg text-blue-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSortChange("type-desc")}
                        className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-x-2">
                          <MdSortByAlpha className="rotate-180 text-lg" />
                          <span>Type (Z-A)</span>
                        </div>
                        {sortBy === "type-desc" && (
                          <MdCheck className="text-lg text-blue-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Button
                customColors
                className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
                title="Search"
              >
                <MdSearch className="text-lg" />
              </Button>
              <Button
                customColors
                className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
              >
                <MdMoreVert className="text-lg" />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto p-3">
            {folders.map((folder) => (
              <div key={folder.id} className="mb-1.5">
                <button
                  onClick={() => handleFolderClick(folder.id)}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                    selectedFolder === folder.id
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-x-2.5">
                    {folder.count > 0 ? (
                      folder.expanded ? (
                        <MdKeyboardArrowDown className="text-base text-gray-400" />
                      ) : (
                        <MdKeyboardArrowRight className="text-base text-gray-400" />
                      )
                    ) : (
                      <span className="w-4" />
                    )}
                    <MdFolder
                      className={`text-lg transition-colors ${
                        selectedFolder === folder.id
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <span className="truncate font-medium">{folder.name}</span>
                  </div>
                  <span
                    className={`ml-2 rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                      selectedFolder === folder.id
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    {folder.count}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Test Cases Table */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3.5 shadow-sm">
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-3">
                <MdFolder className="text-xl text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-800">
                    {folders.find((f) => f.id === selectedFolder)?.name ||
                      "Folder"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {testCases.length}{" "}
                    {testCases.length === 1 ? "test case" : "test cases"}
                  </span>
                </div>
              </div>
              <Button
                customColors
                onClick={() => fetchTestCases(selectedFolder)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                title="Refresh test cases"
              >
                <MdRefresh className="text-lg" />
              </Button>
            </div>

            <div className="flex items-center gap-x-2">
              <Button
                customColors
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <MdSearch className="text-xl" />
              </Button>
              <Button
                customColors
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <BiFilterAlt className="text-xl" />
              </Button>
              <Button
                customColors
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <BiDotsHorizontalRounded className="text-xl" />
              </Button>
            </div>
          </div>

          {/* Type Filter Bar */}
          <div className="border-b border-gray-200 bg-white px-6 py-3">
            <div className="flex items-center gap-x-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Type:
              </span>
              <Button
                customColors
                onClick={() => setTypeFilter("all")}
                className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                  typeFilter === "all"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </Button>
              <Button
                customColors
                onClick={() => setTypeFilter("FUNCTIONAL")}
                className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                  typeFilter === "FUNCTIONAL"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Functional
              </Button>
              <Button
                customColors
                onClick={() => setTypeFilter("NON_FUNCTIONAL")}
                className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                  typeFilter === "NON_FUNCTIONAL"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Non-Functional
              </Button>
              <Button
                customColors
                onClick={() => setTypeFilter("PERFORMANCE")}
                className={`rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                  typeFilter === "PERFORMANCE"
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Performance
              </Button>
            </div>
          </div>

          {/* Test Cases Table */}
          <div className="flex-1 overflow-auto bg-gray-50">
            <table className="w-full">
              <thead className="sticky top-0 bg-white shadow-sm">
                <tr className="border-b-2 border-gray-200">
                  <th className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center gap-x-1">
                      <span>Key</span>
                      <BiSortAlt2 className="text-sm text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center gap-x-1">
                      <span>Summary</span>
                      <BiSortAlt2 className="text-sm text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Version
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center gap-x-1">
                      <span>Type</span>
                      <BiSortAlt2 className="text-sm text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center gap-x-1">
                      <span>Review Status</span>
                      <BiSortAlt2 className="text-sm text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center gap-x-1">
                      <span>Progress</span>
                      <BiSortAlt2 className="text-sm text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-y-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                        <p className="text-sm font-medium text-gray-600">
                          Loading test cases...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : testCases.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-y-3">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
                          📝
                        </div>
                        <div>
                          <p className="mb-1 text-base font-semibold text-gray-700">
                            No test cases found
                          </p>
                          <p className="text-sm text-gray-500">
                            Create your first test case to get started!
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  testCases
                    .filter(
                      (testCase) =>
                        typeFilter === "all" || testCase.type === typeFilter
                    )
                    .map((testCase) => (
                      <React.Fragment key={testCase.id}>
                        <tr className="group border-b border-gray-200 transition-colors hover:bg-blue-50/30">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleTestCase(testCase.id)}
                              className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            >
                              {testCase.expanded ? (
                                <MdKeyboardArrowDown className="text-xl" />
                              ) : (
                                <MdKeyboardArrowRight className="text-xl" />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <span className="cursor-pointer font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline">
                              {testCase.key}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {editingTestCase === testCase.id ? (
                              <input
                                type="text"
                                value={editForm.summary}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    summary: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-800">
                                {testCase.summary}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                              v{testCase.version}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {editingTestCase === testCase.id ? (
                              <select
                                value={editForm.priority}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    priority: e.target.value,
                                  })
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="CRITICAL">Critical ↑↑</option>
                                <option value="HIGH">High ↑</option>
                                <option value="MEDIUM">Medium →</option>
                                <option value="NORMAL">Normal →</option>
                                <option value="LOW">Low ↓</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-bold ${
                                  getPriorityIcon(testCase.priority).color
                                } ${getPriorityIcon(testCase.priority).bg}`}
                              >
                                {getPriorityIcon(testCase.priority).icon}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingTestCase === testCase.id ? (
                              <select
                                value={editForm.type}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    type: e.target.value,
                                  })
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="FUNCTIONAL">Functional</option>
                                <option value="NON_FUNCTIONAL">
                                  Non-Functional
                                </option>
                                <option value="PERFORMANCE">Performance</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-block rounded-md border px-3 py-1.5 text-xs font-semibold ${getTypeColor(
                                  testCase.type
                                )}`}
                              >
                                {formatStatus(testCase.type)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingTestCase === testCase.id ? (
                              <select
                                value={editForm.reviewStatus}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    reviewStatus: e.target.value,
                                  })
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="NEW">New</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-block rounded-md border px-3 py-1.5 text-xs font-semibold ${getReviewStatusColor(
                                  testCase.reviewStatus
                                )}`}
                              >
                                {formatStatus(testCase.reviewStatus)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingTestCase === testCase.id ? (
                              <select
                                value={editForm.progress}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    progress: e.target.value,
                                  })
                                }
                                className="rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-block rounded-md border px-3 py-1.5 text-xs font-semibold ${getProgressColor(
                                  testCase.progress
                                )}`}
                              >
                                {formatStatus(testCase.progress)}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {editingTestCase === testCase.id ? (
                              <div className="flex items-center justify-center gap-x-2">
                                <button
                                  onClick={() => saveTestCase(testCase.id)}
                                  className="rounded-lg bg-blue-600 p-2 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
                                  title="Save"
                                >
                                  <MdSave className="text-lg" />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="rounded-lg bg-gray-200 p-2 text-gray-700 shadow-sm transition-all hover:bg-gray-300"
                                  title="Cancel"
                                >
                                  <MdClose className="text-lg" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditing(testCase)}
                                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                title="Edit"
                              >
                                <MdEdit className="text-lg" />
                              </button>
                            )}
                          </td>
                        </tr>

                        {/* Expanded Test Steps */}
                        {testCase.expanded && (
                          <tr>
                            <td
                              colSpan={9}
                              className="bg-gradient-to-br from-blue-50/20 to-gray-50/40 px-6 py-5"
                            >
                              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                  <h3 className="flex items-center gap-x-2.5 text-base font-semibold text-gray-800">
                                    <span className="text-xl">📋</span>
                                    <span>Test Steps</span>
                                    <span className="ml-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                      {testCase.steps?.length || 0}
                                    </span>
                                  </h3>
                                  <button
                                    onClick={() =>
                                      setAddingStepToTestCase(testCase.id)
                                    }
                                    className="flex items-center gap-x-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
                                  >
                                    <MdAdd className="text-base" />
                                    Add Step
                                  </button>
                                </div>

                                {testCase.steps && testCase.steps.length > 0 ? (
                                  <table className="w-full">
                                    <thead className="border-b-2 border-gray-200 bg-gray-50/80">
                                      <tr>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                                          #
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                          Step Summary
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                          Pre Condition
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                          Test Data
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                          Expected Result
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                                          Actions
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {testCase.steps.map((step) => (
                                        <tr
                                          key={step.id}
                                          className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                                        >
                                          <td className="px-4 py-4 text-center">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                              {step.stepNumber}
                                            </span>
                                          </td>
                                          <td className="px-4 py-4 text-sm text-gray-800">
                                            {editingStep === step.id ? (
                                              <textarea
                                                value={editStepForm.summary}
                                                onChange={(e) =>
                                                  setEditStepForm({
                                                    ...editStepForm,
                                                    summary: e.target.value,
                                                  })
                                                }
                                                className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={2}
                                              />
                                            ) : (
                                              <span className="font-medium">
                                                {step.summary}
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-4 py-4 text-sm text-gray-600">
                                            {editingStep === step.id ? (
                                              <textarea
                                                value={
                                                  editStepForm.preCondition
                                                }
                                                onChange={(e) =>
                                                  setEditStepForm({
                                                    ...editStepForm,
                                                    preCondition:
                                                      e.target.value,
                                                  })
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={2}
                                              />
                                            ) : (
                                              <span className="text-gray-600">
                                                {step.preCondition || "-"}
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-4 py-4 text-sm text-gray-600">
                                            {editingStep === step.id ? (
                                              <textarea
                                                value={editStepForm.testData}
                                                onChange={(e) =>
                                                  setEditStepForm({
                                                    ...editStepForm,
                                                    testData: e.target.value,
                                                  })
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={2}
                                              />
                                            ) : (
                                              <span className="text-gray-600">
                                                {step.testData || "-"}
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-4 py-4 text-sm text-gray-800">
                                            {editingStep === step.id ? (
                                              <textarea
                                                value={
                                                  editStepForm.expectedResult
                                                }
                                                onChange={(e) =>
                                                  setEditStepForm({
                                                    ...editStepForm,
                                                    expectedResult:
                                                      e.target.value,
                                                  })
                                                }
                                                className="w-full rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={2}
                                              />
                                            ) : (
                                              <span className="font-medium">
                                                {step.expectedResult}
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-4 py-4 text-center">
                                            {editingStep === step.id ? (
                                              <div className="flex items-center justify-center gap-x-2">
                                                <button
                                                  onClick={() =>
                                                    saveStep(
                                                      testCase.id,
                                                      step.id
                                                    )
                                                  }
                                                  className="rounded-lg bg-green-600 p-1.5 text-white shadow-sm transition-all hover:bg-green-700"
                                                  title="Save"
                                                >
                                                  <MdSave className="text-base" />
                                                </button>
                                                <button
                                                  onClick={cancelEditingStep}
                                                  className="rounded-lg bg-gray-200 p-1.5 text-gray-700 shadow-sm transition-all hover:bg-gray-300"
                                                  title="Cancel"
                                                >
                                                  <MdClose className="text-base" />
                                                </button>
                                              </div>
                                            ) : (
                                              <div className="flex items-center justify-center gap-x-2">
                                                <button
                                                  onClick={() =>
                                                    startEditingStep(step)
                                                  }
                                                  className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                                                  title="Edit Step"
                                                >
                                                  <MdEdit className="text-base" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    deleteStep(
                                                      testCase.id,
                                                      step.id
                                                    )
                                                  }
                                                  className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
                                                  title="Delete Step"
                                                >
                                                  <MdDelete className="text-base" />
                                                </button>
                                              </div>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50/20 py-12 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                                      📋
                                    </div>
                                    <p className="mb-2 text-sm font-medium text-gray-700">
                                      No test steps added yet
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Click "Add Step" to create your first test
                                      step
                                    </p>
                                  </div>
                                )}

                                {/* Add Step Form */}
                                {addingStepToTestCase === testCase.id && (
                                  <div className="mt-5 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
                                    <h4 className="mb-4 flex items-center gap-x-2 text-base font-semibold text-gray-800">
                                      <span className="text-blue-600">➕</span>
                                      Add New Step
                                    </h4>
                                    <div className="grid grid-cols-4 gap-4">
                                      <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                                          Step Details{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <textarea
                                          value={newStep.summary}
                                          onChange={(e) =>
                                            setNewStep({
                                              ...newStep,
                                              summary: e.target.value,
                                            })
                                          }
                                          placeholder="Enter step details..."
                                          className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                          rows={3}
                                        />
                                      </div>
                                      <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                                          Pre Condition
                                        </label>
                                        <textarea
                                          value={newStep.preCondition}
                                          onChange={(e) =>
                                            setNewStep({
                                              ...newStep,
                                              preCondition: e.target.value,
                                            })
                                          }
                                          placeholder="Enter pre condition..."
                                          className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                          rows={3}
                                        />
                                      </div>
                                      <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                                          Test Data
                                        </label>
                                        <textarea
                                          value={newStep.testData}
                                          onChange={(e) =>
                                            setNewStep({
                                              ...newStep,
                                              testData: e.target.value,
                                            })
                                          }
                                          placeholder="Enter test data..."
                                          className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                          rows={3}
                                        />
                                      </div>
                                      <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                                          Expected Result{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </label>
                                        <textarea
                                          value={newStep.expectedResult}
                                          onChange={(e) =>
                                            setNewStep({
                                              ...newStep,
                                              expectedResult: e.target.value,
                                            })
                                          }
                                          placeholder="Enter expected result..."
                                          className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                          rows={3}
                                        />
                                      </div>
                                    </div>
                                    <div className="mt-4 flex justify-end gap-x-3">
                                      <button
                                        onClick={() => {
                                          setAddingStepToTestCase(null);
                                          setNewStep({
                                            summary: "",
                                            preCondition: "",
                                            testData: "",
                                            expectedResult: "",
                                          });
                                        }}
                                        className="rounded-lg border-2 border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => addStep(testCase.id)}
                                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
                                      >
                                        Add Step
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      {isCreateFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Create New Folder
              </h2>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="mb-4">
                <label
                  htmlFor="folderName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Folder Name
                </label>
                <input
                  id="folderName"
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter folder name..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs text-gray-600">
                  💡 <strong>Tip:</strong> Use descriptive names for better
                  organization (e.g., &quot;Login Features&quot;, &quot;Payment
                  Module&quot;)
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-x-2 border-t border-gray-200 px-6 py-4">
              <Button
                customColors
                onClick={() => {
                  setIsCreateFolderModalOpen(false);
                  setNewFolderName("");
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                customColors
                onClick={createFolder}
                disabled={!newFolderName.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create Folder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { TestCaseManagement };
