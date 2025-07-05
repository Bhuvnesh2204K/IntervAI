import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { getAllStaticCompanies, getStaticCompanyById } from "@/constants/staticCompanies";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  // Get all static companies
  const staticCompanies = getAllStaticCompanies();
  
  // Filter static companies that the user hasn't completed yet
  const availableStaticCompanies = staticCompanies.filter(staticCompany => {
    // Check if user has already completed this static company interview
    const hasCompleted = userInterviews?.some(interview => 
      interview.role === staticCompany.role && 
      interview.type === staticCompany.type &&
      interview.techstack.join(',') === staticCompany.techstack.join(',')
    );
    return !hasCompleted;
  });

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <div className="flex gap-4 max-sm:flex-col">
            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Start an Interview</Link>
            </Button>
            <Button asChild variant="outline" className="max-sm:w-full">
              <Link href="/prepare">Prepare First</Link>
            </Button>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <div className="flex justify-between items-center">
          <h2>Your Interviews</h2>
          {hasPastInterviews && (
            <Button asChild variant="outline" size="sm">
              <Link href="/reset">Reset History</Link>
            </Button>
          )}
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <div className="flex justify-between items-center">
          <h2>Take Interviews</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/interview/create">Create Custom Interview</Link>
          </Button>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            availableStaticCompanies.map((company) => (
              <InterviewCard
                key={company.id}
                userId={user?.id}
                interviewId={company.id}
                role={company.role}
                type={company.type}
                techstack={company.techstack}
                createdAt={Date.now().toString()}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
