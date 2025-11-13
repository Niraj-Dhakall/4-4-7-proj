"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ProfileImage from "@/components/profilePicture";
import { Briefcase, Users, FolderOpen, Folder, PlusCircle } from "lucide-react"; // Added PlusCircle icon

interface Project {
    id: string;
    title: string;
    description: string;
    status: string;
    tags: string[];
    friendly: boolean;
    student_app: string[];
    student_accepted: string[];
    date: string;
}

interface Stakeholder {
    name: string;
    email: string;
    affiliation: string;
    projects: Project[];
}

interface Section{
    id: string,
    number: number,
    time: string,
    days: string,
    location: string,
    projects: string,
    students: string,
    groups: string,
    student_count: number,
    group_count: number,
    class_id: string,

}
// model Section{
//   id            String @id @default(auto()) @map("_id") @db.ObjectId
//   number        Int @unique
//   time          String @unique
//   days          String
//   location      String
//   projects      String[] @db.ObjectId // List of projects available ONLY to 447
//   students      String[] @db.ObjectId
//   groups        String[] @db.ObjectId
//   student_count Int
//   group_count   Int
//   class         Class @relation(fields: [class_id], references: [id])
//   class_id      String @db.ObjectId
// }
interface Class{
    id: string,
    name: string,
    semster: string,
    sections: Section[],

}
// model Class{
//   id        String @id @default(auto()) @map("_id") @db.ObjectId
//   name      String
//   semester  String @unique
//   sections  Section[]
// }
export default function StakeholderProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stakeholder, setStakeholder] = useState<Stakeholder | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated" && session?.user?.id) {
            fetchStakeholderData(session.user.id);
        }
    }, [status, session, router]);

    const fetchStakeholderData = async (stakeholderId: string) => {
        try {
            const response = await fetch(
                `/api/stakeholders/getStakeholders?id=68f7deb00b611182b108f2ed`
            );
            if (response.ok) {
                const data = await response.json();
                setStakeholder(data);
            } else {
                console.error("Failed to fetch stakeholder data");
            }
        } catch (error) {
            console.error("Error fetching stakeholder:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTotalApplicants = () => {
        if (!stakeholder) return 0;
        return stakeholder.projects.reduce(
            (total, project) => total + project.student_app.length,
            0
        );
    };

    const getTotalAccepted = () => {
        if (!stakeholder) return 0;
        return stakeholder.projects.reduce(
            (total, project) => total + project.student_accepted.length,
            0
        );
    };

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!stakeholder) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Stakeholder not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-400">
            <HeaderWithSidebar />
            <div className="flex flex-col items-center">
                {/* name and other info */}
                <div className="flex flex-col border border-slate-500  bg-white rounded w-full justify-center mt-10 max-w-7xl md:max-w-5xl items-start-safe">
                    <div className="flex justify-start w-full bg-gray-200 p-5 ">
                        <div className="rounded-full border-black border-2 flex h-fit justify-center items-center ">
                            <ProfileImage name={stakeholder.name} size={90} />
                        </div>
                        <div className="flex flex-col items-baseline">
                            <div className=" ml-5 mt-2">
                                <h1 className="font-bold text-xl text-black">
                                    {stakeholder.name}
                                </h1>

                                <h3 className="font-bold text-sm text-slate-500">
                                    Project Manager
                                </h3>
                            </div>
                            <div className="mt-5">
                                <h1 className="text-sm text-slate-500">
                                    Email:
                                    <span className="text-black font-semibold">
                                        {stakeholder.email}
                                    </span>
                                </h1>
                                <h1 className="text-sm text-slate-500 mt-2">
                                    Affiliation:
                                    <span className="text-black font-semibold">
                                        {stakeholder.affiliation}
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl md:max-w-5xl border border-slate-400" />

                    {/* overview and stuff */}
                    <div className="flex flex-col w-full justify-start p-5">
                        <h1 className="font-semibold text-md text-slate-500">
                            Overview
                        </h1>
                        <div className="flex w-full bg-gray-200 rounded items-baseline">
                            {/* first metric- projects created */}
                            <div className="flex w-full justify-start max-w-sm  p-3">
                                <div className="flex items-center gap-2 ">
                                    <div className="bg-blue-500 p-2 rounded justify-center h-fit items-center ">
                                        <FolderOpen className="w-[35px] h-[35px]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-black text-xl font-bold">
                                            {stakeholder.projects.length}
                                        </h1>
                                        <h3 className="text-slate-500 text-md">
                                            Project Created
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            {/* second metric- total applications */}
                            <div className="flex w-full justify-start max-w-sm  p-3">
                                <div className="flex items-center gap-2 ">
                                    <div className="bg-green-500 p-2 rounded justify-center items-center ">
                                        <Users className="w-[35px] h-[35px]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-black text-xl font-bold">
                                            {getTotalApplicants()}
                                        </h1>
                                        <h3 className="text-slate-500 text-md">
                                            Total Applications
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            {/* third metric- students accepted */}
                            <div className="flex w-full justify-start max-w-sm  p-3">
                                <div className="flex items-center gap-2 ">
                                    <div className="bg-purple-500 p-2 rounded justify-center items-center ">
                                        <Briefcase className="w-[35px] h-[35px]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-black text-xl font-bold">
                                            {getTotalAccepted()}
                                        </h1>
                                        <h3 className="text-slate-500 text-md">
                                            Total Accepted
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* projects and stuff */}
                    <div className="flex flex-col w-full justify-start p-5">
                        <h1 className="font-semibold text-md text-slate-500">
                            Your Projects
                        </h1>
                        <div className="flex w-full bg-gray-200 rounded items-baseline p-3">
                            {stakeholder.projects.length === 0 ? (
                                <div>
                                    <p className="text-slate-400">
                                        No projects created yet
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 w-full">
                                    {stakeholder.projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="bg-white border border-slate-300 p-4 rounded hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() =>
                                                router.push(
                                                    `/stakeholder-portal/${project.id}/applicants`
                                                )
                                            }
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h2 className="font-bold text-lg text-black">
                                                        {project.title}
                                                    </h2>
                                                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                                        {project.description}
                                                    </p>
                                                    <div className="flex gap-2 mt-2 flex-wrap">
                                                        {project.tags.map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="ml-4 text-right">
                                                    <span
                                                        className={`text-xs font-semibold px-2 py-1 rounded ${
                                                            project.status === "Ongoing"
                                                                ? "bg-red-500 text-white"
                                                                : project.status === "Completed"
                                                                ? "bg-green-500 text-green-800"
                                                                : "bg-gray-500 text-black"
                                                        }`}
                                                    >
                                                        {project.status}
                                                    </span>
                                                    <div className="mt-3">
                                                        <p className="text-sm text-slate-500">
                                                            Applicants
                                                        </p>
                                                        <p className="text-xl font-bold text-black">
                                                            {project.student_app.length}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* create class */}
                    <div className="flex flex-col w-full justify-start p-5">
                        <h1 className="font-semibold text-md text-slate-500">
                            Actions
                        </h1>
                        <div className="flex w-full bg-gray-200 rounded items-baseline p-3">
                            <div className="w-full">
                                <div className="bg-white border border-slate-300 p-4 rounded hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="font-bold text-lg text-black">
                                                Create a New Class
                                            </h2>
                                            <p className="text-sm text-slate-600 mt-1">
                                                Click to create a class for the semester and add its sections.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => router.push("/profile/admin/createclass")}
                                            className="bg-black text-white font-semibold px-4 py-2 rounded hover:bg-gray-800 transition flex items-center gap-2"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            Create Class
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*end*/}
                </div>
            </div>
        </div>
    );
}
