import React, { Fragment, useRef, useState } from "react";
import { NotImplemented } from "@/components/not-implemented";
import { LightningIcon } from "@/components/svgs";
import { IssueTitle } from "../../issue-title";
import { IssueSelectStatus } from "../../issue-select-status";
import { useSelectedIssueContext } from "@/context/use-selected-issue-context";
import { type IssueType } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Comments } from "./issue-details-info-comments";
import { IssueMetaInfo } from "./issue-details-info-meta";
import { Description } from "./issue-details-info-description";
import { IssueDetailsInfoAccordion } from "./issue-details-info-accordion";
import { IssueDetailsInfoActions } from "./issue-details-info-actions";
import { ChildIssueList } from "./issue-details-info-child-issues";
import { hasChildren, isEpic } from "@/utils/helpers";
import { ColorPicker } from "@/components/color-picker";
import { useContainerWidth } from "@/hooks/use-container-width";
import Split from "react-split";
import "@/styles/split.css";
import { IoSparkles } from "react-icons/io5";
import {
  FaCheckCircle,
  FaCog,
  FaTachometerAlt,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFile,
} from "react-icons/fa";
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdClose,
  MdAttachFile,
} from "react-icons/md";
import toast from "react-hot-toast";

const IssueDetailsInfo = React.forwardRef<
  HTMLDivElement,
  {
    issue: IssueType | undefined;
    showTestCaseGenerator: boolean;
    setShowTestCaseGenerator: (show: boolean) => void;
  }
>(({ issue, showTestCaseGenerator, setShowTestCaseGenerator }, ref) => {
  const [parentRef, parentWidth] = useContainerWidth();

  if (!issue) return <div />;
  return (
    <div ref={parentRef}>
      {!parentWidth ? null : parentWidth > 800 ? (
        <LargeIssueDetails
          issue={issue}
          ref={ref}
          showTestCaseGenerator={showTestCaseGenerator}
          setShowTestCaseGenerator={setShowTestCaseGenerator}
        />
      ) : (
        <SmallIssueDetailsInfo
          issue={issue}
          ref={ref}
          showTestCaseGenerator={showTestCaseGenerator}
          setShowTestCaseGenerator={setShowTestCaseGenerator}
        />
      )}
    </div>
  );
});

IssueDetailsInfo.displayName = "IssueDetailsInfo";

const SmallIssueDetailsInfo = React.forwardRef<
  HTMLDivElement,
  {
    issue: IssueType;
    showTestCaseGenerator: boolean;
    setShowTestCaseGenerator: (show: boolean) => void;
  }
>(({ issue, showTestCaseGenerator, setShowTestCaseGenerator }, ref) => {
  const { issueKey } = useSelectedIssueContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChildIssue, setIsAddingChildIssue] = useState(false);

  return (
    <Fragment>
      <div className="flex items-center gap-x-2">
        {isEpic(issue) ? <ColorPicker issue={issue} /> : null}
        <h1
          ref={ref}
          role="button"
          onClick={() => setIsEditing(true)}
          data-state={isEditing ? "editing" : "notEditing"}
          className="w-full transition-all [&[data-state=notEditing]]:hover:bg-gray-100"
        >
          <IssueTitle
            className="mr-1 py-1"
            key={issue.id + issue.name}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            issue={issue}
            ref={nameRef}
          />
        </h1>
      </div>

      <IssueDetailsInfoActions
        onAddChildIssue={() => setIsAddingChildIssue(true)}
      />
      <div className="relative flex items-center gap-x-3">
        <IssueSelectStatus
          key={issue.id + issue.status}
          currentStatus={issue.status}
          issueId={issue.id}
          variant="lg"
        />
        <NotImplemented>
          <Button customColors className="hover:bg-gray-200">
            <div className="flex items-center">
              <LightningIcon className="mt-0.5" />
              <span>Actions</span>
            </div>
          </Button>
        </NotImplemented>
        <Button
          customColors
          className="flex items-center gap-x-1 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-600 hover:to-indigo-700 hover:shadow-lg"
          onClick={() => setShowTestCaseGenerator(true)}
        >
          <IoSparkles className="text-lg" />
          <span>Generate Test cases With Navagi</span>
        </Button>
      </div>
      <Description issue={issue} key={String(issueKey) + issue.id} />
      {showTestCaseGenerator && (
        <TestCaseGenerator onClose={() => setShowTestCaseGenerator(false)} />
      )}
      {hasChildren(issue) || isAddingChildIssue ? (
        <ChildIssueList
          issues={issue.children}
          parentIsEpic={isEpic(issue)}
          parentId={issue.id}
          isAddingChildIssue={isAddingChildIssue}
          setIsAddingChildIssue={setIsAddingChildIssue}
        />
      ) : null}
      <IssueDetailsInfoAccordion issue={issue} />
      <IssueMetaInfo issue={issue} />
      <Comments issue={issue} />
    </Fragment>
  );
});

