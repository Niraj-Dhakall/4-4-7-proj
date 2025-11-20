"use client";
import React from "react";
import { useState } from "react";
import GoBackButton from "./GoBackButton";
import { AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

// model Groups{
//   id              String @id @default(auto()) @map("_id") @db.ObjectId
//   name            String
//   group_master    Students @relation(fields: [group_master_id], references: [id])
//   group_master_id String @db.ObjectId
//   members         String[] @db.ObjectId
//   member_count    Int
// }
interface Group {
    id: string;
    name: string;
    member_count: number;
    members: string[];
    group_master: {
        id: string;
        name: string;
        email: string;
    };
}
export default function JoinGroup() {
    const [formData, setFormData] = useState({
        name: "",
    });
    const [error, setError] = useState<{
        message: string;
        type: string;
    } | null>(null);
    // useEffect(() => {
    //     setError({ message: "TEST", type: "success" });
    // }, []);
    const session = useSession();
    const [selectedGroup, setSelectedGroup] = useState<Group>();
    const [searchResult, setSearchResult] = useState<Group>();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    async function handleSubmit() {
        // const {studentID, groupID, groupName} =  body;
        const requestBody = {
            studentID: session.data?.user.id,
            groupID: selectedGroup?.id,
        };
        try {
            const res = await fetch("/api/groups/joinGroup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });
            const body = await res.json();
            if (!res.ok) {
                setError({ message: body.message, type: "error" });
                return;
            } else {
                setError({
                    message: "Group joined successfully",
                    type: "success",
                });
                return;
            }
        } catch (error) {
            setError({
                message:
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
                type: "error",
            });
        }
    }
    async function handleSearch() {
        if (!formData.name) {
            setError({ message: "Group name is required", type: "error" });
            return;
        }

        setSearchResult(undefined);
        setError(null);

        try {
            const res = await fetch(
                `/api/groups/getGroupByName?name=${encodeURIComponent(formData.name)}`,
                {
                    method: "GET",
                }
            );

            const body = await res.json();
            if (!res.ok) {
                setError({ message: body.message, type: "error" });
                return;
            }
            setSearchResult(body);
        } catch (error) {
            setError({
                message:
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred",
                type: "error",
            });
        }
    }
    return (
        <div className="flex flex-col border border-slate-500  bg-white rounded w-full justify-center mt-10 max-w-xl md:max-w-md items-start-safe">
            <div className="flex justify-center w-full bg-gray-200 p-4 ">
                <h1 className="text-black font-bold text-xl">
                    Join A CMSC447 Group
                </h1>
            </div>
            <div className="flex w-full justify-start">
                <GoBackButton route={"/portal"} />
            </div>
            <div className="p-5 w-full">
                {error && (
                    <div
                        className={`w-full flex p-2 rounded gap-2  mb-2 ${error.type === "error" ? "bg-red-300" : error.type === "success" ? "bg-green-200" : ""}`}
                    >
                        <AlertCircle className="text-black" />
                        <div>
                            <p className="text-black font-semibold">
                                {error.message}
                            </p>
                        </div>
                    </div>
                )}
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
                <div className="w-full mt-4">
                    {searchResult && !selectedGroup && (
                        <div
                            onClick={() => setSelectedGroup(searchResult)}
                            className="bg-white border-2 border-slate-300 rounded-lg p-4  hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-black font-semibold text-lg">
                                        {searchResult.name}
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">
                                                Group Leader:
                                            </span>
                                            {searchResult.group_master.name}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">
                                                Members:
                                            </span>
                                            {searchResult.member_count}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {selectedGroup && (
                    <div className="w-full mt-4">
                        <div className="rounded-lg border bg-slate-200 border-black p-4">
                            <div className="flex items-center justify-between mb-2 flex-wrap">
                                <h4 className="text-black font-semibold text-sm">
                                    Selected Group
                                </h4>
                                <button
                                    onClick={() => setSelectedGroup(undefined)}
                                    className="text-gray-500 hover:text-gray-700 hover:cursor-pointer text-sm "
                                >
                                    Deselect
                                </button>
                            </div>
                            <h3 className="text-black font-bold text-lg">
                                {selectedGroup.name}
                            </h3>
                            <div className="mt-2 space-y-1">
                                <p className="text-gray-700 text-sm">
                                    <span className="font-medium">
                                        Group Leader:
                                    </span>
                                    {selectedGroup.group_master.name}
                                </p>
                                <p className="text-gray-700 text-sm">
                                    <span className="font-medium">
                                        Members:
                                    </span>
                                    {selectedGroup.member_count}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {selectedGroup && (
                    <div className="w-full flex justify-end mt-3">
                        <button
                            className="p-2 rounded hover:cursor-pointer  w-full bg-amber-400 hover:bg-black text-white"
                            onClick={handleSubmit}
                        >
                            Join
                        </button>
                    </div>
                )}
                {!selectedGroup && (
                    <div className="w-full flex justify-end mt-3">
                        <button
                            className="p-2 rounded bg-black hover:cursor-pointer w-full text-white"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
