
'use client'

import { useRouter } from 'next/navigation'
import { Finger_Paint } from 'next/font/google'

const fingerpaint = Finger_Paint({
  subsets: ['latin'],
  weight: '400',
})

export default function LandingPage() {
  const router = useRouter()

  return (
    //  Fullscreen gold background
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 flex flex-col">

      {/* Navigation Bar */}
      <header className="flex justify-between bg-black items-center px-12 py-6">
        {/* Logo / Brand Name */}
        <h1 className={`${fingerpaint.className} text-3xl font-bold text-white`}>
          Retriever<span className="text-amber-700"> Proposal Portal</span>
        </h1>

        {/* Contact */}
        <nav className="flex gap-8 text-white font-medium">
          <button 
            onClick={() => router.push('/contact')}
            className="border border-white hover:bg-amber-500 hover:text-white px-4 py-2  font-semibold transition"
          >
            Contact
          </button>
        </nav>
      </header>

      {/* Description */}
      <div className="flex flex-col justify-center flex-1  px-12">
        <div className=" ml-30 mb-14">
          <div className='flex justify-around'>
            <div className='flex flex-col max-w-2xl'>
              <h2 className={`${fingerpaint.className} text-6xl font-bold text-black mb-6`}>
                Imagination Becomes REALITY
              </h2>
              <p className="text-black/80 text-lg leading-relaxed">
              The Retriever Proposal Portal bridges creativity and collaboration at UMBC. 
              It’s a space where students, faculty, and industry partners can present innovative ideas, explore potential solutions, and 
              contribute to real projects that enhance campus life. Whether proposing, supporting, or testing new initiatives, Retrievers
              can turn classroom knowledge into tangible, community driven impact.
              </p>

              <div className='max-w-xl'>
                <button 
                onClick={() => router.push('/login')}
                className="mt-8 border  border-black text-black hover:bg-black hover:text-white px-6 py-2 font-semibold transition"
              >
                Get Started
              </button>
              </div>
            </div>
            <div className='flex justify-start w-full'>
              <img
                  src="/pawprints.png"
                  alt="Paw prints"
                  className="w-120 h-120  ml-50"
                />
            </div>
          </div>


              </div>  
                </div>

              

    </div>
  )
}
