'use client'
import React, { useState } from "react";
import Header from "@/components/header";
import ProjectPost from "@/components/projectPost";
import { SidebarComponent } from "@/components/sidebar";
import { useRouter } from "next/navigation"
import { AiOutlinePlus } from "react-icons/ai";
import HeaderWithSidebar from "@/components/headerWithSidebar";


export default function Portal() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()



    return (
        <div className="w-full">
            <div>
                <HeaderWithSidebar />
            </div>

            <div className="flex justify-center items-center">
                <button onClick={() => router.push('/portalrequest')} className="flex font-semibold border hover:border-red-500 hover:cursor-pointer text-center btn-prmary  bg-black text-amber-200 rounded-lg p-2 ">
                    Create <AiOutlinePlus size={25} />
                </button>

            </div>



        </div>



    );
}