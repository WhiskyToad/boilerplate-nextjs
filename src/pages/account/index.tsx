import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { FiCreditCard, FiLock, FiMail } from "react-icons/fi";
import { useAuthStore } from "@/features/store/authStore";
import RequireAuth from "@/features/guards/RequireAuth";
import AccountHeader from "@/features/account/AccountHeader";
import SubscriptionSettings from "@/features/account/SubscriptionSettings";
import SecuritySettings from "@/features/account/SecuritySettings";
import EmailSettings from "@/features/account/EmailSettings";

const AccountPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tab = "email" } = router.query;

  const tabs = [
    {
      name: "email",
      label: "Email",
      icon: <FiMail />,
      component: <EmailSettings />,
    },
    {
      name: "subscription",
      label: "Subscription",
      icon: <FiCreditCard />,
      component: <SubscriptionSettings />,
    },
    {
      name: "security",
      label: "Security",
      icon: <FiLock />,
      component: <SecuritySettings />,
    },
  ];

  const activeTab = tabs.find((t) => t.name === tab) || tabs[0];

  return (
    <RequireAuth>
      <div className="min-h-screen bg-base-200">
        <Head>
          <title>Account Settings | Boost Toad</title>
        </Head>

        <main className="container mx-auto py-8 px-4">
          <AccountHeader user={user} />

          <div className="mt-8 bg-base-100 rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Sidebar for larger screens */}
              <div className="hidden sm:block bg-base-200 p-4 sm:w-64">
                <ul className="menu p-0">
                  {tabs.map((t) => (
                    <li key={t.name}>
                      <Link
                        href={`/account?tab=${t.name}`}
                        shallow
                        className={`flex items-center py-3 px-4 rounded-lg transition-colors mb-1 ${
                          tab === t.name
                            ? "bg-primary text-primary-content"
                            : "hover:bg-base-300"
                        }`}
                      >
                        <span className="mr-3">{t.icon}</span>
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tabs for smaller screens */}
              <div className="sm:hidden tabs tabs-bordered p-2 overflow-x-auto bg-base-200">
                {tabs.map((t) => (
                  <Link
                    key={t.name}
                    href={`/account?tab=${t.name}`}
                    shallow
                    role="tab"
                    className={`tab flex-nowrap ${
                      tab === t.name ? "tab-active" : ""
                    }`}
                  >
                    <span className="mr-2 sm:mr-3">{t.icon}</span>
                    {t.label}
                  </Link>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 bg-base-100">
                {activeTab.component}
              </div>
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AccountPage;
