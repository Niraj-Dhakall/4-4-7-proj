import { getProjectsById } from "../../../../lib/projects";
import { redirect, notFound } from "next/navigation";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ProfileImage from "@/components/profilePicture";
import { HiMail, HiCalendar, HiUserGroup, HiCheckCircle } from "react-icons/hi";

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
        Ongoing: "bg-blue-500 text-white px-4 py-2 text-sm font-semibold shadow-sm",
        Completed: "bg-green-500 text-white px-4 py-2 text-sm font-semibold shadow-sm",
        Dropped: "bg-gray-500 text-white px-4 py-2 text-sm font-semibold shadow-sm",
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
        <div>hi</div>
    );
}
