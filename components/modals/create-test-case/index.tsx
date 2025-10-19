"use client";
import { useState, type ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { CreateTestCaseForm } from "./form";

interface CreateTestCaseModalProps {
  children: ReactNode;
  folderId: string;
  folderName: string;
  onTestCaseCreated: () => void;
}

const CreateTestCaseModal: React.FC<CreateTestCaseModalProps> = ({
  children,
  folderId,
  folderName,
  onTestCaseCreated,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className="max-w-2xl">
          <ModalTitle>Create New Test Case</ModalTitle>
          <ModalDescription>
            Fill in the details below to create a new test case. You can add
            test steps after creating the test case.
          </ModalDescription>
          <CreateTestCaseForm
            folderId={folderId}
            folderName={folderName}
            setModalIsOpen={setIsOpen}
            onTestCaseCreated={onTestCaseCreated}
          />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};

export { CreateTestCaseModal };
