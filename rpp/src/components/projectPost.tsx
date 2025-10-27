'use client'
import React, { useEffect, useState } from "react"
import ProfileImage from "./profilePicture";
import { useRouter } from "next/navigation";
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
    const [timeAgoNum, setTimeAgoNum] = useState("")
    const maxDescriptionLength = 200;
    const router = useRouter();
    useEffect(() => {
        setTimeAgoNum(timeAgo(ProjectPost.date) ?? "")
    }, [ProjectPost.date])

    const statusStyles: Record<Status, string> = {
        Ongoing: "bg-blue-500 text-white px-3 py-1 text-xs font-semibold shadow-sm",
        Completed: "bg-green-500 text-white px-3 py-1 text-xs font-semibold shadow-sm",
        Dropped: "bg-gray-500 text-white px-3 py-1  text-xs font-semibold shadow-sm",
    };

    function timeAgo(date: Date) {
        const now = new Date();
        const diff = (date.getTime() - now.getTime()) / 1000; // difference in seconds
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

    const StatusTag: React.FC<{ status: Status }> = ({ status }) => {
        return (
            <span className={statusStyles[status]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const shouldTruncate = ProjectPost.description.length > maxDescriptionLength;

    return (
        <div className="w-full  flex flex-col flex-shrink-0 max-w-xl bg-white border border-slate-500 overflow-hidden">
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
            <div className="flex justify-end w-full p-2 ">
                <button onClick={() => router.push(`/project/${ProjectPost.id}`)} className="bg-black text-white p-2"> View</button>
            </div>
        </div>
    );
}