import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-base-100/80 z-50">
      <div className="flex flex-col items-center">
        <div className="loader border-t-4 border-primary rounded-full w-16 h-16 animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-base-content">
          Generating, please wait...
        </p>
        <p className="text-sm text-base-content/70">
          This one takes a minute, sorry for the wait!
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
