"use client";

const BehavioralQuestionsGuide = () => {
  return (
    <div className="space-y-6 text-white">
      <div>
        <h3 className="text-xl font-bold mb-4 text-white">Behavioral Interview Preparation Guide</h3>
        <p className="text-white mb-4">
          Behavioral questions assess your past experiences and how you handle various situations. 
          Use the STAR method to structure your responses: <strong>Situation, Task, Action, Result</strong>.
        </p>
      </div>

      {/* STAR Method Guide only */}
      <div className="bg-[#15396a] border border-blue-900 rounded-lg p-4 shadow-sm">
        <h4 className="font-bold text-white mb-3">STAR Method Framework</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-white mb-1">Situation</h5>
            <p className="text-white">Describe the context and background of the situation</p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-1">Task</h5>
            <p className="text-white">Explain your responsibility and what needed to be accomplished</p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-1">Action</h5>
            <p className="text-white">Detail the specific steps you took to address the situation</p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-1">Result</h5>
            <p className="text-white">Share the outcomes and what you learned from the experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehavioralQuestionsGuide; 