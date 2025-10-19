import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaFilePdf, FaFileWord, FaFileImage, FaFile } from "react-icons/fa";
import { MdClose, MdCloudUpload } from "react-icons/md";
import toast from "react-hot-toast";
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalPortal,
} from "@/components/ui/modal";

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string;
}

const IssueAttachments: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxFileSize = 2 * 1024 * 1024; // 2MB
    const maxFiles = 10;

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
      return <FaFilePdf className="text-3xl text-red-500" />;
    if (fileType.includes("word") || fileType.includes("document"))
      return <FaFileWord className="text-3xl text-blue-500" />;
    if (fileType.includes("image"))
      return <FaFileImage className="text-3xl text-green-500" />;
    return <FaFile className="text-3xl text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="h-fit max-h-[80vh] w-[600px] overflow-hidden">
          <div className="flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Attachments
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Upload files related to this issue
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                >
                  <MdClose className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {/* Upload Button */}
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={attachedFiles.length >= 10}
                  className="group w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-indigo-400 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MdCloudUpload className="mx-auto mb-3 text-5xl text-gray-400 transition-colors group-hover:text-indigo-500" />
                  <p className="text-lg font-medium text-gray-700">
                    Click to upload files
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    PDF, Word, Images • Max 2MB per file
                  </p>
                  <p className="mt-2 text-xs font-medium text-gray-600">
                    {attachedFiles.length}/10 files uploaded
                  </p>
                </button>
              </div>

              {/* Attached Files List */}
              {attachedFiles.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">
                    Uploaded Files ({attachedFiles.length})
                  </h3>
                  <div className="space-y-3">
                    {attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-x-4">
                          <div className="flex-shrink-0">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="ml-4 flex-shrink-0 rounded-md p-2 text-gray-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
                        >
                          <MdClose className="text-xl" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                  <p className="text-sm text-gray-500">No files attached yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-end gap-x-3">
                <Button
                  customColors
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  customColors
                  onClick={() => {
                    toast.success(
                      `${attachedFiles.length} file(s) attached to issue`
                    );
                    onClose();
                  }}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { IssueAttachments };
