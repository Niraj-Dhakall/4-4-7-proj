"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ProfileImage from "@/components/profilePicture";
import { ChevronRightSquare, Circle, Edit2, Save, X, Plus, Trash2 } from "lucide-react";

interface Major {
    level: string;
    name: string;
    gradYear: string;
}

interface Student {
    id: string;
    email: string;
    name: string;
    major: Major[];
    year: string;
    gpa: number;
    skills: string[];
    portfolio?: string | null;
    courses: string[];
    graduation: string;
}

interface Section {
    id: string;
    code: string;
    sec_number: number;
    time: string;
    days: string;
    location: string;
}

interface Group {
    id: string;
    name: string;
    member_count: number;
    group_master_id: string;
    group_master: {
        id: string;
        name: string;
        email: string;
    };
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [section, setSection] = useState<Section | null>(null);
    const [group, setGroup] = useState<Group | null>(null);


    const [editGpa, setEditGpa] = useState("");
    const [editPortfolio, setEditPortfolio] = useState("");
    const [newSkill, setNewSkill] = useState("");
    const [editGraduation, setEditGraduation] = useState("");
    const [editMajor, setEditMajor] = useState<Major[]>([]);
    // TODO: add usertype check

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated" || session?.user.userType != 'student') {
            router.push('/login')
        }
    }, [session, status, router])

    const fetchStudentData = useCallback(async (studentId: string) => {
        try {
            const [studentRes, sectionRes, groupRes] = await Promise.all([
                fetch(`/api/students/getStudentByID?id=${studentId}`),
                fetch(`/api/students/getStudentSection?id=${studentId}`),
                fetch(`/api/groups/getStudentGroup?id=${studentId}`)
            ]);

            if (studentRes.ok) {
                const data = await studentRes.json();
                setStudent(data);
                // Initialize edit state with current values
                setEditGpa(data.gpa?.toString() || "");
                setEditPortfolio(data.portfolio || "");
                setEditGraduation(data.graduation || "");
                setEditMajor(data.major || []);
            } else {
                console.error("Failed to fetch student data");
            }

            if (sectionRes.ok) {
                const sectionData = await sectionRes.json();
                setSection(sectionData);
            }

            if (groupRes.ok) {
                const groupData = await groupRes.json();
                setGroup(groupData);
            }
        } catch (error) {
            console.error("Error fetching student:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleEditToggle = () => {
        if (isEditing) {
            if (student) {
                setEditGpa(student.gpa?.toString() || "");
                setEditPortfolio(student.portfolio || "");
                setEditGraduation(student.graduation || "");
                setEditMajor(student.major || []);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        if (!student || !session?.user?.id) return;

        setSaving(true);
        try {
            const updates: any = { id: session.user.id };

            if (editGpa !== student.gpa.toString()) {
                updates.newGpa = parseFloat(editGpa);
            }
            if (editPortfolio !== (student.portfolio || "")) {
                updates.newPort = editPortfolio;
            }
            if (editGraduation !== student.graduation) {
                updates.newGrad = editGraduation;
            }
            if (JSON.stringify(editMajor) !== JSON.stringify(student.major)) {
                updates.newMajor = editMajor;
            }

            const response = await fetch("/api/students/updateStudentProfile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                await fetchStudentData(session.user.id);
                setIsEditing(false);
            } else {
                console.error("Failed to update profile");
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile");
        } finally {
            setSaving(false);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkill.trim() || !session?.user?.id) return;

        setSaving(true);
        try {
            const response = await fetch("/api/students/updateStudentProfile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: session.user.id,
                    newSkill: newSkill.trim(),
                }),
            });

            if (response.ok) {
                await fetchStudentData(session.user.id);
                setNewSkill("");
            } else {
                console.error("Failed to add skill");
                alert("Failed to add skill");
            }
        } catch (error) {
            console.error("Error adding skill:", error);
            alert("Error adding skill");
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveSkill = async (skillToRemove: string) => {
        if (!session?.user?.id) return;

        setSaving(true);
        try {
            const updatedSkills = student!.skills.filter((skill) => skill !== skillToRemove);

            const response = await fetch("/api/students/updateStudentProfile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: session.user.id,
                    newSkills: updatedSkills,
                }),
            });

            if (response.ok) {
                await fetchStudentData(session.user.id);
            } else {
                console.error("Failed to remove skill");
                alert("Failed to remove skill");
            }
        } catch (error) {
            console.error("Error removing skill:", error);
            alert("Error removing skill");
        } finally {
            setSaving(false);
        }
    };

    const handleAddMajor = () => {
        setEditMajor([
            ...editMajor,
            { level: "Bachelor's", name: "", gradYear: "" },
        ]);
    };

    const handleRemoveMajor = (index: number) => {
        setEditMajor(editMajor.filter((_, i) => i !== index));
    };

    const handleUpdateMajor = (
        index: number,
        field: keyof Major,
        value: string
    ) => {
        const updatedMajor = [...editMajor];
        updatedMajor[index] = { ...updatedMajor[index], [field]: value };
        setEditMajor(updatedMajor);
    };
    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated" || session?.user.userType != 'student') {
            router.push("/login");
            return;
        }
        if (status === "authenticated" && session?.user?.id) {
            fetchStudentData(session.user.id);
        }
    }, [status, session, router, fetchStudentData]);

    function translateDegree(level: string): string {
        const degrees: Record<string, string> = {
            "Bachelor's": "B.S",
            "Master's": "M.S",
            Phd: "PHD",
        };

        const degree = degrees[level];
        console.log(degree);
        return degree;
    }

    const getColorFromName = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colors = ["bg-red-500/90", "bg-pink-500/90", "bg-rose-500/90"];

        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };
    if (loading || status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-white">Student not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-400">
            <HeaderWithSidebar />
            <div className="flex flex-col items-center">
                {/* name and other info */}
                <div className="flex flex-col border border-slate-500  bg-white w-full justify-center mt-10 max-w-7xl md:max-w-5xl items-start-safe">
                    <div className="flex justify-between w-full bg-gray-200 p-5 ">
                        <div className="flex justify-start">
                            <div className="rounded-full border-black border-2 flex justify-center items-center ">
                                <ProfileImage name={student.name} size={100} />
                            </div>
                            <div className="flex flex-col items-baseline">
                                <div className=" ml-5 mt-2">
                                    <h1 className="font-bold text-xl text-black">
                                        {student.name}
                                    </h1>
                                </div>
                                <div className="mt-5">
                                    <h1 className="text-sm text-slate-500">
                                        Email:
                                        <span className="text-black font-semibold">
                                            {student.email}
                                        </span>
                                    </h1>
                                    <h1 className="text-sm text-slate-500">
                                        GPA:
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="4"
                                                value={editGpa}
                                                onChange={(e) => setEditGpa(e.target.value)}
                                                className="ml-2 px-2 py-1 border border-slate-300 rounded text-black font-semibold w-20"
                                            />
                                        ) : (
                                            <span className="text-black font-semibold">
                                                {student.gpa}
                                            </span>
                                        )}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 h-[50px] hover:cursor-pointer disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={handleEditToggle}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 h-[50px] hover:cursor-pointer disabled:opacity-50"
                                    >
                                        <X size={18} />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleEditToggle}
                                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-amber-500 h-[40px] hover:cursor-pointer"
                                >
                                    <Edit2 size={18} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                    {/* degree stuff */}
                    <div className="max-w-7xl md:max-w-5xl border border-slate-400" />
                    <div className="flex flex-col w-full justify-start p-5 ">
                        <h1 className="font-semibold text-md text-slate-500">
                            Degree
                        </h1>
                        <div className="max-w-7xl md:max-w-5xl bg-gray-200/20 p-5">
                            {isEditing ? (
                                <div className="space-y-4">
                                    {editMajor.map((major, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-3 items-start border border-slate-300 p-3 rounded bg-white"
                                        >
                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <label className="block text-xs text-slate-600 mb-1">
                                                        Degree Level
                                                    </label>
                                                    <select
                                                        value={major.level}
                                                        onChange={(e) =>
                                                            handleUpdateMajor(
                                                                index,
                                                                "level",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-slate-300 rounded text-black"
                                                    >
                                                        <option value="Bachelor's">
                                                            Bachelor's
                                                        </option>
                                                        <option value="Master's">
                                                            Master's
                                                        </option>
                                                        <option value="Phd">
                                                            PhD
                                                        </option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-600 mb-1">
                                                        Major Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={major.name}
                                                        onChange={(e) =>
                                                            handleUpdateMajor(
                                                                index,
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="e.g., Computer Science"
                                                        className="w-full px-3 py-2 border border-slate-300 rounded text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-600 mb-1">
                                                        Graduation Year
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={major.gradYear}
                                                        onChange={(e) =>
                                                            handleUpdateMajor(
                                                                index,
                                                                "gradYear",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="e.g., 2025"
                                                        className="w-full px-3 py-2 border border-slate-300 rounded text-black"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemoveMajor(index)
                                                }
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={handleAddMajor}
                                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-amber-500 hover:cursor-pointer"
                                    >
                                        <Plus size={18} />
                                        Add Major
                                    </button>
                                </div>
                            ) : student.major.length === 0 ? (
                                <p className="text-slate-400">
                                    No major listed
                                </p>
                            ) : (
                                student.major.map((major, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-baseline-center mb-3"
                                    >
                                        <div className="flex gap-2">
                                            <div
                                                className={`${getColorFromName(major.name)} w-15 h-10 justify-center items-center flex`}
                                            >
                                                <h2 className="font-bold text-md text-black">
                                                    {translateDegree(
                                                        major.level
                                                    )}
                                                </h2>
                                            </div>
                                            <div className="flex flex-col">
                                                <h1 className="font-bold text-md text-slate-500">
                                                    {major.name}
                                                </h1>
                                                <h1 className="font-bold text-xs text-slate-600">
                                                    Graduation: {major.gradYear}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {/* section */}
                        <div>
                            <h1 className="font-semibold text-md text-slate-500 mt-5">
                                Section
                            </h1>
                            <div className="max-w-7xl md:max-w-5xl bg-gray-200/20 p-5">
                                {!section ? (
                                    <p className="text-slate-400">
                                        Not enrolled in any section
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-black">Section {section.sec_number}</span>
                                            <span className="text-xs bg-slate-200 px-2 py-1 rounded text-black">Code: {section.code}</span>
                                        </div>
                                        <div className="text-sm text-slate-600 space-y-1">
                                            <p><span className="font-semibold">Time:</span> {section.time}</p>
                                            <p><span className="font-semibold">Days:</span> {section.days}</p>
                                            <p><span className="font-semibold">Location:</span> {section.location}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* group */}
                        <div>
                            <h1 className="font-semibold text-md text-slate-500 mt-5">
                                Group
                            </h1>
                            <div className="max-w-7xl md:max-w-5xl bg-gray-200/20 p-5">
                                {!group ? (
                                    <p className="text-slate-400">
                                        Not a member of any group
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-md text-black">{group.name}</span>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            <p>
                                                <span className="font-semibold">Group Leader:</span>{' '}
                                                {group.group_master.name}
                                                {session?.user?.id === group.group_master_id && (
                                                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">You</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* portfolio */}
                        <div>
                            <h1 className="font-semibold text-md text-slate-500 mt-5">
                                Portfolio
                            </h1>
                            <div className="max-w-7xl md:max-w-5xl bg-gray-200/20 p-5">
                                {isEditing ? (
                                    <input
                                        type="url"
                                        value={editPortfolio}
                                        onChange={(e) => setEditPortfolio(e.target.value)}
                                        placeholder="https://yourportfolio.com"
                                        className="w-full px-3 py-2 border border-slate-300 rounded text-black"
                                    />
                                ) : !student.portfolio ? (
                                    <div>
                                        <h1 className="text-slate-400">
                                            {" "}
                                            No portfolio listed
                                        </h1>
                                    </div>
                                ) : (
                                    <div className="flex items-baseline-start gap-2">
                                        <ChevronRightSquare className="text-black" />{" "}
                                        <a href={student.portfolio} target="_blank" rel="noopener noreferrer">
                                            <span className="text-black text-md font-semibold hover:underline">
                                                {student.portfolio}
                                            </span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* skills */}
                        <div>
                            <h1 className="font-semibold text-md text-slate-500 mt-5">
                                Skills
                            </h1>
                            <div className="max-w-7xl md:max-w-5xl bg-gray-200/20 p-5">
                                {student.skills.length === 0 && !isEditing ? (
                                    <p className="text-slate-400">
                                        No skills listed
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {student.skills.map((skill, index) => (
                                            <div
                                                className="flex gap-2 items-center text-black bg-slate-100 px-3 py-1 rounded group"
                                                key={skill + index}
                                            >
                                                <Circle className="text-black w-[10px] h-[10px]" />
                                                <span>{skill}</span>
                                                {isEditing && (
                                                    <button
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        disabled={saving}
                                                        className="ml-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                                                        title="Remove skill"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {isEditing && (
                                    <div className="mt-4 flex gap-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddSkill();
                                                }
                                            }}
                                            placeholder="Add a new skill"
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded text-black"
                                        />
                                        <button
                                            onClick={handleAddSkill}
                                            disabled={saving || !newSkill.trim()}
                                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-amber-500 hover:cursor-pointer disabled:opacity-50"
                                        >
                                            <Plus size={18} />
                                            Add Skill
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
