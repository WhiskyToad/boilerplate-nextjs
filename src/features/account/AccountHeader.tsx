import React from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { FiArrowLeft } from "react-icons/fi";

interface AccountHeaderProps {
  user: User | null;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ user }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <div className="flex items-center mb-3">
          <Link href="/projects" className="text-primary mr-3">
            <FiArrowLeft />
          </Link>
          <h1 className="text-3xl font-bold">Account Settings</h1>
        </div>
        <p className="text-base-content/70">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="mt-3 md:mt-0 bg-base-100 p-4 rounded-lg shadow-sm">
        <div className="text-sm text-base-content/70">Signed in as:</div>
        <div className="font-medium">{user?.email}</div>
      </div>
    </div>
  );
};

export default AccountHeader;
