import { getDifficultyBadgeClass } from "../../lib/utils";

const ProblemDescription = ({
  problem,
  currentProblemId,
  onProblemChange,
  allProblems,
}) => {
  return (
    <div className="h-full overflow-y-auto bg-base-200">
      {/* HEADER */}
      <div className="p-6 bg-base-100 border-b border-base-300">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-3xl font-bold text-base-content">
            {problem.title}
          </h1>

          <span
            className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            className="select select-sm w-full"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* DESCRIPTION */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold text-base-content">Description</h2>

          <p className="text-base-content/90 mt-3 leading-relaxed">
            {problem.description}
          </p>
        </div>

        {/* EXAMPLES (from samples) */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

          <div className="space-y-4">
            {problem.samples?.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-sm">{idx + 1}</span>
                  <p className="font-semibold text-base-content">
                    Example {idx + 1}
                  </p>
                </div>

                <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold min-w-17.5">
                      Input:
                    </span>
                    <span>{example.input}</span>
                  </div>

                  <div className="flex gap-2">
                    <span className="text-secondary font-bold min-w-17.5">
                      Output:
                    </span>
                    <span>{example.output}</span>
                  </div>

                  {example.explanation && (
                    <div className="pt-2 border-t border-base-300 mt-2">
                      <span className="text-base-content/60 text-xs">
                        <span className="font-semibold">Explanation:</span>{" "}
                        {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
