"use client";

//import Image from "next/image";
import { z, ZodError } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ErrorComponent from "@/components/error";

interface Error {
    Type: string;
    Message: string;
}
export default function SignUp() {
    const router = useRouter();
    const [errorProp, setError] = useState<Error>({ Type: "", Message: "" });
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
    });

    async function handleSubmit() {
        try {
            const res = await fetch("/api/students/addStudent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (!res.ok) {
                setError({ Type: "Fail", Message: data.error });
            } else {
                setError({
                    Type: "Success",
                    Message: "Account created, please login",
                });
            }
        } catch (error: any) {
            console.log(error);
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    return (
        <div className="bg-[url('/blackandgold.png')] bg-cover bg-center justify-center flex  min-h-screen p-8 pb-20  sm:p-20">
            <div className="flex items-center flex-col bg-gray-100 w-[320px] h-[450px] mt-15 ">
                <div className="flex flex-col mt-4">
                    {errorProp.Message ? (
                        <ErrorComponent
                            Type={errorProp.Type}
                            Message={errorProp.Message}
                        />
                    ) : (
                        <div className="mt-8" />
                    )}
                    <h1 className="text-gray-200 font-semibold  text-center mt-2 bg-black   p-2 ">
                        {" "}
                        Proposal Portal{" "}
                    </h1>
                    <form>
                        <div className="flex flex-col">
                            <label
                                htmlFor="email"
                                className="text-sm text-black font-bold mt-5"
                            >
                                {" "}
                                Email Address{" "}
                            </label>
                            <input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="username@domain.com"
                                className="border-black text-black placeholder-gray-400 border-[1px] p-2 "
                            />
                            <label
                                htmlFor="Name"
                                className="text-sm text-black font-bold mt-5"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Full Name"
                                className="border-black text-black placeholder-gray-400 border-[1px] p-2 "
                            />
                            <label
                                htmlFor="password"
                                className="text-sm text-black font-bold mt-5"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Password"
                                className="border-black text-black placeholder-gray-400 border-[1px] p-2 "
                            />
                        </div>

                        {/* <div className='flex items-center mt-3'>
                 <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e => setRememberMe(e.target.checked))}
              className="h-3.5 w-3.5 text-amber-500  focus:ring-amber-400 border-gray-500  mb-2"
              />
              <div><label htmlFor="rememberMe" className="  ml-2 block text-sm text-gray-900 mb-2">Remember Me</label></div>
            </div> */}
                    </form>
                    <div className="flex flex-col justify-baseline items-end w-full mt-1">
                        <button
                            onClick={() => handleSubmit()}
                            className="bg-black hover:text-amber-500 font-bold  p-2 cursor-pointer"
                        >
                            Sign Up
                        </button>
                        <h3 className="text-black text-sm">
                            or
                            <span
                                className="text-black hover:text-amber-500 hover:cursor-pointer"
                                onClick={() => router.push("/login")}
                            >
                                Sign In
                            </span>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
