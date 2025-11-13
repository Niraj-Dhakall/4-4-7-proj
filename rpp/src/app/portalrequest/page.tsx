"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const TAG_OPTIONS = [
    "Frontend",
    "Backend",
    "Research",
    "UI/UX",
    "Data",
    "Security",
];
const MAJOR_OPTIONS = [
    "Computer Science",
    "Computer Engineering",
    "Information Systems",
];

const EXPERIENCE_OPTIONS = [
    "Beginner Friendly",
    
]

export default function PortalRequest() {
    const router = useRouter();
    // title,
    //   description,
    //   project_manager_id,
    //   tags,
    //   status,
    //   friendly = false,
    //   student_app = [],
    //   student_accepted = []
    const [formData, setFormData] = useState({
        title: "",
        project_manager_id: "",
        summary_description:"",
        description: "",
        video_link: "",
        video_upload: null as File | null,
        tags: [] as string[],

        date_posted: "",
        status: "Ongoing",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const { data: session, status } = useSession();
    const userType = session?.user.userType;
    // TODO: add this back in later
    // useEffect(() => {
    //   if (status === "unauthenticated" || userType != "stakeholder") {
    //     router.push("/portal")
    //     return
    //   }
    // }, [session, status, userType])
    
    
    //Video upload

    // const videoPreviewUrl = useMemo(() => {
    //     if (!formData.video_upload) return null;
    //     return URL.createObjectURL(formData.video_upload);
    // }, [formData.video_upload]);

    // useEffect(() => {
    //     return () => {
    //         if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    //     };
    // }, [videoPreviewUrl]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (name === "summary_description" && value.split(/\s+/).length > 250)
            return;
        if (name === "proposal_description" && value.split(/\s+/).length > 500)
            return;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setFormData((prev) => ({ ...prev, video_upload: file }));
    };

    const toggleTag = (field: "tags", tag: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].includes(tag)
                ? prev[field].filter((t) => t !== tag)
                : [...prev[field], tag],
        }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };
    async function submit() {
        try {
            formData.project_manager_id = session?.user.id ?? "";
            const res = await fetch("/api/proposals/createProposal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!formData.title.trim())
            newErrors.proposal_name = "Required";
        if(!formData.summary_description.trim())
            newErrors.sumdescription = "Required"
        if (!formData.description.trim())
            newErrors.proposal_description = "Required";
        if (formData.tags.length === 0)
            newErrors.major_tags = "Required";
        if (formData.tags.length === 0)
            newErrors.project_tags = "Required";

        setErrors(newErrors);
        submit();
    };

    return (
        <div className="bg-amber-400 flex justify-center min-h-screen py-10">
            <div className="bg-white shadow-md w-full max-w-6xl flex flex-col md:flex-row">
                {/* LEFT PANEL — Proposal Details */}
                <div className="flex-1 border-r border-gray-200 p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Proposal Request Form
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Submit your project proposal, summary, and video.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Proposal Name */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="title"
                                className="text-sm font-bold text-gray-700 mb-1"
                            >
                                Proposal Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter proposal title"
                                className={`border p-2 text-gray-700 text-sm focus:outline-none focus:ring-2 ${
                                    errors.proposal_name
                                        ? "border-black ring-black"
                                        : "border-gray-300 focus:ring-black"
                                }`}
                            />
                            {errors.proposal_name && (
                                <p className="flex items-center gap-1 text-xs text-black mt-1">
                                    <span className="w-3 h-3 bg-black rounded-full text-white flex items-center justify-center text-[10px]">
                                        !
                                    </span>
                                    {errors.proposal_name}
                                </p>
                            )}
                        </div>

                        {/*Summary description */}
                        <div className="flex flex-col relative">
                            <label 
                            htmlFor="summary_description"
                            className="text-sm font-bold text-gray-700 mb-1"> Summary Description (250 words) {""}                                  <span className="text-red-500">*</span>
</label> 
                            
                            <textarea
                            id="summary_description"
                            name="summary_description"
                            value={formData.summary_description}
                            onChange={handleChange}
                            placeholder="Give a summary description that will be shown on the project description when the project is listed on the homepage"
                            className={`border p-2 h-35 text-sm resize-none text-gray-700 focus:outline-none focus:ring-2 ${
                                errors.sumdescription
                                ?"border-black ring-black"
                                :"border-gray-300 focus:ring-black"

                            }`}
                            />
                            <span className="absolute bottom-2 right-3 text-xs text-gray-500">
                                {
                                    formData.summary_description
                                        .split(/\s+/)
                                        .filter(Boolean).length
                                }
                                /250
                            </span>
                            {errors.sumdescription && (
                                <p className="flex items-center gap-1 text-xs text-black mt-1">
                                    <span className="w-3 h-3 bg-black rounded-full text-white flex items-center justify-center text-[10px]">
                                        !
                                    </span>
                                    {errors.sumdescription}
                                </p>
                            )}

                    

                        </div>
                            
                        {/* Full Description */}
                        <div className="flex flex-col relative">
                            <label
                                htmlFor="description"
                                className="text-sm font-bold text-gray-700 mb-1"
                            >
                                Proposal Description (500 words){" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your proposal in detail..."
                                className={`border p-2 h-48 text-sm resize-none text-gray-700 focus:outline-none focus:ring-2 ${
                                    errors.proposal_description
                                        ? "border-black ring-black"
                                        : "border-gray-300 focus:ring-black"
                                }`}
                            />
                            <span className="absolute bottom-2 right-3 text-xs text-gray-500">
                                {
                                    formData.description
                                        .split(/\s+/)
                                        .filter(Boolean).length
                                }
                                /500
                            </span>
                            {errors.proposal_description && (
                                <p className="flex items-center gap-1 text-xs text-black mt-1">
                                    <span className="w-3 h-3 bg-black rounded-full text-white flex items-center justify-center text-[10px]">
                                        !
                                    </span>
                                    {errors.proposal_description}
                                </p>
                            )}
                        </div>

                        {/* Video Upload / Link */}
                        <div className="flex flex-col space-y-2">
                            <label
                                htmlFor="video_link"
                                className="text-sm font-bold text-gray-700"
                            >
                                Video Link (optional)
                            </label>

                            <input
                                id="video_link"
                                name="video_link"
                                value={formData.video_link}
                                onChange={handleChange}
                                placeholder="Paste a YouTube,,Google Drive, Vimeo, or direct link..."
                                className="border border-gray-300 text-gray-700 p-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col items-end  mt-6 gap-2">
                            <button
                                type="submit"
                                className="bg-black hover:bg-gray-500 cursor-pointer text-white font-semibold py-2 px-6 transition duration-200"
                            >
                                Submit Proposal
                            </button>
                        </div>
                    </form>
                    <div className="flex w-full justify-end mt-3">
                        <button
                            onClick={() => router.push("/portal")}
                            className=" hover:cursor-pointer hover:text-amber-100 bg-amber-400 text-black font-semibold py-2 px-6 transition duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-full md:w-1/3 bg-white p-8 border-l flex flex-col gap-6">

                   {/* Level tags */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-2">
                            Recommended Experience Level{" "}
                            <span className="text-slate-500">(Optional)</span>
                        </label>
                        <div className="flex flex-wrap gap-2 border border-gray-300 p-3 bg-white">
                            {EXPERIENCE_OPTIONS.map((experience_level) => (
                                <button
                                    type="button"
                                    key={experience_level}
                                    onClick={() => toggleTag("tags", experience_level)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                                        formData.tags.includes(experience_level)
                                            ? "bg-black text-white cursor-pointer"
                                            : "bg-gray-100 border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-200"
                                    }`}
                                >
                                    {experience_level}
                                </button>
                            ))}
                        </div>
                        {errors.experience_tag && (
                            <p className="flex items-center gap-1 text-xs text-black mt-1">
                                <span className="w-3 h-3 bg-black rounded-full text-white flex items-center justify-center text-[10px]">
                                    !
                                </span>
                                {errors.experience_tag}
                            </p>
                        )}
                    </div>

                    {/* Majors */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-2">
                            Recommended Majors{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2 border border-gray-300 p-3 bg-white">
                            {MAJOR_OPTIONS.map((major) => (
                                <button
                                    type="button"
                                    key={major}
                                    onClick={() => toggleTag("tags", major)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                                        formData.tags.includes(major)
                                            ? "bg-black text-white cursor-pointer"
                                            : "bg-gray-100 border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-200"
                                    }`}
                                >
                                    {major}
                                </button>
                            ))}
                        </div>
                        {errors.major_tags && (
                            <p className="flex items-center gap-1 text-xs text-black mt-1">
                                <span className="w-3 h-3 bg-black rounded-full text-white flex items-center justify-center text-[10px]">
                                    !
                                </span>
                                {errors.major_tags}
                            </p>
                        )}
                    </div>

                    {/* Project Tags */}
                    <div className="flex flex-col">
                        <label className="text-sm font-bold text-gray-700 mb-2">
                            Project Tags <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2 border border-gray-300 p-3 bg-white">
                            {TAG_OPTIONS.map((tag) => (
                                <button
                                    type="button"
                                    key={tag}
                                    onClick={() => toggleTag("tags", tag)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                                        formData.tags.includes(tag)
                                            ? "bg-black text-white cursor-pointer"
                                            : "bg-gray-100 border cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        {errors.project_tags && (
                            <p className="flex items-center gap-1 text-xs text-black mt-1">
                                <span className="w-3 h-3 bg-black rounded-full text-white flex items-center justify-center text-[10px]">
                                    !
                                </span>
                                {errors.project_tags}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
