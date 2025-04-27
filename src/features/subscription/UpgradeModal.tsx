import React from "react";
import { useRouter } from "next/router";
import { FiCheck, FiX } from "react-icons/fi";

type UpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    router.push("/pricing");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6 bg-gradient-to-r from-primary to-primary-focus text-white relative">
          <button
            className="absolute right-4 top-4 text-white hover:text-gray-200"
            onClick={onClose}
          >
            <FiX size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
          <p>This feature requires a premium subscription</p>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4">
            With a premium subscription, you get:
          </h3>

          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <FiCheck className="text-success mr-2" /> Unlimited projects
            </li>
            <li className="flex items-center">
              <FiCheck className="text-success mr-2" /> Feature prioritization
            </li>
            <li className="flex items-center">
              <FiCheck className="text-success mr-2" /> Roadmap planning
            </li>
            <li className="flex items-center">
              <FiCheck className="text-success mr-2" /> Task management
            </li>
            <li className="flex items-center">
              <FiCheck className="text-success mr-2" /> Launch preparation
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="btn btn-primary flex-1"
              onClick={handleUpgradeClick}
            >
              View Pricing Options
            </button>
            <button className="btn btn-ghost flex-1" onClick={onClose}>
              Stay on Free Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
