"use client";

import React, { useState } from "react";
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
} from "react-icons/md";
import {
  BiSortAlt2,
  BiFilterAlt,
  BiDotsHorizontalRounded,
} from "react-icons/bi";
import { FiFileText, FiBarChart2, FiCalendar, FiFile } from "react-icons/fi";

interface TestCase {
  key: string;
  summary: string;
  version: number;
  priority: string;
  status: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
  expanded: boolean;
  subFolders?: Folder[];
}

const TestCaseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "test-case" | "test-cycle" | "test-plan" | "test-report"
  >("test-case");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");

  // Mock data
  const [folders, setFolders] = useState<Folder[]>([
    { id: "all", name: "All Test Cases", count: 234, expanded: true },
    { id: "app-mod", name: "App Modifications", count: 19, expanded: false },
    {
      id: "data-collection",
      name: "Data Collection",
      count: 2,
      expanded: false,
    },
    {
      id: "device-config",
      name: "Device Configuration for...",
      count: 0,
      expanded: false,
    },
    { id: "device-mode", name: "Device Mode", count: 6, expanded: false },
    { id: "mockup", name: "Mockup Programs", count: 2, expanded: false },
    {
      id: "modify-settings",
      name: "Modify App Settings",
      count: 7,
      expanded: false,
    },
    { id: "qi-generated", name: "QI Generated", count: 107, expanded: false },
    { id: "resource", name: "Resource Utilization", count: 1, expanded: false },
  ]);

  const [testCases] = useState<TestCase[]>([
    {
      key: "FIT-TC-6",
      summary: "Successful User Login and Bulk import of Parameters",
      version: 5,
      priority: "high",
      status: "Approved",
    },
    {
      key: "FIT-TC-7",
      summary: "Oxygen Monitor",
      version: 4,
      priority: "high",
      status: "Approved",
    },
    {
      key: "FIT-TC-8",
      summary: "Set device to Run mode",
      version: 2,
      priority: "high",
      status: "Done",
    },
    {
      key: "FIT-TC-10",
      summary: "Login to journal subscription portal",
      version: 1,
      priority: "high",
      status: "To Do",
    },
    {
      key: "FIT-TC-11",
      summary: "Login to fitness tracker portal",
      version: 1,
      priority: "high",
      status: "To Do",
    },
    {
      key: "FIT-TC-12",
      summary: "Login to gym payment portal",
      version: 1,
      priority: "high",
      status: "To Do",
    },
    {
      key: "FIT-TC-13",
      summary:
        "Successful User Login and Bulk import of Parameters with Values",
      version: 3,
      priority: "high",
      status: "To Do",
    },
  ]);

  const toggleFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, expanded: !folder.expanded }
          : folder
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "done":
        return "bg-green-600 text-white border-green-700";
      case "to do":
        return "bg-gray-200 text-gray-700 border-gray-400";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  const TabButton: React.FC<{
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }> = ({ active, icon, label, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-x-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center">
          <TabButton
            active={activeTab === "test-case"}
            icon={<FiFileText className="text-lg" />}
            label="Test Case"
            onClick={() => setActiveTab("test-case")}
          />
          <TabButton
            active={activeTab === "test-cycle"}
            icon={<FiCalendar className="text-lg" />}
            label="Test Cycle"
            onClick={() => setActiveTab("test-cycle")}
          />
          <TabButton
            active={activeTab === "test-plan"}
            icon={<FiFile className="text-lg" />}
            label="Test Plan"
            onClick={() => setActiveTab("test-plan")}
          />
          <TabButton
            active={activeTab === "test-report"}
            icon={<FiBarChart2 className="text-lg" />}
            label="Test Report"
            onClick={() => setActiveTab("test-report")}
          />
        </div>

        <div className="flex items-center gap-x-2">
          <Button
            customColors
            className="flex items-center gap-x-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-indigo-700"
          >
            <IoSparkles className="text-lg" />
            <span>Generate Test Cases</span>
          </Button>
          <Button
            customColors
            className="flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <MdAdd className="text-lg" />
            <span>New</span>
          </Button>
          <Button
            customColors
            className="flex items-center gap-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <MdFileUpload className="text-lg" />
            <span>Import</span>
          </Button>
          <Button
            customColors
            className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
          >
            <MdNotificationsNone className="text-xl" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Folder Tree */}
        <div className="w-72 border-r border-gray-200 bg-gray-50">
          <div className="border-b border-gray-200 bg-white p-3">
            <div className="flex items-center gap-x-2">
              <Button
                customColors
                className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
              >
                <MdFolder className="text-lg" />
              </Button>
              <Button
                customColors
                className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
              >
                <MdAdd className="text-lg" />
              </Button>
              <Button
                customColors
                className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
              >
                <MdRefresh className="text-lg" />
              </Button>
              <Button
                customColors
                className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
              >
                <BiSortAlt2 className="text-lg" />
              </Button>
              <Button
                customColors
                className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
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

          <div className="overflow-y-auto p-2">
            {folders.map((folder) => (
              <div key={folder.id} className="mb-1">
                <button
                  onClick={() => {
                    setSelectedFolder(folder.id);
                    if (folder.count > 0) toggleFolder(folder.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                    selectedFolder === folder.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-x-2">
                    {folder.count > 0 ? (
                      folder.expanded ? (
                        <MdKeyboardArrowDown className="text-gray-500" />
                      ) : (
                        <MdKeyboardArrowRight className="text-gray-500" />
                      )
                    ) : (
                      <span className="w-4" />
                    )}
                    <MdFolder className="text-gray-500" />
                    <span className="truncate font-medium">{folder.name}</span>
                  </div>
                  <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
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
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
            <div className="flex items-center gap-x-4">
              <span className="text-sm text-gray-600">
                1 - 20 Of <span className="font-semibold">234</span>
              </span>
              <Button
                customColors
                className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
              >
                <MdRefresh className="text-lg" />
              </Button>
            </div>

            <div className="flex items-center gap-x-2">
              <Button
                customColors
                className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
              >
                <MdSearch className="text-xl" />
              </Button>
              <Button
                customColors
                className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
              >
                <BiFilterAlt className="text-xl" />
              </Button>
              <Button
                customColors
                className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
              >
                <BiDotsHorizontalRounded className="text-xl" />
              </Button>
            </div>
          </div>

          {/* Test Cases Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                    <div className="flex items-center gap-x-1">
                      <span>Key</span>
                      <BiSortAlt2 className="text-sm" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                    <div className="flex items-center gap-x-1">
                      <span>Summary</span>
                      <BiSortAlt2 className="text-sm" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">
                    V
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-600">
                    P
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                    <div className="flex items-center gap-x-1">
                      <span>Status</span>
                      <BiSortAlt2 className="text-sm" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {testCases.map((testCase, index) => (
                  <tr
                    key={testCase.key}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MdKeyboardArrowRight className="text-lg" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-blue-600 hover:underline">
                        {testCase.key}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">
                        {testCase.summary}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-700">
                        {testCase.version}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-orange-600">↑</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded border px-3 py-1 text-xs font-medium ${getStatusColor(
                          testCase.status
                        )}`}
                      >
                        {testCase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TestCaseManagement };
