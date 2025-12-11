"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";




export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    

    useEffect(() => {
        if (status === "loading") return;
        if (session?.user.userType == "stakeholder") {
            router.push("/profile/stakeholder");
            return;
        } else if (session?.user.userType == "student") {
            router.push("/profile/student");
        }else if( session?.user.userType == 'admin'){
            router.push("/profile/admin")
        }else {
            router.push("/login");
        }
    }, [status, session, router]);

    return (
        <div className="flex w-full h-full justify-center items-center">
            <h1 className="text-black">hi</h1>
        </div>
    );
}
