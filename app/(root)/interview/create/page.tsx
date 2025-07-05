"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInterview } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const CreateInterviewPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "",
    type: "Mixed",
    techstack: "",
    description: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await getCurrentUser();
      if (!user?.id) {
        alert("Please sign in to create interviews");
        return;
      }

      // Prepare data for question generation
      const techstackArray = formData.techstack
        .split(",")
        .map(tech => tech.trim().toLowerCase())
        .filter(tech => tech.length > 0);
      const techstackString = techstackArray.join(", ");

      // Call the question generation API
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          role: formData.role,
          level: "",
          techstack: techstackString,
          amount: 8,
          userid: user.id,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        setError("Failed to generate questions. Please try again.");
        setIsLoading(false);
        return;
      }

      // Fetch the latest interview created for this user (since the API creates and saves it)
      // Or, if you want to create it yourself, you can use data.questions
      // But the current API already saves the interview, so just redirect to /interview
      router.push("/interview");
    } catch (error) {
      console.error("Error creating interview:", error);
      setError("Error creating interview");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create New Interview</h1>
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="role">Job Role</Label>
          <Input
            id="role"
            type="text"
            placeholder="e.g., Software Engineer, Frontend Developer"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Interview Type</Label>
          <select
            id="type"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="Mixed">Mixed (Technical + Behavioral)</option>
            <option value="Technical">Technical Only</option>
            <option value="Behavioral">Behavioral Only</option>
          </select>
        </div>

        <div>
          <Label htmlFor="techstack">Tech Stack (comma-separated)</Label>
          <Input
            id="techstack"
            type="text"
            placeholder="e.g., react, nodejs, aws, typescript"
            value={formData.techstack}
            onChange={(e) => setFormData({ ...formData, techstack: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <textarea
            id="description"
            className="w-full p-2 border border-gray-300 rounded-md h-24"
            placeholder="Brief description of the interview focus..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Generating Questions..." : "Create Interview"}
        </Button>
      </form>
    </div>
  );
};

export default CreateInterviewPage; 