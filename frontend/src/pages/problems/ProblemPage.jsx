import { LuPlus } from "react-icons/lu";
import DashboardLayout from "../../components/dashboard/DashboardLayout"
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ProblemList from "../../components/problems/ProblemList";

const problems = [
  {
    _id: "69b92e8effb87a42d63de2cb",
    title: "Two Sum",
    difficulty: "EASY"
  },
  {
    _id: "69b92e8effb87a42d63de2cc",
    title: 'Valid Parentheses',
    difficulty: "EASY"
  },
  {
    _id: "69b92e8effb87a42d63de2cd",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM"
  },
  {
    _id: "69b92e8effb87a42d63de2ce" ,
    title: "Reverse Linked List",
    difficulty: "EASY"
  },
  {
    _id: "69b92e8effb87a42d63de2cf",
    title: "Merge Intervals",
    difficulty: "MEDIUM"
  },
  {
    _id: "69b92e8effb87a42d63de2d0",
    title: "Maximum SubArray",
    difficulty: "MEDIUM"
  },
  {
    _id: "69b92e8effb87a42d63de2d1",
    title: "Binary Tree Level Order Traversal",
    difficulty: "MEDIUM"
  },
  {
    _id: "69b92e8effb87a42d63de2d2",
    title: "Climbing Stairs",
    difficulty: "EASY"
  },
  {
    _id: "69b92e8effb87a42d63de2d3",
    title: "Kth Largest Element in Array",
    difficulty: "MEDIUM"
  },
  {
    _id: "69b92e8effb87a42d63de2d4",
    title: "Median of Two Sorted Arrays",
    difficulty: "HARD"
  },
];

const ProblemPage = () => {

    const { user } = useAuth();

  return (
    <DashboardLayout>
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
                <div>
                    <motion.h1
                    className="text-3xl font-bold"
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    >
                        Problem Library
                    </motion.h1>
                    <p className="text-gray-700 mt-1">
                        {problems.length} coding problems available.
                    </p>
                </div>

                {/* Add Problem button for Admin */}
                { user.role === "admin" && (
                    <button className="h-9 rounded-md px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap border border-purple-400 bg-purple-50 hover:bg-purple-400 hover:text-purple-50">
                        <LuPlus className="h-4 w-4" />
                        Add Problem
                    </button>
                )}
            </div>

            {/* Search Snack Bar */}
            <div>

            </div>

            {/* Problems List */}
            <ProblemList problems={problems} filteredProblems={problems} />
        </div>
    </DashboardLayout>
  )
}

export default ProblemPage