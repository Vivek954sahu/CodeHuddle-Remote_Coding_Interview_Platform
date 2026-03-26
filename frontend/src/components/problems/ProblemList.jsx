import { LuCode } from "react-icons/lu";
import { motion } from "framer-motion";

const ProblemList = ({filteredProblems, problems}) => {
  return (
    <div className="rounded-lg border border-purple-400 bg-purple-50 text-gray-800 shadow-md">
      <div className="flex flex-col space-y-1.5 p-6">

        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Problems
        </h3>

        <p className="text-sm text-gray-700">
          Showing {filteredProblems.length} of {problems.length} problems.
        </p>
      </div>  

      <div className="p-6 pt-0">
        <div className="space-y-2">
          {
            filteredProblems.map((problem, idx) => (
              <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-purple-500 hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-300 flex items-center justify-center">
                    <LuCode className="h-5 w-5 text-purple-600" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{problem.title}</h4>
                      <div className="text-purple-white text-xs inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors "
                      >
                        {problem.difficulty}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>    
    </div>
  )
}

export default ProblemList

              
                  