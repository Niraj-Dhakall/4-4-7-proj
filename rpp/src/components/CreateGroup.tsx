"use client";
import React from "react";
import { useState } from "react";
import { Checkbox, Label } from "flowbite-react";
import SearchForStudent from "./searchForStudent";
import { useSession } from "next-auth/react";
interface Student {
    id: string;
    email: string;
    name: string;
    major: string[];
    year: string;
    gpa: number;
    skills: string[];
    courses: string[];
    graduation: string;
    applications: string[];
    accepted: string[];
    portfolio: string | null;
}

export default function CreateGroup() {
    //     model Groups{
    //   id              String @id @default(auto()) @map("_id") @db.ObjectId
    //   name            String
    //   group_master    Students @relation(fields: [group_master_id], references: [id])
    //   group_master_id String @db.ObjectId
    //   members         String[] @db.ObjectId
    //   member_count    Int
    // }
    const [formData, setFormData] = useState({
        name: "",
        group_master_id: "",
    });
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null
    );
    const [isSelfLeader, setIsSelfLeader] = useState(true);
    const session = useSession();
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStudentSelect = (student: Student) => {
        setSelectedStudent(student);
        setIsSelfLeader(false);
    };

    const handleCheckboxChange = (checked: boolean) => {
        setIsSelfLeader(checked);
        if (checked) {
            setSelectedStudent(null);
        }
    };

    const handleSubmit = () => {
        if (isSelfLeader) {
            formData.group_master_id = session.data?.user.id || "";
        } else {
            formData.group_master_id = selectedStudent?.id || "";
        }
        console.log(formData);
    };
    return (
        <div className="flex flex-col border border-slate-500  bg-white rounded w-full justify-center mt-10 max-w-xl md:max-w-md items-start-safe">
            <div className="flex justify-center w-full bg-gray-200 p-4 ">
                <h1 className="text-black font-bold text-xl">
                    Create A CMSC447 Group
                </h1>
            </div>
            <div className="p-6 w-full">
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-black">
                            Group Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            className="text-black border border-slate-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                            value={formData.name}
                            placeholder="Group Name"
                            onChange={handleChange}
                        ></input>
                    </div>
                    <div className="flex flex-col items-start mt-2">
                        <label htmlFor="group_master" className="text-black">
                            Who will be group leader?
                        </label>
                        <div className="flex gap-2 border border-slate-500 rounded p-2 w-full">
                            <Checkbox
                                id="accept"
                                checked={isSelfLeader}
                                onChange={(e) =>
                                    handleCheckboxChange(e.target.checked)
                                }
                            />
                            <Label
                                htmlFor="accept"
                                className="flex text-black text-lg"
                            >
                                I will be group leader
                            </Label>
                        </div>
                    </div>
                </div>
                <div className="mt-2 flex flex-col ">
                    <h1 className="text-black">or search for their email:</h1>
                    <div>
                        <SearchForStudent
                            onStudentSelect={handleStudentSelect}
                        />
                    </div>
                    {selectedStudent && (
                        <div className="mt-3 p-4 border bg-slate-200 border-slate-300 rounded-md">
                            <h3 className="text-black font-semibold mb-2">
                                Selected Group Leader:
                            </h3>
                            <div className="text-sm">
                                <p className="text-gray-800 font-medium">
                                    {selectedStudent.name}
                                </p>
                                <p className="text-gray-600">
                                    {selectedStudent.email}
                                </p>
                                <p className="text-gray-600">
                                    Year: {selectedStudent.year}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedStudent(null);
                                    setIsSelfLeader(true);
                                }}
                                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
                <div className="w-full flex justify-end mt-3">
                    <button
                        className="p-2 rounded bg-black text-white"
                        onClick={handleSubmit}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
