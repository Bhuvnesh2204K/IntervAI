import BehavioralQuestionsGuide from "@/components/BehavioralQuestionsGuide";

const PreparePage = () => {
  return (
    <div className="min-h-screen w-full bg-[#0a2342] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-white">Interview Preparation</h1>
          <p className="text-lg text-white">
            Prepare for your interviews with our comprehensive guides and practice resources.
          </p>
        </div>

        <div className="space-y-8">
          {/* Behavioral Questions Section */}
          <section>
            <BehavioralQuestionsGuide />
          </section>

          {/* General Interview Tips */}
          <section className="bg-[#15396a] border border-blue-900 shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">General Interview Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-white">Before the Interview</h3>
                <ul className="space-y-2 text-sm text-white">
                  <li>• Research the company and role thoroughly</li>
                  <li>• Review your resume and prepare specific examples</li>
                  <li>• Practice common technical and behavioral questions</li>
                  <li>• Prepare questions to ask the interviewer</li>
                  <li>• Test your microphone and internet connection</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-white">During the Interview</h3>
                <ul className="space-y-2 text-sm text-white">
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Use the STAR method for behavioral questions</li>
                  <li>• Provide specific examples and experiences</li>
                  <li>• Ask clarifying questions if needed</li>
                  <li>• Show enthusiasm and genuine interest</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Interview Tips */}
          <section className="bg-[#15396a] border border-blue-900 shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Technical Interview Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-white">Problem Solving</h3>
                <ul className="space-y-2 text-sm text-white">
                  <li>• Clarify the problem before starting</li>
                  <li>• Think out loud and explain your approach</li>
                  <li>• Consider edge cases and constraints</li>
                  <li>• Discuss trade-offs and alternatives</li>
                  <li>• Ask questions to understand requirements</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-white">Code Quality</h3>
                <ul className="space-y-2 text-sm text-white">
                  <li>• Write clean, readable code</li>
                  <li>• Use meaningful variable names</li>
                  <li>• Consider time and space complexity</li>
                  <li>• Test your code with examples</li>
                  <li>• Be ready to optimize your solution</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common Mistakes to Avoid */}
          <section className="bg-[#15396a] border border-blue-900 shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Common Mistakes to Avoid</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-white">Behavioral Questions</h3>
                <ul className="space-y-2 text-sm text-white">
                  <li>• Giving vague or generic answers</li>
                  <li>• Focusing only on the situation, not your actions</li>
                  <li>• Not providing specific examples</li>
                  <li>• Being negative about previous employers</li>
                  <li>• Not preparing follow-up questions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-white">Technical Questions</h3>
                <ul className="space-y-2 text-sm text-white">
                  <li>• Jumping into coding without understanding</li>
                  <li>• Not considering edge cases</li>
                  <li>• Being silent while thinking</li>
                  <li>• Not asking clarifying questions</li>
                  <li>• Giving up too quickly on difficult problems</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PreparePage; 