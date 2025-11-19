"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ErrorComponent from "@/components/error";
import { signIn } from "next-auth/react";

interface Error {
    Type: string;
    Message: string;
}

export default function StakeholderSignup() {
    const router = useRouter();
    const [errorProp, setError] = useState<Error>({ Type: "", Message: "" });
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [verifiedCode, setVerifiedCode] = useState("");

    const [codeData, setCodeData] = useState({
        email: "",
        code: "",
    });

    const [signupData, setSignupData] = useState({
        name: "",
        affiliation: "",
        password: "",
        confirmPassword: "",
    });

    async function handleCodeVerification(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError({ Type: "", Message: "" });

        try {
            const res = await fetch("/api/stakeholders/verifyStakeholderCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: codeData.code }),
            });

            const data = await res.json();

            if (res.ok) {
                setVerifiedCode(codeData.code);
                setStep(2);
            } else {
                setError({
                    Type: "Error",
                    Message: data.message || "Invalid code",
                });
            }
        } catch (error) {
            setError({
                Type: "Error",
                Message: "Failed to verify code. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError({ Type: "", Message: "" });

        if (signupData.password !== signupData.confirmPassword) {
            setError({
                Type: "Error",
                Message: "Passwords do not match",
            });
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/stakeholders/createStakeholder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: signupData.name,
                    affiliation: signupData.affiliation,
                    email: codeData.email,
                    password: signupData.password,
                    code: verifiedCode,
                    projects: [],
                }),
            });

            const data = await res.json();

            if (res.ok) {
                const result = await signIn("credentials", {
                    email: codeData.email,
                    password: signupData.password,
                    redirect: false,
                });

                if (result?.ok) {
                    router.push("/profile");
                } else {
                    setError({
                        Type: "Error",
                        Message:
                            "Account created but sign-in failed. Please login manually.",
                    });
                }
            } else {
                setError({
                    Type: "Error",
                    Message: data.message || "Failed to create account",
                });
            }
        } catch (error) {
            setError({
                Type: "Error",
                Message: "Failed to create account. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCodeData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-[url('/blackandgold.png')] bg-cover bg-center justify-center flex min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <div className="flex items-center flex-col bg-gray-100 w-[400px] h-fit p-4 mt-15">
                <div className="flex flex-col mt-2 w-full px-4">
                    {errorProp.Message ? (
                        <ErrorComponent
                            Type={errorProp.Type}
                            Message={errorProp.Message}
                        />
                    ) : (
                        <div className="mt-8" />
                    )}
                    <h1 className="text-gray-200 font-semibold text-center bg-black p-2 mt-2">
                        {step === 1
                            ? "Welcome Stakeholder!"
                            : "Complete Your Profile"}
                    </h1>

                    {step === 1 ? (
                        <form onSubmit={handleCodeVerification}>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="email"
                                    className="text-sm text-black font-semibold pt-5 p-1"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={codeData.email}
                                    onChange={handleCodeChange}
                                    required
                                    placeholder="username@domain.com"
                                    className="border-black text-black placeholder-gray-400 border-[1px] p-2"
                                />

                                <label
                                    htmlFor="code"
                                    className="text-sm text-black font-semibold pt-5"
                                >
                                    Access Code
                                </label>
                                <input
                                    id="code"
                                    name="code"
                                    type="text"
                                    value={codeData.code}
                                    onChange={handleCodeChange}
                                    required
                                    placeholder="Enter your access code"
                                    className="border-black text-black placeholder-gray-400 border-[1px] p-2"
                                />
                            </div>
                            <div className="flex justify-start w-full mt-5">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-black font-semibold text-white hover:text-amber-400 p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Verifying..." : "Verify Code"}
                                </button>
                            </div>
                            <div className="p-3">
                                <p className="text-slate-500 text-sm">
                                    Please enter the code provided to you.
                                    After, you will be able to create a
                                    password.
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup}>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="name"
                                    className="text-sm text-black font-semibold pt-5 p-1"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={signupData.name}
                                    onChange={handleSignupChange}
                                    required
                                    placeholder="John Doe"
                                    className="border-black text-black placeholder-gray-400 border-[1px] p-2"
                                />

                                <label
                                    htmlFor="affiliation"
                                    className="text-sm text-black font-semibold pt-5 p-1"
                                >
                                    Affiliation
                                </label>
                                <input
                                    id="affiliation"
                                    name="affiliation"
                                    type="text"
                                    value={signupData.affiliation}
                                    onChange={handleSignupChange}
                                    required
                                    placeholder="Company/University"
                                    className="border-black text-black placeholder-gray-400 border-[1px] p-2"
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
                                    value={signupData.password}
                                    onChange={handleSignupChange}
                                    required
                                    placeholder="Create a password"
                                    className="border-black text-black placeholder-gray-400 border-[1px] p-2"
                                />

                                <label
                                    htmlFor="confirmPassword"
                                    className="text-sm text-black font-semibold pt-5"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={signupData.confirmPassword}
                                    onChange={handleSignupChange}
                                    required
                                    placeholder="Confirm your password"
                                    className="border-black text-black placeholder-gray-400 border-[1px] p-2"
                                />
                            </div>
                            <div className="flex justify-between w-full mt-5 gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(1);
                                        setError({ Type: "", Message: "" });
                                    }}
                                    className="bg-gray-500 font-semibold text-white hover:bg-gray-600 p-2 cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-black font-semibold text-white hover:text-amber-400 p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading
                                        ? "Creating Account..."
                                        : "Create Account"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
