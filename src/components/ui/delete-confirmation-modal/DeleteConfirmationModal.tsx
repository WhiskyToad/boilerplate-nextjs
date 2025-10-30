"use client";

import { Modal } from "../modal/Modal";
import { Button } from "../button/Button";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
  destructive?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message,
  itemName = "this item",
  loading = false,
  destructive = true,
}: DeleteConfirmationModalProps) {
  const defaultMessage = `Are you sure you want to delete ${itemName}? This action cannot be undone.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              destructive ? "bg-error/10" : "bg-warning/10"
            }`}
          >
            {destructive ? (
              <FiTrash2
                className={`w-6 h-6 ${
                  destructive ? "text-error" : "text-warning"
                }`}
              />
            ) : (
              <FiAlertTriangle
                className={`w-6 h-6 ${
                  destructive ? "text-error" : "text-warning"
                }`}
              />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-base-content mb-1">
              {title}
            </h3>
            <p className="text-base-content/70">{message || defaultMessage}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={"primary"}
            onClick={onConfirm}
            loading={loading}
            className="min-w-[100px]"
          >
            {destructive ? "Delete" : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
