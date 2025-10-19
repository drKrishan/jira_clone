import { NotImplemented } from "@/components/not-implemented";
import { ChildrenTreeIcon } from "@/components/svgs";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { BiLink } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { useState } from "react";
import { IssueAttachments } from "./issue-attachments";

const IssueDetailsInfoActions: React.FC<{
  onAddChildIssue: () => void;
  variant?: "sm" | "lg";
}> = ({ onAddChildIssue, variant = "sm" }) => {
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);

  return (
    <div className="flex gap-x-2 text-gray-700">
      <TooltipWrapper text="Attach files">
        <Button
          onClick={() => setIsAttachmentModalOpen(true)}
          customColors
          className="flex items-center whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <CgAttachment className="rotate-45 text-xl" />
          <span
            data-state={variant === "sm" ? "sm" : "lg"}
            className="whitespace-nowrap text-sm  font-medium [&[data-state=lg]]:ml-2"
          >
            {variant === "sm" ? null : "Attach"}
          </span>
        </Button>
      </TooltipWrapper>
      <TooltipWrapper text="Add child issue">
        <Button
          onClick={onAddChildIssue}
          customColors
          className="flex items-center whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <ChildrenTreeIcon />
          <span
            data-state={variant === "sm" ? "sm" : "lg"}
            className="whitespace-nowrap text-sm  font-medium [&[data-state=lg]]:ml-2"
          >
            {variant === "sm" ? null : "Add a child issue"}
          </span>
        </Button>
      </TooltipWrapper>
      <NotImplemented feature="link">
        <Button
          customColors
          className="flex items-center whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <BiLink className="text-xl" />
          <span
            data-state={variant === "sm" ? "sm" : "lg"}
            className="whitespace-nowrap text-sm  font-medium [&[data-state=lg]]:ml-2"
          >
            {variant === "sm" ? null : "Link issue"}
          </span>
        </Button>
      </NotImplemented>
      <NotImplemented feature="add apps">
        <Button
          customColors
          className="flex items-center whitespace-nowrap bg-gray-100 hover:bg-gray-200"
        >
          <BsThreeDots className="text-xl" />
        </Button>
      </NotImplemented>

      {/* Attachment Modal */}
      <IssueAttachments
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
      />
    </div>
  );
};

export { IssueDetailsInfoActions };
