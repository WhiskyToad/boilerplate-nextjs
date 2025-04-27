import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const CheckoutSuccess = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (session_id) {
      // Verify the checkout session was successful
      fetch(`/api/verify-checkout?session_id=${session_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setStatus("success");
          } else {
            setStatus("error");
          }
        })
        .catch(() => {
          setStatus("error");
        });
    }
  }, [session_id]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <h2 className="text-2xl font-bold">
            Confirming your subscription...
          </h2>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-error text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">
            We couldn&apos;t verify your subscription. Please contact support.
          </p>
          <Link href="/pricing">
            <button className="btn btn-primary">Back to Pricing</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="text-success text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-4">Subscription Successful!</h2>
        <p className="mb-6">
          Thank you for subscribing. Your account has been upgraded and you now
          have access to all features.
        </p>
        <Link href="/projects">
          <button className="btn btn-primary">Go to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
