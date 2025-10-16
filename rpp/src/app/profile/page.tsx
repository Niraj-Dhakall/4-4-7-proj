'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import HeaderWithSidebar from "@/components/headerWithSidebar";
import ProfileImage from "@/components/profilePicture";
// TODO: add authencation stuff

export default function ProfilePage(){
    return(
        <div className="min-h-screen bg-white">
            <HeaderWithSidebar/>
            <div className="flex flex-col items-center">
                {/* name and other info */}
                <div className="flex flex-col border border-slate-500  w-full justify-center mt-10 max-w-7xl md:max-w-5xl items-start-safe">
                    <div className="flex justify-start w-full bg-gray-200 p-5 ">
                        <div className="rounded-full border-black border-2 flex justify-center items-center ">
                            <ProfileImage name={"John Doe"} size={100}/>
                        </div>
                        <div className="flex flex-col items-baseline">
                            <div className=" ml-5 mt-2">
                                <h1 className="font-bold text-xl text-black">John Doe</h1>
                                
                            </div>
                            <div className="mt-5">
                                <h1 className="text-sm text-slate-500"> Email:<span className="text-black font-semibold"> johnd1@umbc.edu</span></h1>
                            </div>
                        </div>
                    </div> 
                    <div className="max-w-7xl md:max-w-5xl border border-slate-400"/>
                    <div className="flex flex-col w-full justify-start p-5 ">
                        <h1 className="font-semibold text-md text-slate-500">Degree</h1>
                        <div className="max-w-7xl md:max-w-5xl bg-gray-200/20 p-5">
                            <div className="flex gap-2 items-baseline-center">
                                <div className="bg-yellow-400/50 w-15 h-10 justify-center items-center flex">
                                        <h2 className="font-bold text-sm text-black">B.S</h2>
                                        
                                    </div>
                                <div className="flex flex-col">
                                    <h1 className="font-bold text-md text-slate-500">Bachelors of Science - Computer Science</h1>
                                    <h1 className="font-bold text-xs text-slate-500">Spring 2026</h1>
                                    
                                </div>
                                
                            </div>


                        </div>
                    </div>
                </div>

                 
            </div>
        </div>

    );
}
