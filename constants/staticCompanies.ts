/**
 * Configuration for static company interviews
 * 
 * To add a new static company:
 * 1. Add a new entry to STATIC_COMPANIES array
 * 2. Ensure the coverImage exists in /public/covers/
 * 3. The id should follow the pattern: "static-{companyname}"
 * 4. The techstack should use lowercase tech names that match DisplayTechIcons component
 */
export interface StaticCompany {
  id: string;
  name: string;
  role: string;
  type: string;
  techstack: string[];
  coverImage: string;
  description?: string;
}

export const STATIC_COMPANIES: StaticCompany[] = [
  {
    id: "static-google",
    name: "Google",
    role: "Software Engineer",
    type: "Mixed",
    techstack: ["react", "nodejs", "aws", "typescript"],
    coverImage: "/covers/adobe.png", // Using available image
    description: "Comprehensive interview covering technical skills and behavioral competencies"
  },
  {
    id: "static-amazon",
    name: "Amazon",
    role: "Software Development Engineer",
    type: "Mixed",
    techstack: ["java", "spring", "aws", "docker"],
    coverImage: "/covers/amazon.png",
    description: "Full assessment including technical expertise and leadership principles"
  },
  {
    id: "static-microsoft",
    name: "Microsoft",
    role: "Software Engineer",
    type: "Mixed",
    techstack: ["csharp", "dotnet", "azure", "sql"],
    coverImage: "/covers/skype.png", // Using available image
    description: "Balanced interview with technical depth and behavioral assessment"
  },
  {
    id: "static-meta",
    name: "Meta",
    role: "Frontend Engineer",
    type: "Mixed",
    techstack: ["react", "javascript", "php", "graphql"],
    coverImage: "/covers/facebook.png",
    description: "Comprehensive evaluation of technical skills and cultural fit"
  },
  {
    id: "static-spotify",
    name: "Spotify",
    role: "Backend Engineer",
    type: "Mixed",
    techstack: ["python", "django", "postgresql", "redis"],
    coverImage: "/covers/spotify.png",
    description: "Full-stack assessment including technical and behavioral competencies"
  },
  {
    id: "static-netflix",
    name: "Netflix",
    role: "Full Stack Engineer",
    type: "Mixed",
    techstack: ["javascript", "react", "nodejs", "aws"],
    coverImage: "/covers/reddit.png", // Using available image
    description: "Comprehensive full-stack assessment with focus on scalability and performance"
  },
  {
    id: "static-apple",
    name: "Apple",
    role: "iOS Developer",
    type: "Mixed",
    techstack: ["swift", "ios", "xcode", "cocoa"],
    coverImage: "/covers/pinterest.png", // Using available image
    description: "iOS development assessment with focus on user experience and performance"
  },
  {
    id: "static-uber",
    name: "Uber",
    role: "Mobile Engineer",
    type: "Mixed",
    techstack: ["reactnative", "javascript", "aws", "mongodb"],
    coverImage: "/covers/telegram.png", // Using available image
    description: "Mobile development assessment with real-time systems focus"
  }
];

export function getStaticCompanyById(id: string): StaticCompany | undefined {
  return STATIC_COMPANIES.find(company => company.id === id);
}

export function getAllStaticCompanies(): StaticCompany[] {
  return STATIC_COMPANIES;
} 