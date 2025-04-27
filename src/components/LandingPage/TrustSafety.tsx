import React from "react";
import { FiLock, FiShield } from "react-icons/fi"; // Example icons

const TrustSafety: React.FC = () => {
  return (
    <section className="py-12 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 p-4">
            <FiLock className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold">Your Data is Private</h3>
              <p className="text-sm text-base-content/70">
                We never share your project data or personal information. Fully
                GDPR-compliant.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 p-4">
            <FiShield className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold">Secure Infrastructure</h3>
              <p className="text-sm text-base-content/70">
                Built on secure Supabase infrastructure with SSL encryption.
                SOC-2 compliance pending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;
