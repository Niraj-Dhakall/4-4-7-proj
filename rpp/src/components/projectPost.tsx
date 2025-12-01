"use client";
import React, { useEffect, useState } from "react";
import ProfileImage from "./profilePicture";
import { useRouter } from "next/navigation";
import TimeAgoText from "./TimeAgo";
type ProjectPostProps = {
    ProjectPost: {
        id: string;
        name: string;
        affiliation: string;
        title: string;
        description: string;
        status: string;
        date: Date;
    };
};

type Status = "Ongoing" | "Completed" | "Dropped";

export default function ProjectPost({ ProjectPost }: ProjectPostProps) {
    const [timeAgoNum, setTimeAgoNum] = useState("");
    const router = useRouter();
    useEffect(() => {
        const date = ProjectPost.date;
        setTimeAgoNum(TimeAgoText({ date }) ?? "");
    }, [ProjectPost.date]);

    const statusStyles: Record<Status, string> = {
        Ongoing:
            "bg-red-500 text-white px-3 py-1 text-md rounded font-semibold shadow-sm",
        Completed:
            "bg-green-500 text-white px-3 py-1 text-md rounded font-semibold shadow-sm",
        Dropped:
            "bg-gray-500 text-white px-3 py-1  text-md rounded font-semibold shadow-sm",
    };

    const StatusTag: React.FC<{ status: Status }> = ({ status }) => {
        return (
            <span className={statusStyles[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="w-full  flex flex-col flex-shrink-0 max-w-3xl rounded-lg bg-white border border-slate-500 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <ProfileImage name={ProjectPost.name} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">
                                {ProjectPost.title}
                            </h2>
                            <StatusTag status={ProjectPost.status as Status} />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                {ProjectPost.affiliation}
                            </span>
                            <span className="text-sm text-gray-500">
                                • {timeAgoNum}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="p-6">
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                    {ProjectPost.description}
                </p>
            </div>
            <div className="flex justify-end w-full p-6 ">
                <button
                    onClick={() => router.push(`/project/${ProjectPost.id}`)}
                    className="bg-black hover:cursor-pointer text-white p-2 rounded-md w-[100px]"
                >
                    View
                </button>
            </div>
        </div>
    );
}
