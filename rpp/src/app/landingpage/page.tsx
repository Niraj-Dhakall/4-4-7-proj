'use client'

import Image from "next/image";
import { z, ZodError } from 'zod'
import { useState } from 'react'
import { useRouter } from "next/navigation"
import { Finger_Paint } from 'next/font/google'

const fingerpaint = Finger_Paint({
  subsets: ["latin"],
  weight: "400",
});


export default function LandingPage() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-[url('/blackandgold.png')] bg-cover bg-center">
      <div className="flex justify-end ">
              <button onClick={() => router.push('/login')} className="rounded-lg p-2 from-white-100 to-white-300 cursor-pointer mr-4 ">
                              <h1 className="rounded-lg p-2 bg-black mt-5 hover:text-amber-500 text-white font-semibold"> Get Started </h1>
                            </button>

        </div>
        <div className="flex flex-col ">

          <h1 className ={`${fingerpaint.className} font-bold text-5xl hover:text-amber-900 text-black p-20 mr-150`}>Retriever Proposal Portal</h1>
          <h1 className ={`${fingerpaint.className} font-semibold text-black hover:text-amber-900 text-3xl  ml-90`}> Imagination Becomes Reality.</h1> 
                
          <div>

          </div>
        </div>
      
    </div>
  );
}
