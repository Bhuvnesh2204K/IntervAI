"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback, createInterview, extractInterviewDetails, finalizeInterview } from "@/lib/actions/general.action";
import { getBehavioralQuestionsForRole } from "@/constants/behavioralQuestions";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  role,
  techstack,
  interviewType,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  // Environment validation
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    console.log("Environment check:", {
      hasVapiToken: !!token,
      hasAssistantId: !!assistantId,
      tokenLength: token?.length,
      assistantIdLength: assistantId?.length,
    });
    
    if (!token) {
      console.error("NEXT_PUBLIC_VAPI_WEB_TOKEN is missing");
    }
    
    if (!assistantId) {
      console.error("NEXT_PUBLIC_VAPI_ASSISTANT_ID is missing");
    }
  }, []);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
      
      // Handle specific error types
      if (error.message?.includes("ejection")) {
        console.log("Call was ejected - this might be due to network issues or browser permissions");
      } else if (error.message?.includes("permission")) {
        console.log("Microphone permission denied - please allow microphone access");
      } else if (error.message?.includes("network")) {
        console.log("Network error - please check your internet connection");
      }
      
      setCallStatus(CallStatus.INACTIVE);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    const handleSaveInterview = async () => {
      if (!userId) return;
      if (!messages || messages.length === 0) {
        console.warn("No transcript messages to extract interview details from.");
        return;
      }
      
      // For interviews that already have an ID (including static interviews), just finalize them
      if (interviewId) {
        const finalizeResult = await finalizeInterview(interviewId);
        if (finalizeResult?.success) {
          console.log("Interview finalized successfully");
        } else {
          console.error("Failed to finalize interview");
        }
        return;
      }
      
      // Extract interview details from transcript for dynamic interviews
      const details = await extractInterviewDetails(messages);
      if (!details) {
        console.warn("AI extraction failed, saving default interview.");
        await createInterview({
          userId,
          role: role || "Software Engineer",
          type: interviewType || "Technical",
          techstack: techstack || ["react", "nodejs", "aws"],
          finalized: true,
        });
        return;
      }
      const result = await createInterview({
        userId,
        role: details.role,
        type: details.type,
        techstack: details.techstack,
        finalized: true,
      });
      if (!result?.success) {
        console.error("Interview creation failed.", result);
      } else {
        console.log("Interview saved successfully.", result);
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      handleSaveInterview();
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId, role, techstack, interviewType]);

  const handleCall = async () => {
    try {
      console.log("handleCall triggered");
      console.log("Props:", { userName, userId, interviewId, feedbackId, type, questions, role, techstack, interviewType });
      setCallStatus(CallStatus.CONNECTING);

      // Debug: Check if token is available
      const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
      console.log("Vapi token available:", !!token);
      console.log("Token length:", token?.length);
      console.log("Token starts with:", token?.substring(0, 10) + "...");
      
      if (!token) {
        throw new Error("VAPI_WEB_TOKEN is not configured");
      }

      // Debug: Check Vapi instance
      console.log("Vapi instance:", vapi);
      console.log("Vapi instance type:", typeof vapi);

      if (type === "generate") {
        // For assistant-based calls (using assistant ID)
        const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        if (!assistantId) {
          throw new Error("NEXT_PUBLIC_VAPI_ASSISTANT_ID is not configured");
        }
        
        console.log("Starting assistant call with ID:", assistantId);
        await vapi.start(assistantId, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        // For interview-based calls, use dynamic assistant config
        let formattedQuestions = "";
        if (questions && questions.length > 0) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        // Get questions based on interview type
        let technicalQuestionsPrompt = "";
        let behavioralQuestionsPrompt = "";
        
        if (interviewType === "Technical" || interviewType === "Mixed") {
          // Include technical questions
          if (questions && questions.length > 0) {
            const formattedQuestions = questions
              .map((question) => `- ${question}`)
              .join("\n");
            technicalQuestionsPrompt = `\n\nTECHNICAL QUESTIONS TO ASK:\n${formattedQuestions}`;
          }
        }
        
        if (interviewType === "Behavioral" || interviewType === "Mixed") {
          // Include behavioral questions
          const behavioralQuestions = getBehavioralQuestionsForRole(role || "Software Engineer", 3);
          const formattedBehavioralQuestions = behavioralQuestions
            .map((q, index) => `${index + 1}. ${q.question}`)
            .join("\n");
          behavioralQuestionsPrompt = `\n\nBEHAVIORAL QUESTIONS TO ASK:\n${formattedBehavioralQuestions}`;
        }

        const jobProfilePrompt = `INTERVIEW JOB PROFILE:\n- Role: ${role || "Software Engineer"}\n- Tech Stack: ${(techstack && techstack.length > 0) ? techstack.join(", ") : "General"}\n- Type: ${interviewType || "Mixed"}`;
        
        const basePrompt = interviewer.model && interviewer.model.messages && interviewer.model.messages[0]?.content ? `\n\n${interviewer.model.messages[0].content}` : "";
        const finalPrompt = `${jobProfilePrompt}${technicalQuestionsPrompt}${behavioralQuestionsPrompt}${basePrompt}`;
        console.log("Final system prompt for assistant:", finalPrompt);

        // Set appropriate first message based on interview type
        let firstMessage = interviewer.firstMessage;
        if (interviewType === "Technical") {
          firstMessage = "Hello! I'm your interviewer today. I'll be asking you technical questions to assess your programming skills, problem-solving abilities, and technical knowledge. Please speak clearly and take your time with your responses.";
        } else if (interviewType === "Behavioral") {
          firstMessage = "Hello! I'm your interviewer today. I'll be asking you behavioral questions to assess your soft skills, past experiences, and how you handle various situations. Please speak clearly and take your time with your responses.";
        } else if (interviewType === "Mixed") {
          firstMessage = "Hello! I'm your interviewer today. I'll be asking you a mix of technical and behavioral questions to assess your skills, experience, and problem-solving abilities. Please speak clearly and take your time with your responses.";
        }

        const dynamicAssistant = {
          ...interviewer,
          name: role ? `${role} Interviewer` : interviewer.name,
          firstMessage: firstMessage,
          model: {
            provider: "openai" as const,
            model: "gpt-4",
            messages: [
              {
                role: "system" as const,
                content: finalPrompt,
              },
            ],
          },
        };

        console.log("Starting dynamic interview for role:", role, "techstack:", techstack, "type:", interviewType);
        console.log("Dynamic assistant config:", dynamicAssistant);
        
        // Add more detailed error handling for the vapi.start call
        try {
          await vapi.start(dynamicAssistant as any, {
            variableValues: {
              questions: formattedQuestions,
            },
          });
          console.log("Vapi call started successfully");
        } catch (vapiError) {
          console.error("Vapi start error details:", {
            error: vapiError,
            message: (vapiError as any)?.message,
            status: (vapiError as any)?.status,
            response: (vapiError as any)?.response,
          });
          throw vapiError;
        }
      }
    } catch (error) {
      // Enhanced error logging
      const err = error as any;
      console.error("Error starting call:", {
        error: error,
        message: err?.message,
        status: err?.status,
        response: err?.response,
        stack: err?.stack,
      });
      setCallStatus(CallStatus.INACTIVE);
      // Optionally, show a user-friendly error message here
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
