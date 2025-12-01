"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ProfileImage from "@/components/profilePicture";
import { PlusCircle } from "lucide-react";

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

interface Admin {
    name: string;
    email: string;
    affiliation: string;
    projects: Project[];
}

interface Section {
    id: string;
    number: number;
    time: string;
    days: string;
    location: string;
    projects: string;
    students: string;
    groups: string;
    student_count: number;
    group_count: number;
    class_id: string;
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
interface Class {
    id: string;
    name: string;
    semester: string;
    sections: Section[];
}
// model Class{
//   id        String @id @default(auto()) @map("_id") @db.ObjectId
//   name      String
//   semester  String @unique
//   sections  Section[]
// }
export default function AdminProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<Class[]>();
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        if (status === "authenticated" && session?.user?.id) {
            fetchStakeholderData(session.user.id);
            fetchClasses();
        }
    }, [status, session, router]);

    const fetchStakeholderData = async (stakeholderId: string) => {
        try {
            const response = await fetch(
                `/api/admin/getAdminDetails?id=${session?.user.id}`
            );
            if (response.ok) {
                const data = await response.json();
                setAdmin(data);
            } else {
                console.error("Failed to fetch stakeholder data");
            }
        } catch (error) {
            console.error("Error fetching stakeholder:", error);
        } finally {
            setLoading(false);
        }
    };

    async function fetchClasses() {
        const res = await fetch("/api/classes/getClass", {
            method: "GET",
        });
        const body = await res.json();
        setClasses(body);
    }
    if (loading || status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Admin not found</p>
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
                            <ProfileImage name={admin.name} size={90} />
                        </div>
                        <div className="flex flex-col items-baseline">
                            <div className=" ml-5 mt-2">
                                <h1 className="font-bold text-xl text-black">
                                    {admin.name}
                                </h1>

                                <h3 className="font-bold text-sm text-red-500">
                                    ADMIN
                                </h3>
                            </div>
                            <div className="mt-5">
                                <h1 className="text-sm text-slate-500">
                                    Email:
                                    <span className="text-black font-semibold">
                                        {admin.email}
                                    </span>
                                </h1>
                                <h1 className="text-sm text-slate-500 mt-2">
                                    Affiliation:
                                    <span className="text-black font-semibold">
                                        Admin
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl md:max-w-5xl border border-slate-400" />

                    {/* Your Projects */}
                    <div className="flex flex-col w-full justify-start p-3">
                        <h1 className="font-semibold text-md text-slate-500">
                            Your Projects
                        </h1>
                        <div className="flex w-full bg-gray-200 rounded items-baseline p-3">
                            <div className="w-full space-y-3">
                                {admin.projects.length === 0 && (
                                    <p className="font-semibold text-md text-slate-500 ml-5">
                                        No projects
                                    </p>
                                )}

                                {admin.projects.map((project) => (
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
                                                    {project.tags.map(
                                                        (tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded"
                                                            >
                                                                {tag}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div className="ml-4 text-right">
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded ${
                                                        project.status ===
                                                        "Ongoing"
                                                            ? "bg-red-500 text-white"
                                                            : project.status ===
                                                                "Completed"
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
                                                        {
                                                            project.student_app
                                                                .length
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Your Classes */}
                    <div className="flex flex-col w-full justify-start p-3">
                        <h1 className="font-semibold text-md text-slate-500">
                            Your Classes
                        </h1>
                        <div className="flex w-full bg-gray-200 rounded items-baseline p-3">
                            <div className="w-full space-y-3">
                                {classes && classes.length === 0 && (
                                    <p className="font-semibold text-md text-slate-500 ml-5">
                                        No classes
                                    </p>
                                )}

                                <div className="flex gap-2">
                                    {classes &&
                                        classes.map((classItem, index) => (
                                            <div
                                                key={index}
                                                className="bg-white border border-slate-300 p-4 rounded max-w-xl transition-shadow hover:cursor-pointer hover:shadow-md"
                                                onClick={() =>
                                                    router.push(
                                                        `/profile/admin/viewClass/${classItem.id}`
                                                    )
                                                }
                                            >
                                                <div className="flex">
                                                    <p className="font-bold text-lg text-black">
                                                        {classItem.name}
                                                    </p>
                                                    <p className="font-bold text-lg text-slate-500 ml-2">
                                                        {classItem.semester}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* create class */}
                    <div className="flex flex-col w-full justify-start p-3">
                        <h1 className="font-semibold text-md text-slate-500">
                            Actions
                        </h1>
                        <div className="flex w-full bg-gray-200 rounded items-baseline p-3">
                            <div className="w-full">
                                <div className="bg-white border border-slate-300 p-4 rounded">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="font-bold text-lg text-black">
                                                Create a New Class
                                            </h2>
                                            <p className="text-sm text-slate-600 mt-1">
                                                Click to create a class for the
                                                semester and add its sections.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    "/profile/admin/createclass"
                                                )
                                            }
                                            className="bg-black text-white font-semibold px-4 py-2 rounded hover:bg-gray-800 hover:cursor-pointer transition flex items-center gap-2"
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

                    {/*Invite stakeholder */}
                    <div className="flex flex-col w-full justify-start p-3">
                        <h1 className="font-semibold text-md text-slate-500"></h1>
                        <div className="flex w-full bg-gray-200 rounded items-baseline p-3">
                            <div className="w-full">
                                <div className="bg-white border border-slate-300 p-4 rounded transition-shadow">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="font-bold text-lg text-black">
                                                Invite Stakeholder
                                            </h2>
                                            <p className="text-sm text-slate-600 mt-1">
                                                Invite stakholders to RPP and
                                                get their ideas.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    "/profile/admin/invitestakeholder"
                                                )
                                            }
                                            className="bg-black text-white font-semibold px-4 py-2 rounded hover:bg-gray-800 transition hover:cursor-pointer flex items-center gap-2"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            Invite
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
