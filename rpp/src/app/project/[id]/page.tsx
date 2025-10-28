import { getProjectsById } from "../../../../lib/projects";
import { redirect, notFound } from "next/navigation";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ProfileImage from "@/components/profilePicture";
import { HiMail, HiCalendar, HiUser, HiCheckCircle } from "react-icons/hi";
import { Tag } from "lucide-react";

interface Project {
    id: string;
    title: string;
    date: Date;
    description: string;
    tags: string[];
    status: string;
    friendly: boolean;
    project_manager: {
        name: string;
        email: string;
        affiliation: string;
    };
    student_accepted: string[];
    student_app: string[];
}

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
        Ongoing: "bg-blue-500 text-white px-4 py-2 text-sm font-semibold ",
        Completed: "bg-green-500 text-white px-4 py-2 text-sm font-semibold ",
        Dropped: "bg-gray-500 text-white px-4 py-2 text-sm font-semibold ",
    };

    return (
        <span className={statusStyles[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    if (!id) {
        redirect("/portal")
    }

    const project = await getProjectsById(id);

    if (!project) {
        notFound();
    }


    const timeAgoText = timeAgo(project.date);

    return (
        <div>
            <header>
                <HeaderWithSidebar/>
            </header>
            <div className="flex w-full justify-center">
                <div className="flex flex-col bg-white max-w-4xl w-full flex-wrap p-2 mt-5">
                    
                    {/* header section */}
                    <div className="flex p-2 gap-5 justify-around items-baseline-safe">
                        <ProfileImage name={project.project_manager.name} size={100}/>
                        <div className="flex flex-col ">
                            <h1 className="text-black font-semibold text-3xl">{project.title}</h1>
                            
                            <div className="flex gap-3 items-baseline-last mt-3"> 
                                <div className="p-2 bg-amber-200/80 max-w-2xl" >
                                    <h2 className="text-amber-600  text-md">{project.project_manager.affiliation}</h2>
                                </div>
                                <div className="flex gap-2 items-baseline ">
                                    <HiCalendar className="text-slate-500"/>
                                    <h1 className="text-slate-500"> Posted {timeAgoText}</h1>
                                    {project && project.friendly &&
                                        <div className="flex gap-1 items-center bg-green-300/70 p-1">
                                            <HiCheckCircle className="text-green-600"/>
                                            <h1 className="text-green-600">Beginner Friendly</h1>
                                        </div>
                                        
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        <div className="ml-auto"><StatusBadge  status={project.status as Status}  /></div>
                    </div>
                    {/* contact section */}
                    <div className="w-full flex flex-col justify-center rounded-lg bg-gray-200 ">
                        <div className="flex flex-col items-baseline p-4 mt-2">
                                <div className="flex gap-2 items-center">
                                    <HiUser className="text-black text-2xl"/>
                                    <h1 className="text-black font-semibold text-lg">Project Manager</h1>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-slate-500 font-semibold">{project.project_manager.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <HiMail className="text-slate-500 text-lg"/>
                                        <h3 className="text-slate-500">{project.project_manager.email}</h3>
                                    </div>
                                </div>
                        </div>
                    </div>

                    {/* tags */}
                    <div className="flex flex-col w-full mt-2 rounded-lg bg-gray-200 ">
                        <div className="flex items-center p-2 gap-2">
                            <Tag className="text-black"/>
                            <h1 className="text-black text-xl font-semibold">  Tags</h1>
                        </div>
                        <div className="flex p-2 ">
                            {project.tags ? (
                                <div className="flex gap-2">
                                    {project.tags.map((tag, index) =>(
                                    <div className="bg-blue-400/70 rounded-lg p-3 border border-blue-500"
                                        key={tag + index}
                                    >
                                        <span className="text-black">{tag}</span>
                                    </div>
                                ))}
                                </div>
                            )
                            :
                            (<p>No tags</p>)
                            }
                        </div>
                    </div>

                    {/*  description*/}
                    <div className="flex flex-col w-full mt-2 rounded-lg bg-gray-200  p-2">
                        <h1 className="text-black text-xl font-semibold"> Description</h1>
                        {project && project.description ?  <p className="p-2 text-black">{project.description}</p> : <p className="p-2 text-black">No description</p>}
                    </div>
                </div>
                
            </div>
        </div>
    );
}
