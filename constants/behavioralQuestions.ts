export interface BehavioralQuestion {
  id: string;
  question: string;
  category: string;
  followUp?: string[];
  tips?: string;
}

export const BEHAVIORAL_QUESTIONS: BehavioralQuestion[] = [
  // Leadership & Teamwork
  {
    id: "leadership-1",
    question: "Tell me about a time when you had to lead a team through a difficult project. What was the challenge and how did you handle it?",
    category: "Leadership",
    followUp: [
      "What was the outcome?",
      "What would you do differently?",
      "How did you motivate your team?"
    ],
    tips: "Use STAR method: Situation, Task, Action, Result"
  },
  {
    id: "teamwork-1",
    question: "Describe a situation where you had to work with someone who had a different opinion or approach than yours. How did you handle it?",
    category: "Teamwork",
    followUp: [
      "What was the final outcome?",
      "How did you find common ground?",
      "What did you learn from this experience?"
    ]
  },
  {
    id: "conflict-1",
    question: "Tell me about a time when you had a conflict with a colleague. How did you resolve it?",
    category: "Conflict Resolution",
    followUp: [
      "What was the root cause of the conflict?",
      "How did you approach the conversation?",
      "What was the long-term impact on your working relationship?"
    ]
  },

  // Problem Solving & Adaptability
  {
    id: "problem-solving-1",
    question: "Describe a time when you faced a complex technical problem that seemed impossible to solve. How did you approach it?",
    category: "Problem Solving",
    followUp: [
      "What was your step-by-step approach?",
      "How did you break down the problem?",
      "What resources did you use?"
    ]
  },
  {
    id: "adaptability-1",
    question: "Tell me about a time when you had to quickly learn a new technology or skill for a project. How did you handle the learning curve?",
    category: "Adaptability",
    followUp: [
      "How did you prioritize what to learn?",
      "What was your learning strategy?",
      "How did you apply your new knowledge?"
    ]
  },
  {
    id: "failure-1",
    question: "Describe a time when you failed at something. What did you learn from that experience?",
    category: "Learning from Failure",
    followUp: [
      "What was the specific failure?",
      "How did you bounce back?",
      "What would you do differently now?"
    ]
  },

  // Communication & Collaboration
  {
    id: "communication-1",
    question: "Tell me about a time when you had to explain a complex technical concept to a non-technical person. How did you approach it?",
    category: "Communication",
    followUp: [
      "How did you know they understood?",
      "What analogies or examples did you use?",
      "How did you handle any confusion?"
    ]
  },
  {
    id: "feedback-1",
    question: "Describe a time when you received difficult feedback. How did you handle it and what did you do with that feedback?",
    category: "Receiving Feedback",
    followUp: [
      "What was the feedback about?",
      "How did you initially react?",
      "What specific changes did you make?"
    ]
  },
  {
    id: "presentation-1",
    question: "Tell me about a time when you had to present your work to stakeholders or senior management. How did you prepare and how did it go?",
    category: "Presentation Skills",
    followUp: [
      "How did you structure your presentation?",
      "What questions did you receive?",
      "How did you handle any difficult questions?"
    ]
  },

  // Initiative & Drive
  {
    id: "initiative-1",
    question: "Describe a time when you took initiative to improve a process or solve a problem that wasn't part of your regular responsibilities.",
    category: "Initiative",
    followUp: [
      "What motivated you to take action?",
      "What was the impact of your initiative?",
      "How did others react to your initiative?"
    ]
  },
  {
    id: "motivation-1",
    question: "Tell me about a time when you were working on a project that you weren't particularly excited about. How did you stay motivated?",
    category: "Motivation",
    followUp: [
      "What was the project about?",
      "How did you find meaning in the work?",
      "What was the final outcome?"
    ]
  },

  // Technical Leadership & Mentoring
  {
    id: "mentoring-1",
    question: "Describe a time when you mentored or helped a junior developer. What was the situation and how did you help them grow?",
    category: "Mentoring",
    followUp: [
      "What specific skills did you help them develop?",
      "How did you measure their progress?",
      "What did you learn from the mentoring experience?"
    ]
  },
  {
    id: "code-review-1",
    question: "Tell me about a time when you had to give difficult feedback during a code review. How did you approach it?",
    category: "Code Review",
    followUp: [
      "What was the specific issue?",
      "How did you frame your feedback?",
      "How did the developer respond?"
    ]
  },

  // Project Management & Organization
  {
    id: "deadline-1",
    question: "Describe a time when you had to meet a tight deadline. How did you prioritize and manage your time?",
    category: "Time Management",
    followUp: [
      "What was the deadline?",
      "How did you prioritize tasks?",
      "What sacrifices did you have to make?"
    ]
  },
  {
    id: "multitasking-1",
    question: "Tell me about a time when you had to juggle multiple projects or responsibilities simultaneously. How did you manage it?",
    category: "Multitasking",
    followUp: [
      "How did you prioritize between projects?",
      "What tools or methods did you use?",
      "What was the outcome of each project?"
    ]
  }
];

export function getBehavioralQuestionsByCategory(category?: string): BehavioralQuestion[] {
  if (!category) return BEHAVIORAL_QUESTIONS;
  return BEHAVIORAL_QUESTIONS.filter(q => q.category === category);
}

export function getRandomBehavioralQuestions(count: number = 3): BehavioralQuestion[] {
  const shuffled = [...BEHAVIORAL_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getBehavioralQuestionsForRole(role: string, count: number = 3): BehavioralQuestion[] {
  // Map roles to relevant behavioral categories
  const roleCategories: Record<string, string[]> = {
    "Software Engineer": ["Problem Solving", "Teamwork", "Communication", "Adaptability"],
    "Frontend Engineer": ["Problem Solving", "Communication", "Adaptability", "Code Review"],
    "Backend Engineer": ["Problem Solving", "System Design", "Communication", "Adaptability"],
    "Full Stack Developer": ["Problem Solving", "Teamwork", "Communication", "Multitasking"],
    "Senior Software Engineer": ["Leadership", "Mentoring", "Problem Solving", "Communication"],
    "Software Development Engineer": ["Problem Solving", "Teamwork", "Communication", "Initiative"],
    "iOS Developer": ["Problem Solving", "Communication", "Adaptability", "Code Review"],
    "Android Developer": ["Problem Solving", "Communication", "Adaptability", "Code Review"],
    "DevOps Engineer": ["Problem Solving", "Communication", "Adaptability", "Initiative"],
    "Data Engineer": ["Problem Solving", "Communication", "Adaptability", "System Design"]
  };

  const categories = roleCategories[role] || ["Problem Solving", "Communication", "Teamwork"];
  const relevantQuestions = BEHAVIORAL_QUESTIONS.filter(q => 
    categories.includes(q.category)
  );
  
  const shuffled = [...relevantQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 