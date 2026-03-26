import { LuCalendar, LuClock, LuCode, LuVideo } from "react-icons/lu"
import { Link } from "react-router"
import { useAuth } from "../../context/AuthContext";

// const upcomingInterviews = [
//   {
//     _id: "int_001",
//     title: "DSA Round 1",
//     interviewType: "DSA",
//     status: "SCHEDULED",
//     candidate: {
//       _id: "user_101",
//       name: "Aman Verma",
//       email: "aman.verma@gmail.com"
//     },
//     scheduledAt: "2026-03-15T10:00:00.000Z",
//     durationMinutes: 60,
//     callId: "call_abc123",
//     problems: [
//       {
//         order: 1,
//         problem: {
//           _id: "prob_1",
//           title: "Two Sum"
//         }
//       },
//       {
//         order: 2,
//         problem: {
//           _id: "prob_2",
//           title: "Longest Substring Without Repeating Characters"
//         }
//       }
//     ]
//   },
//   {
//     _id: "int_002",
//     title: "System Design Round",
//     interviewType: "SYSTEM_DESIGN",
//     status: "SCHEDULED",
//     candidate: {
//       _id: "user_102",
//       name: "Priya Sharma",
//       email: "priya.sharma@gmail.com"
//     },
//     scheduledAt: "2026-03-16T14:30:00.000Z",
//     durationMinutes: 75,
//     callId: "call_xyz456",
//     problems: [
//       {
//         order: 1,
//         problem: {
//           _id: "prob_3",
//           title: "Design URL Shortener"
//         }
//       }
//     ]
//   },
//   {
//     _id: "int_003",
//     title: "Algorithms Round",
//     interviewType: "ALGORITHMS",
//     status: "IN_PROGRESS",
//     candidate: {
//       _id: "user_103",
//       name: "Rohit Gupta",
//       email: "rohit.gupta@gmail.com"
//     },
//     scheduledAt: "2026-03-17T09:00:00.000Z",
//     durationMinutes: 60,
//     callId: "call_lmn789",
//     problems: [
//       {
//         order: 1,
//         problem: {
//           _id: "prob_4",
//           title: "Merge K Sorted Lists"
//         }
//       },
//       {
//         order: 2,
//         problem: {
//           _id: "prob_5",
//           title: "LRU Cache"
//         }
//       }
//     ]
//   }
// ];

const UpcomingInterviews = ({ upcomingInterviews }) => {

  const { user } = useAuth();

  return (
    <div className="pt-0 p-6 space-y-4">
      {upcomingInterviews.length !== 0 ? (upcomingInterviews.map((interview) => (

        <div key={interview._id} className="p-4 rounded-lg border border-purple-700 bg-purple-200 hover:bg-purple-100 text-black transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{interview.candidate?.name || interview.interviewer?.name }</h4>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors text-black bg-purple-100">{interview.status}</div>
              </div>

              <p className="text-sm font-medium">
                {interview.interviewType}
              </p>

            
            {/* Fetch problems for interviewer */}
              {user.role === "interviewer" && (<div className="flex flex-wrap gap-1">
                {interview.problems?.filter((p) => p?.problem).map((p) => (
                  <div key={p.problem._id} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-purple-100 text-[hsl(240,5%,10%)]"
                  >
                    <LuCode className="h-3 w-3 mr-1"/>
                    {p.problem.title}
                  </div>
                ))}
              </div>)}

              <div className="flex items-center gap-4 text-sm text-[hsl(240,5%,10%)]">
                <span className="flex items-center gap-1">
                  <LuCalendar className="h-4 w-4" />
                  {(new Date(interview.scheduledAt).toLocaleDateString())}
                </span>

                <span className="flex items-center gap-1">
                  <LuClock className="h-4 w-4" />
                  {(new Date(interview.scheduledAt).toLocaleTimeString())}
                </span>

                <span>{interview.durationMinutes} min</span>
              </div>
            </div>

              <Link to={`/interview/${interview._id}`}> 
                 <button className="inline-flex items-center justify-center border p-3 bg-purple-50 hover:bg-purple-400 rounded-md text-sm font-medium gap-2 whitespace-nowrap"
                 >
                  <LuVideo className="h-4 w-4" />
                   { user.role=== "interviewer"? "Start" : "Join" } Interview
                 </button>
              </Link>
          </div>
        </div>
      ))
    ) : (
      <p>No upcoming interviews...</p>
    )}
    </div>
  )
}

export default UpcomingInterviews

