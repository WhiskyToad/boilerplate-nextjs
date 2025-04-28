import React, { ReactNode, useEffect, useState } from "react";
import getSiteConfig from "@/utils/siteConfig";

interface ConfigLoaderProps {
  children: ReactNode;
}

const ConfigLoader: React.FC<ConfigLoaderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize the site configuration
    getSiteConfig();
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading site configuration...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ConfigLoader;
