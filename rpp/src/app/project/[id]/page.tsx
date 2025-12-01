import { getProjectsById, checkStudentInProject } from "../../../../lib/projects";
import { redirect, notFound } from "next/navigation";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ProfileImage from "@/components/profilePicture";
import { HiMail, HiCalendar, HiUser, HiCheckCircle } from "react-icons/hi";
import { Tag } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { applyToProject } from "@/app/actions/apply";
import ApplicationAlert from "@/components/ApplicationAlert";
import GoBackButton from "@/components/GoBackButton";

type Status = "Ongoing" | "Completed" | "Dropped";

function timeAgo(date: Date) {
    const now = new Date();
    const diff = (date.getTime() - now.getTime()) / 1000;
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const ranges: [number, Intl.RelativeTimeFormatUnit][] = [
        [60, "second"],
        [60, "minute"],
        [24, "hour"],
        [7, "day"],
        [4.34524, "week"],
        [12, "month"],
        [Number.POSITIVE_INFINITY, "year"],
    ];

    let duration = diff;
    for (const [amount, unit] of ranges) {
        if (Math.abs(duration) < amount) {
            return rtf.format(Math.round(duration), unit);
        }
        duration /= amount;
    }
}

function StatusBadge({ status }: { status: Status }) {
    const statusStyles: Record<Status, string> = {
        Ongoing:
            "bg-red-500 text-white px-4 py-2 rounded text-sm font-semibold ",
        Completed:
            "bg-green-500 text-white px-4 py-2 rounded text-sm font-semibold ",
        Dropped:
            "bg-gray-500 text-white px-4 py-2 rounded text-sm font-semibold ",
    };

    return (
        <span className={statusStyles[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}


export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const userID = session?.user.id
    let applied;
    if (!id) {
        redirect("/portal");
    }

    const project = await getProjectsById(id);

    if (!project) {
        notFound();
    }
    if (userID) {
        applied = await checkStudentInProject(userID!, project.id)
    }
    const timeAgoText = timeAgo(project.date);

    return (
        <div>
            <header>
                <HeaderWithSidebar />
            </header>
            <div className="flex w-full justify-center bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 min-h-[100vh] py-5">
                <div className="flex flex-col bg-white max-w-4xl w-full h-fit rounded-lg  p-4">
                    {/* application alert */}
                    <ApplicationAlert />

                    {/* header section */}
                    <div>
                        <GoBackButton route={"/portal"} />
                    </div>
                    <div className="flex flex-col md:flex-row p-2 gap-5 items-start md:items-center">
                        <div className="flex-shrink-0">
                            <ProfileImage
                                name={project.project_manager.name}
                                size={100}
                            />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <h1 className="text-black font-semibold text-xl sm:text-2xl md:text-3xl break-words">
                                    {project.title}
                                </h1>
                                {project && project.friendly && (
                                    <div className="flex gap-1 items-center rounded-xl bg-green-500 px-2 py-1 w-fit">
                                        <HiCheckCircle className="text-green-700 flex-shrink-0" />
                                        <span className="text-green-800 text-sm">
                                            Beginner Friendly
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mt-3">
                                <div className="p-2 bg-amber-200/80 rounded-lg">
                                    <h2 className="text-amber-600 text-sm md:text-md">
                                        {project.project_manager.affiliation}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-1">
                                    <HiCalendar className="text-slate-500 flex-shrink-0" />
                                    <span className="text-slate-500 text-sm">
                                        Posted {timeAgoText}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-auto">
                            <StatusBadge status={project.status as Status} />
                        </div>
                    </div>
                    {/* contact section */}
                    <div className="w-full flex flex-col justify-center rounded-lg bg-gray-100 ">
                        <div className="flex flex-col items-baseline p-4 mt-2">
                            <div className="flex gap-2 items-center">
                                <HiUser className="text-black text-2xl" />
                                <h1 className="text-black font-semibold text-lg">
                                    Project Manager
                                </h1>
                            </div>
                            <div className="mt-3">
                                <h3 className="text-slate-500 font-semibold">
                                    {project.project_manager.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <HiMail className="text-slate-500 text-lg" />
                                    <h3 className="text-slate-500">
                                        {project.project_manager.email}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* tags */}
                    <div className="flex flex-col w-full mt-2 rounded-lg bg-gray-100 ">
                        <div className="flex items-center p-2 gap-2">
                            <Tag className="text-black" />
                            <h1 className="text-black text-xl font-semibold">
                                
                                Tags
                            </h1>
                        </div>
                        <div className="flex flex-wrap p-2 gap-2">
                            {project.tags ? (
                                project.tags.map((tag, index) => (
                                    <div
                                        className="bg-blue-300/70 rounded-lg p-1 md:p-3 border border-blue-500"
                                        key={tag + index}
                                    >
                                        <span className="text-black text-sm">
                                            {tag}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>No tags</p>
                            )}
                        </div>
                    </div>

                    {/*  description*/}
                    <div className="flex flex-col w-full mt-2 rounded-lg bg-gray-100  p-2">
                        <h1 className="text-black text-xl font-semibold">
                            Description
                        </h1>
                        {project && project.description ? (
                            <p className="p-2 text-black">
                                {project.description}
                            </p>
                        ) : (
                            <p className="p-2 text-black">No description</p>
                        )}
                    </div>
                    <div className="flex w-full justify-end  items-center mt-2">
                        {applied ? (<button
                            className="bg-gray-500 text-white p-2 rounded hover:cursor-disabled w-[100px]"
                        >
                            <span className="flex items-center gap-2"><HiCheckCircle className="text-green-400" /> Applied</span>
                        </button>) : (

                            <form action={applyToProject}>
                                <input type="hidden" name="projectId" value={project.id} />
                                <input type="hidden" name="studentId" value={session?.user.id} />
                                <button
                                    type="submit"
                                    className="bg-black text-white p-2 rounded hover:cursor-pointer w-[100px] hover:bg-amber-500/80"
                                >
                                    Apply
                                </button>
                            </form>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
