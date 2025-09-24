'use client'
import React, { useEffect, useState } from "react"
import ProfileImage from "./profilePicture";
type ProjectPostProps = {
  ProjectPost: {
    name: string;
    affiliation: string;
    title: string;
    description: string;
    status: string;
    date: Date;
  };
};
export default function ProjectPost({ProjectPost}: ProjectPostProps){
    const [showMore, setShowMore] = useState(false)
    const [timeAgoNum, setTimeAgoNum] = useState("")
    type Status = "Ongoing" | "Completed" | "Dropped";
    useEffect(()=>(
        setTimeAgoNum(timeAgo(ProjectPost.date) ?? "")

    ),[])
    const statusStyles: Record<Status, string> = {
    Ongoing: "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium",
    Completed: "bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium",
    Dropped: "bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium",
    };

    interface StatusTagProps {
    status: Status;
    }
    function timeAgo(date: Date) {
        const now = new Date();
        const diff = (date.getTime() - now.getTime()) / 1000; // difference in seconds
        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

        const ranges: [number, Intl.RelativeTimeFormatUnit][] = [
            [60, "second"],
            [60, "minute"],
            [24, "hour"],
            [7, "day"],
            [4.34524, "week"],  // approx weeks per month
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
    const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
    return (
        <span className={statusStyles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
    };

    return(
        <div className="flex max-w-2xl max-h-2xl w-full bg-white shadow-sm shadow-amber-200 rounded-lg mt-2 p-4 ">
            <div className="flex flex-col">
                {/* profile picture and name and affilation */}
                <div className="flex p-3 items-start gap-2">
                    <ProfileImage name={ProjectPost.name}/>
                    <div>
                        <h2 className="text-black font-semibold text-2xl">{ProjectPost.title}</h2>
                        <p className="text-black bg-amber-200 p-1 rounded-lg text-md font-semibold ">{ProjectPost.affiliation}</p>
                    </div>
                    <h3 className="text-black text-sm font-semibold"></h3>
                    <StatusTag status={ProjectPost.status as Status}/>
                    
                </div>
                <div className="pb-5 ml-2">
                        <h6 className="text-black text-xl ">
                            {showMore ? ProjectPost.description : `${ProjectPost.description.substring(0, 100)}`}
                            <button onClick={() => setShowMore(true)}>..Show more</button>
                        </h6>
                </div>
            </div>
        </div>

    );
}