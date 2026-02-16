"use client";



import { useState } from "react";
import { useRouter } from "next/navigation";

import ErrorComponent from "@/components/error";
import { signIn } from "next-auth/react";
interface Error {
    Type: string;
    Message: string;
}


export default function Login() {
    const router = useRouter();
    const [errorProp, setError] = useState<Error>({ Type: "", Message: "" });

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    async function handleSubmit() {
        const email = formData.email;
        const password = formData.password;
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            console.log(res.error);
            setError({ Type: "Fail", Message: "Invalid email or password" });
        } else if (res?.ok) {
            setError({ Type: "Success", Message: "Login successful!" });
            router.push("/portal");
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-[url('/blackandgold.png')] bg-cover bg-center justify-center flex items-center min-h-screen w-full px-4 py-10">
            <div className="flex  flex-col bg-gray-100 w-full max-w-md  p-8 rounded-md shadow-lg space-y-4">
                <div className="flex flex-col mt-2">
                    {errorProp.Message ? (
                        <ErrorComponent
                            Type={errorProp.Type}
                            Message={errorProp.Message}
                        />
                    ) : (
                        <div className="mt-8" />
                    )}
                    <h1 className="text-gray-200 font-semibold rounded-md shadow-lg text-center bg-black p-2 mt-2">
                        Proposal Portal
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label
                                htmlFor="email"
                                className="text-sm text-black font-semibold pt-5  p-1"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="username@domain.com"
                                className="border-black text-black rounded-md hover:ring-1  placeholder-gray-400 border-[1px]  p-2"
                            />

                            <label
                                htmlFor="password"
                                className="text-sm text-black font-semibold pt-5"
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
                                placeholder="password"
                                className="border-black rounded-md hover:ring-1  text-black placeholder-gray-400 border-[1px] p-2 "
                            />
                        </div>
                    </form>

                    

                    <div className="flex justify-end w-full mt-4 ">
                        
                        
                        <div>
                            <button
                            onClick={() => handleSubmit()}
                            className="bg-black font-semibold rounded-md text-white  hover:text-amber-400 shadow-lg  p-2 cursor-pointer"
                        >
                            Login
                        </button>
                        
                        </div>
                        
                    </div>


                    <div className="flex justify-center w-full mt-6">
                        <p className="text-sm text-black">
                            Don’t have an account?{" "}
                            <button
                                onClick={() => router.push("/Signup")}
                                className="text-purple-600 underline hover:text-purple-800 cursor-pointer"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
