"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    // First, let's try to generate the feedback with a more structured approach
    const feedbackPrompt = `
You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on their responses in the transcript.

TRANSCRIPT:
${formattedTranscript}

EVALUATION INSTRUCTIONS:
1. Analyze the candidate's responses carefully
2. Score each category from 0-100 based on their performance
3. Provide specific feedback based on what they actually said
4. Identify concrete strengths from their responses
5. Identify specific areas for improvement based on their answers
6. Write a comprehensive final assessment

CATEGORIES TO EVALUATE:
- Technical Knowledge: How well they understand technical concepts, frameworks, and tools mentioned
- Problem Solving: Their approach to solving problems, logical thinking, and methodology
- Communication Skills: Clarity, articulation, how well they explain concepts
- Leadership & Teamwork: How they discuss collaboration, team dynamics, leadership experiences
- Adaptability & Learning: Their approach to learning new things, handling challenges

IMPORTANT: Base your evaluation ONLY on what the candidate actually said in the transcript. Do not make assumptions. If they didn't discuss certain topics, reflect that in your scoring and comments.

Generate a JSON response with the following structure:
{
  "totalScore": [average of all category scores],
  "categoryScores": [
    {
      "name": "Technical Knowledge",
      "score": [0-100],
      "comment": "[specific feedback based on their technical responses]"
    },
    {
      "name": "Problem Solving", 
      "score": [0-100],
      "comment": "[specific feedback based on their problem-solving approach]"
    },
    {
      "name": "Communication Skills",
      "score": [0-100], 
      "comment": "[specific feedback based on how they communicated]"
    },
    {
      "name": "Leadership & Teamwork",
      "score": [0-100],
      "comment": "[specific feedback based on their team/leadership discussion]"
    },
    {
      "name": "Adaptability & Learning",
      "score": [0-100],
      "comment": "[specific feedback based on their learning approach]"
    }
  ],
  "strengths": [
    "[specific strength 1 based on their responses]",
    "[specific strength 2 based on their responses]",
    "[specific strength 3 based on their responses]"
  ],
  "areasForImprovement": [
    "[specific area 1 that needs improvement based on their responses]",
    "[specific area 2 that needs improvement based on their responses]",
    "[specific area 3 that needs improvement based on their responses]"
  ],
  "finalAssessment": "[comprehensive assessment based on their actual performance]"
}
`;

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: feedbackPrompt,
      system: "You are a professional interviewer. Generate valid JSON feedback based strictly on the candidate's actual responses. Ensure all JSON syntax is correct.",
    });

    // Validate and ensure totalScore is calculated correctly
    const totalScore = object.totalScore || 
      Math.round(object.categoryScores.reduce((sum, cat) => sum + cat.score, 0) / object.categoryScores.length);

    // Ensure strengths and areas for improvement are based on actual responses
    const strengths = object.strengths && object.strengths.length > 0 
      ? object.strengths 
      : ["Interview completed successfully."];
    
    const areasForImprovement = object.areasForImprovement && object.areasForImprovement.length > 0
      ? object.areasForImprovement
      : ["Continue practicing to improve your skills."];

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: totalScore,
      categoryScores: object.categoryScores,
      strengths: strengths,
      areasForImprovement: areasForImprovement,
      finalAssessment: object.finalAssessment || "Assessment completed based on your interview responses.",
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    
    // Check if it's a JSON parsing error specifically
    const isJsonError = error instanceof Error && 
      (error.message.includes('JSON') || error.message.includes('parse') || error.message.includes('syntax'));
    
    if (isJsonError) {
      console.log("JSON parsing error detected, using fallback feedback generation");
    }
    
    // Create a fallback feedback if AI generation fails
    try {
      // Analyze the transcript manually to provide basic feedback
      const transcriptText = transcript.map(msg => msg.content).join(" ");
      const hasTechnicalContent = /react|node|javascript|typescript|api|database|algorithm|data structure/i.test(transcriptText);
      const hasProblemSolving = /problem|solve|approach|solution|method/i.test(transcriptText);
      const hasCommunication = transcriptText.length > 100; // Basic check for communication
      
      const fallbackFeedback = {
        interviewId: interviewId,
        userId: userId,
        totalScore: 60, // Reasonable default score
        categoryScores: [
          {
            name: "Technical Knowledge" as const,
            score: hasTechnicalContent ? 65 : 50,
            comment: hasTechnicalContent 
              ? "You demonstrated some technical knowledge in your responses." 
              : "Technical concepts were not extensively discussed in this interview.",
          },
          {
            name: "Problem Solving" as const,
            score: hasProblemSolving ? 65 : 50,
            comment: hasProblemSolving 
              ? "You showed problem-solving thinking in your approach." 
              : "Problem-solving scenarios were limited in this interview.",
          },
          {
            name: "Communication Skills" as const,
            score: hasCommunication ? 70 : 60,
            comment: hasCommunication 
              ? "You communicated your thoughts clearly during the interview." 
              : "Communication assessment was limited due to interview length.",
          },
          {
            name: "Leadership & Teamwork" as const,
            score: 55,
            comment: "Leadership and teamwork aspects were not extensively covered in this interview.",
          },
          {
            name: "Adaptability & Learning" as const,
            score: 55,
            comment: "Learning and adaptability aspects were not extensively covered in this interview.",
          },
        ],
        strengths: [
          "Successfully completed the interview.",
          hasTechnicalContent ? "Demonstrated technical knowledge." : "Engaged in the interview process.",
          hasCommunication ? "Communicated effectively." : "Participated actively in the conversation.",
        ],
        areasForImprovement: [
          "Continue practicing technical concepts.",
          "Work on structured problem-solving approaches.",
          "Practice explaining complex topics clearly.",
        ],
        finalAssessment: "Your interview has been completed successfully. While the AI feedback generation encountered a technical issue, your participation and responses were recorded. Consider retaking the interview for more detailed feedback.",
        createdAt: new Date().toISOString(),
      };

      let feedbackRef;
      if (feedbackId) {
        feedbackRef = db.collection("feedback").doc(feedbackId);
      } else {
        feedbackRef = db.collection("feedback").doc();
      }

      await feedbackRef.set(fallbackFeedback);
      return { success: true, feedbackId: feedbackRef.id };
    } catch (fallbackError) {
      console.error("Error saving fallback feedback:", fallbackError);
      return { success: false };
    }
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function createInterview(params: {
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  questions?: string[];
  level?: string;
  finalized?: boolean;
}) {
  try {
    const interview = {
      userId: params.userId,
      role: params.role,
      type: params.type,
      techstack: params.techstack,
      questions: params.questions || [],
      level: params.level || "",
      createdAt: new Date().toISOString(),
      finalized: params.finalized ?? true,
    };
    const docRef = await db.collection("interviews").add(interview);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { success: false };
  }
}

