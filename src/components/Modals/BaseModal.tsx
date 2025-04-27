import React, { ReactNode } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actionButtons?: ReactNode;
}

const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  actionButtons,
}: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-2xl mb-4 text-center">{title}</h3>
        {children}
        <div className="modal-action flex flex-row justify-between mt-6">
          {actionButtons || (
            <button className="btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default BaseModal;
