"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { resetUserInterviews } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const ResetPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (!confirm("Are you sure you want to delete ALL your interviews and feedback? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const user = await getCurrentUser();
      if (!user?.id) {
        setMessage("Please sign in to reset your interviews");
        return;
      }

      const result = await resetUserInterviews(user.id);
      
      if (result.success) {
        setMessage(`✅ Reset completed! Deleted ${result.deletedInterviews} interviews and ${result.deletedFeedback} feedback records.`);
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setMessage(`❌ Error: ${result.error || 'Failed to reset interviews'}`);
      }
    } catch (error) {
      console.error("Error during reset:", error);
      setMessage("❌ An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-50 flex flex-col items-center justify-center py-12 px-2">
      <h1 className="text-3xl font-bold mb-8 text-red-800">Reset Interview History</h1>
      <div className="bg-red-100 border-2 border-red-400 rounded-lg p-6 mb-8 w-full max-w-xl">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">⚠️</span>
          <span className="text-xl font-bold text-red-900">Warning</span>
        </div>
        <p className="text-red-900 text-base mb-2">
          This action will permanently delete <span className="font-bold">all</span> of your:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li className="text-black font-semibold">Completed interviews</li>
          <li className="text-black font-semibold">Interview feedback and scores</li>
          <li className="text-black font-semibold">Interview history</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xl">
        <Button
          onClick={handleReset}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? "Resetting..." : "Reset My Interview History"}
        </Button>
        {message && (
          <div className="text-center text-base font-semibold text-red-700 mt-2">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPage; 