SmallIssueDetailsInfo.displayName = "SmallIssueDetailsInfo";

const LargeIssueDetails = React.forwardRef<
  HTMLDivElement,
  {
    issue: IssueType;
    showTestCaseGenerator: boolean;
    setShowTestCaseGenerator: (show: boolean) => void;
  }
>(({ issue, showTestCaseGenerator, setShowTestCaseGenerator }, ref) => {
  const { issueKey } = useSelectedIssueContext();
  const nameRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChildIssue, setIsAddingChildIssue] = useState(false);

  return (
    <Split
      sizes={[60, 40]}
      gutterSize={2}
      className="flex max-h-[70vh] w-full overflow-hidden"
      minSize={300}
    >
      <div className="overflow-y-auto pr-3">
        <div className="flex items-center gap-x-2">
          {isEpic(issue) ? <ColorPicker issue={issue} /> : null}
          <h1
            ref={ref}
            role="button"
            onClick={() => setIsEditing(true)}
            data-state={isEditing ? "editing" : "notEditing"}
            className="w-full transition-all [&[data-state=notEditing]]:hover:bg-gray-100"
          >
            <IssueTitle
              className="mr-1 py-1"
              key={issue.id + issue.name}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              issue={issue}
              ref={nameRef}
            />
          </h1>
        </div>
        <IssueDetailsInfoActions
          onAddChildIssue={() => setIsAddingChildIssue(true)}
          variant={"lg"}
        />
        <Description issue={issue} key={String(issueKey) + issue.id} />
        {showTestCaseGenerator && (
          <TestCaseGenerator onClose={() => setShowTestCaseGenerator(false)} />
        )}
        {hasChildren(issue) || isAddingChildIssue ? (
          <ChildIssueList
            issues={issue.children}
            parentIsEpic={isEpic(issue)}
            parentId={issue.id}
            isAddingChildIssue={isAddingChildIssue}
            setIsAddingChildIssue={setIsAddingChildIssue}
          />
        ) : null}
        <Comments issue={issue} />
      </div>

      <div className="mt-4 bg-white pl-3">
        <div className="relative flex items-center gap-x-3">
          <IssueSelectStatus
            key={issue.id + issue.status}
            currentStatus={issue.status}
            issueId={issue.id}
            variant="lg"
          />
          <NotImplemented>
            <Button customColors className="hover:bg-gray-200">
              <div className="flex items-center">
                <LightningIcon className="mt-0.5" />
                <span>Actions</span>
              </div>
            </Button>
          </NotImplemented>
          <Button
            customColors
            className="flex items-center gap-x-1 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-600 hover:to-indigo-700 hover:shadow-lg"
            onClick={() => setShowTestCaseGenerator(true)}
          >
            <IoSparkles className="text-lg" />
            <span>Generate Test cases With Navagi</span>
          </Button>
        </div>

        <IssueDetailsInfoAccordion issue={issue} />
        <IssueMetaInfo issue={issue} />
      </div>
    </Split>
  );
});

LargeIssueDetails.displayName = "LargeIssueDetails";

