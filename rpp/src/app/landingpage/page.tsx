'use client'

import Image from "next/image";
import { z, ZodError } from 'zod'
import { useState } from 'react'
import { useRouter } from "next/navigation"
import { Finger_Paint } from 'next/font/google'

//Load custom Google font
const fingerpaint = Finger_Paint({
  subsets: ["latin"],
  weight: "400",
});

export default function LandingPage() {
  const router = useRouter()
  
  return (
    //  Root container — sets full-screen layout and background image
    <div className="min-h-screen bg-[url('/blackandgold.png')] bg-cover bg-center">

      {/*  Header Section — contains the "Get Started" button on top-right */}
      <div className="flex justify-end">
        <button 
          onClick={() => router.push('/login')} 
          className="rounded-lg p-2 from-white-100 to-white-300 cursor-pointer mr-4"
        >
          <h1 className="rounded-lg p-2 bg-black mt-5 hover:text-amber-500 text-white font-semibold">
            Get Started
          </h1>
        </button>
      </div>

      {/* Main Content Section — central title and tagline */}
      <div className="flex flex-col">
        
        {/* Title / Hero Heading */}
        <h1 
          className={`${fingerpaint.className} font-bold text-5xl hover:text-amber-900 text-black ml-10 p-10 `}
        >
          Retriever Proposal Portal
        </h1>

        {/*  Tagline / Subtext */}
        <h1 
          className={`${fingerpaint.className} font-semibold text-black p-5 hover:text-amber-900 text-3xl ml-70`}
        >
          Imagination Becomes Reality.
        </h1>

        {/*  Placeholder for additional content if needed later */}
        <div></div>
      </div>
    </div>
  );
}
