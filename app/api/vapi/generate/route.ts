import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview based on the specified type.

        Job Role: ${role}
        Experience Level: ${level}
        Tech Stack: ${techstack}
        Interview Type: ${type}
        Number of Questions: ${amount}

        IMPORTANT: Generate questions based on the interview type:
        
        - If type is "Technical": Generate ONLY technical questions related to programming, algorithms, system design, and the specified tech stack (${techstack}). NO behavioral questions.
        
        - If type is "Behavioral": Generate ONLY behavioral questions about teamwork, leadership, problem-solving, past experiences, and soft skills. NO technical questions.
        
        - If type is "Mixed": Generate a balanced mix of technical and behavioral questions (roughly 50% each).
        
        Examples:
        - Technical questions: "Explain how you would implement a binary search tree", "What are the differences between REST and GraphQL APIs?"
        - Behavioral questions: "Tell me about a time you had to resolve a conflict with a team member", "How do you handle tight deadlines?"
        
        Return ONLY the questions in this exact format:
        ["Question 1", "Question 2", "Question 3"]
        
        Do not include any explanations or additional text.
    `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
