import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { createInterview } from "@/lib/actions/general.action";
import { getAllStaticCompanies } from "@/constants/staticCompanies";

interface RouteParams {
  params: Promise<{ company: string }>;
}

const StaticInterviewPage = async ({ params }: RouteParams) => {
  const { company } = await params;
  const user = await getCurrentUser();

  console.log("Static interview page - params:", { company, userId: user?.id });

  // Get the static company configuration by name
  const staticCompanies = getAllStaticCompanies();
  const staticCompany = staticCompanies.find(
    companyConfig => companyConfig.name.toLowerCase() === company.toLowerCase()
  );
  
  console.log("Static company found:", staticCompany);
  
  if (!staticCompany) {
    console.error("Static company not found for:", company);
    redirect("/");
  }

  // Create a new interview record for this static company interview
  let interviewResult;
  try {
    interviewResult = await createInterview({
      userId: user?.id!,
      role: staticCompany.role,
      type: staticCompany.type,
      techstack: staticCompany.techstack,
      finalized: false, // Will be set to true when interview is completed
    });

    console.log("Interview creation result:", interviewResult);

    if (!interviewResult?.success) {
      console.error("Failed to create interview record:", interviewResult);
      redirect("/");
    }
  } catch (error) {
    console.error("Error creating interview:", error);
    redirect("/");
  }

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={staticCompany.coverImage}
              alt={`${staticCompany.name} logo`}
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{staticCompany.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={staticCompany.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {staticCompany.type}
        </p>
      </div>

      {staticCompany.description && (
        <p className="text-muted-foreground mt-2 mb-4">
          {staticCompany.description}
        </p>
      )}

      <Agent
        userName={user?.name!}
        userId={user?.id}
        interviewId={interviewResult.id!} // Use the newly created interview ID
        type="interview"
        questions={[]} // Empty for static interviews - will be generated dynamically
        feedbackId={undefined}
        role={staticCompany.role}
        techstack={staticCompany.techstack}
        interviewType={staticCompany.type}
      />
    </>
  );
};

export default StaticInterviewPage; 