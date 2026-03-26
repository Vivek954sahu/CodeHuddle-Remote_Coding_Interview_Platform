import { motion } from "framer-motion";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useState } from "react";
import {
  LuCalendar,
  LuCode,
  LuPlus,
  LuSend,
  LuUser,
  LuX,
} from "react-icons/lu";
import { useNavigate } from "react-router";
import { scheduleInterview } from "../../api/interviewsApi";

const availableProblems = [
  {
    _id: "69b92e8effb87a42d63de2d0",
    title: "Maximum SubArray",
    difficulty: "MEDIUM",
  },
  {
    _id: "69b92e8effb87a42d63de2d1",
    title: "Binary Tree Level Order Traversal",
    difficulty: "MEDIUM",
  },
  {
    _id: "69b92e8effb87a42d63de2d2",
    title: "Climbing Stairs",
    difficulty: "EASY",
  },
  {
    _id: "69b92e8effb87a42d63de2cb",
    title: "Two Sum",
    difficulty: "EASY"
  },
  {
    _id: "69b92e8effb87a42d63de2cc",
    title: 'Valid Parentheses',
    difficulty: "EASY"
  }
];

const CreateInterview = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [problemIds, setProblemIds] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    candidateEmail: "",
    scheduledAt: "",
    duration: 60,
    type: "",
  });

  const handleAddProblem = (problemId) => {
    if (!problemIds.includes(problemId)) {
      setProblemIds([...problemIds, problemId]);
    }
  };

  const handleRemoveProblem = (problemId) => {
    setProblemIds(problemIds.filter((id) => id !== problemId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await scheduleInterview({ ...formData, problemIds });
      
      navigate('/interviewer/dashboard'); 
    } catch (error) {
      console.error('Error scheduling interview:', error);
      // Show error message
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl py-6">
        {/* Header */}
        <div>
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Create New Interview
          </motion.h1>

          <p className="text-gray-500 mt-1">
            Schedule a coding interview session with candidate.
          </p>
        </div>

        {/* Create Interview Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/*Candidate Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="rounded-lg border border-purple-400 bg-purple-100 text-gray-900 shadow-md">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
                  <LuUser className="h-5 w-5" />
                  Candidate Information
                </h3>
                <p className="text-sm text-gray-500">
                  Enter the candidate's details
                </p>
              </div>
              <div className="space-y-4 p-6 pt-0">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Interview Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      placeholder="Senior Software Engineer"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-gray-300  px-3 py-2 text-base focus:outline-purple-700 placeholder:text-gray-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Candidate Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="abc@example.com"
                      value={formData.candidateEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          candidateEmail: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-gray-300  px-3 py-2 text-base focus:outline-purple-700 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="type"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Interview Type
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-gray-300  px-3 py-2 text-base focus:outline-purple-700 placeholder:text-gray-500"
                    required
                  >
                    <option value="" disabled>Select Interview Type</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-lg border border-purple-400 bg-purple-100 text-gray-900 shadow-md">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
                  <LuCalendar className="h-5 w-5" />
                  Schedule
                </h3>
                <p className="text-sm text-gray-500">
                  Set the interview date and time
                </p>
              </div>

              <div className="space-y-4 p-6 pt-0">
                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-purple-600"
                      value={date || ""}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setDate(newDate);

                        if (time) {
                          const iso = new Date(
                            `${newDate}T${time}`,
                          ).toISOString();
                          setFormData({ ...formData, scheduledAt: iso });
                        }
                      }}
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <input
                      type="time"
                      className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-purple-600"
                      value={time || ""}
                      onChange={(e) => {
                        const timeValue = e.target.value;

                        setTime(timeValue);

                        if (date) {
                          const iso = new Date(`${date}T${timeValue}`).toISOString();
                          setFormData({
                            ...formData,
                            scheduledAt: iso,
                          });
                        }
                      }}
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <select
                      className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-purple-600"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: parseInt(e.target.value) })
                      }
                    >
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coding Problems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="rounded-lg border border-purple-400 bg-purple-100 text-gray-900 shadow-md">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
                  <LuCode className="h-5 w-5" />
                  Coding Problems
                </h3>
                <p className="text-sm text-gray-500">
                  Select problems for the interview
                </p>
              </div>
              <div className="space-y-4 p-6 pt-0">
                {/* Selected Problems */}
                {problemIds.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Selected Problems
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {problemIds.map((_id) => {
                        const problem = availableProblems.find(
                          (p) => p._id === _id,
                        );
                        if (!problem) return null;
                        return (
                          <div
                            key={_id}
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none"
                          >
                            {problem.title}
                            <button
                              type="button"
                              onClick={() => handleRemoveProblem(_id)}
                              className="ml-1 hover:text-red-500"
                            >
                              <LuX className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Problem Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Add Problem</label>
                  <div className="flex items-center gap-2">
                    <LuPlus className="h-4 w-4" />

                    <select
                      defaultValue=""
                      className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                          handleAddProblem(value);
                          e.target.value = ""; // reset dropdown
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select a problem
                      </option>

                      {availableProblems
                        .filter((p) => !problemIds.includes(p._id))
                        .map((problem) => (
                          <option key={problem._id} value={problem._id}>
                            {problem.title} ({problem.difficulty})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium"
            >
              <LuSend className="h-4 w-4" />
              Schedule
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateInterview;
