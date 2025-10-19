// Type definitions for Test Case Management
export interface TestStep {
  id: string;
  stepNumber: number;
  summary: string;
  testData: string;
  expectedResult: string;
}

export interface TestCase {
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

export interface Folder {
  id: string;
  name: string;
  count: number;
  expanded?: boolean;
  subFolders?: Folder[];
}

export const getPriorityIcon = (priority: string) => {
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

export const getTypeColor = (type: string) => {
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

export const getReviewStatusColor = (reviewStatus: string) => {
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

export const getProgressColor = (progress: string) => {
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

export const formatStatus = (status: string) => {
  return status.replace("_", " ");
};