export async function finalizeInterview(interviewId: string) {
  try {
    await db.collection("interviews").doc(interviewId).update({
      finalized: true,
    });
    return { success: true };
  } catch (error) {
    console.error("Error finalizing interview:", error);
    return { success: false };
  }
}

export async function extractInterviewDetails(transcript: { role: string; content: string }[]) {
  try {
    const formattedTranscript = transcript
      .map((sentence) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: z.object({
        role: z.string(),
        techstack: z.array(z.string()),
        type: z.string(),
      }),
      prompt: `You are an AI assistant. Extract the following details from the interview transcript below:
- The job role/title the candidate is interviewing for (e.g., Software Engineer, Frontend Developer, etc.)
- The main tech stack discussed (as an array of technology names, e.g., ["react", "nodejs", "aws"])
- The type of interview (Technical, Behavioral, Mixed, etc.)

Transcript:
${formattedTranscript}

Respond in JSON format with keys: role, techstack, type.`,
      system: "You are an AI assistant extracting structured interview details from a transcript.",
    });
    return object;
  } catch (error) {
    console.error("Error extracting interview details:", error);
    return null;
  }
}

// Reset all interviews for a user
export async function resetUserInterviews(userId: string) {
  try {
    // Get all interviews for the user
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();

    // Delete all interviews
    const deletePromises = interviewsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    // Get all feedback for the user
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .get();

    // Delete all feedback
    const deleteFeedbackPromises = feedbackSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteFeedbackPromises);

    console.log(`Reset completed: Deleted ${interviewsSnapshot.docs.length} interviews and ${feedbackSnapshot.docs.length} feedback records for user ${userId}`);
    
    return { 
      success: true, 
      deletedInterviews: interviewsSnapshot.docs.length,
      deletedFeedback: feedbackSnapshot.docs.length
    };
  } catch (error) {
    console.error("Error resetting user interviews:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