const TestCaseGenerator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedTestTypes, setSelectedTestTypes] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<
    Array<{
      id: string;
      name: string;
      size: number;
      type: string;
      data: string;
    }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTestType = (type: string) => {
    setSelectedTestTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxFileSize = 2 * 1024 * 1024; // 2MB
    const maxFiles = 5;

    if (attachedFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > maxFileSize) {
        toast.error(`${file.name} is too large. Max size is 2MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          data: event.target?.result as string,
        };
        setAttachedFiles((prev) => [...prev, newFile]);
        toast.success(`${file.name} attached successfully`);
      };
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.success("File removed");
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf"))
      return <FaFilePdf className="text-xl text-red-500" />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <FaFileWord className="text-xl text-blue-500" />;
    if (fileType.includes("image"))
      return <FaFileImage className="text-xl text-green-500" />;
    return <FaFile className="text-xl text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="my-6 rounded-lg border border-gray-300 bg-white shadow-sm">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md">
              <IoSparkles className="text-xl text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI Test Case Generator
              </h3>
              <p className="text-sm text-gray-600">Powered by Navagi AI</p>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              Beta
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-4">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Select Test Types
          </label>
          <div className="flex gap-4">
            {/* Functional Testing Checkbox */}
            <div
              onClick={() => toggleTestType("functional")}
              className={`flex flex-1 cursor-pointer flex-col items-center rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                selectedTestTypes.includes("functional")
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="mb-2 flex items-center justify-center">
                {selectedTestTypes.includes("functional") ? (
                  <MdCheckBox className="text-3xl text-green-600" />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-3xl text-gray-400" />
                )}
              </div>
              <FaCheckCircle
                className={`mb-2 text-3xl ${
                  selectedTestTypes.includes("functional")
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span className="text-center text-sm font-semibold text-gray-800">
                Functional
              </span>
              <span className="mt-1 text-center text-xs text-gray-500">
                Feature flows
              </span>
            </div>

            {/* Non-Functional Testing Checkbox */}
            <div
              onClick={() => toggleTestType("non-functional")}
              className={`flex flex-1 cursor-pointer flex-col items-center rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                selectedTestTypes.includes("non-functional")
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="mb-2 flex items-center justify-center">
                {selectedTestTypes.includes("non-functional") ? (
                  <MdCheckBox className="text-3xl text-blue-600" />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-3xl text-gray-400" />
                )}
              </div>
              <FaCog
                className={`mb-2 text-3xl ${
                  selectedTestTypes.includes("non-functional")
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              />
              <span className="text-center text-sm font-semibold text-gray-800">
                Non-Functional
              </span>
              <span className="mt-1 text-center text-xs text-gray-500">
                Usability & reliability
              </span>
            </div>

            {/* Performance Testing Checkbox */}
            <div
              onClick={() => toggleTestType("performance")}
              className={`flex flex-1 cursor-pointer flex-col items-center rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                selectedTestTypes.includes("performance")
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="mb-2 flex items-center justify-center">
                {selectedTestTypes.includes("performance") ? (
                  <MdCheckBox className="text-3xl text-orange-600" />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-3xl text-gray-400" />
                )}
              </div>
              <FaTachometerAlt
                className={`mb-2 text-3xl ${
                  selectedTestTypes.includes("performance")
                    ? "text-orange-600"
                    : "text-gray-400"
                }`}
              />
              <span className="text-center text-sm font-semibold text-gray-800">
                Performance
              </span>
              <span className="mt-1 text-center text-xs text-gray-500">
                Load & stress tests
              </span>
            </div>
          </div>
        </div>

        {/* File Attachment Section (Optional) */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Attach Reference Documents (Optional)
          </label>
          <p className="mb-3 text-xs text-gray-500">
            Upload requirements, specs, or related documents to help AI generate
            better test cases
          </p>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Button */}
          {attachedFiles.length < 5 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mb-3 flex w-full items-center justify-center gap-x-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 transition-all hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <MdAttachFile className="text-xl" />
              <span>Attach Files</span>
              <span className="text-xs text-gray-500">
                ({attachedFiles.length}/5)
              </span>
            </button>
          )}

          {/* Attached Files List */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2.5 transition-all hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-x-2">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-gray-800">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="ml-2 flex-shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
                  >
                    <MdClose className="text-base" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
          <div className="flex gap-x-2">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium">AI will analyze your user story</p>
              <p className="mt-1 text-blue-700">
                Test cases will be generated based on acceptance criteria, edge
                cases, and best practices.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-x-3">
          <Button
            customColors
            disabled={selectedTestTypes.length === 0}
            className="flex flex-1 items-center justify-center gap-x-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-purple-600 disabled:hover:to-indigo-600"
          >
            <IoSparkles className="text-lg" />
            <span>
              Generate Test Cases
              {selectedTestTypes.length > 0 && ` (${selectedTestTypes.length})`}
            </span>
          </Button>
          <Button
            customColors
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export { IssueDetailsInfo };
