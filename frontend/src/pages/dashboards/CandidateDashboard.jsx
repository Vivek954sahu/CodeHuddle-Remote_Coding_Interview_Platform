import { Link } from "react-router"
import DashboardLayout from "../../components/dashboard/DashboardLayout"
import UpcomingInterviews from "../../components/interviews/UpcomingInterviews"
import { LuArrowRight } from "react-icons/lu"
import { useUpcomingInterviews } from "../../hooks/useUpcomingInterviews"


const CandidateDashboard = () => {

    const { upcomingInterviews } = useUpcomingInterviews();

  return (
    <DashboardLayout>
        <div className="space-y-8">
            {/* Main Content */}
            <div className="grid gap-6">
                {/* Upcoming Scheduled interviews */}
                <div className="rounded-lg  border border-purple-600 bg-purple-100 text-[hsl(0,0%,4%)] shadow-sm">
                    <div className="flex flex-row space-y-1.5 p-6 items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-semibold leading-none tracking-tight">Upcoming Interviews</h3>
                             <p className="text-sm text-[hsl(0,0%,42%)]">Your scheduled sessions.</p>
                        </div>
                        <Link to="/candidate/scheduled">
                        <button className="h-9 rounded-md px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap hover:bg-purple-400 hover:text-gray-800">
                            View all <LuArrowRight className="h-4 w-4"/>
                        </button>
                        </Link>
                    </div>
                    <UpcomingInterviews upcomingInterviews={upcomingInterviews} />
                </div>
            </div>
        </div>
    </DashboardLayout>
  )
}

export default CandidateDashboard
