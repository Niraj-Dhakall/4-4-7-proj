"use client";

import { useRouter } from "next/navigation";
import { Finger_Paint } from "next/font/google";
import Image from "next/image";

const fingerpaint = Finger_Paint({
  subsets: ["latin"],
  weight: "400",
});

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 flex flex-col">
      {/* Navigation Bar */}
      <header className="flex justify-between bg-black items-center px-4 sm:px-8 lg:px-12 py-6">
        <h1 className={`${fingerpaint.className} text-2xl sm:text-3xl font-bold text-white`}>
          Retriever <span className="text-amber-700">Proposal Portal</span>
        </h1>

        <nav className="flex gap-8 text-white font-medium">
          <button
            onClick={() => router.push("/contact")}
            className="border border-white hover:bg-amber-500 hover:text-white px-4 py-2 font-semibold transition"
          >
            Contact
          </button>
        </nav>
      </header>

      {/* Description */}
      <div className="flex flex-col justify-center flex-1 px-4 sm:px-8 lg:px-12 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-10">
            {/* Text */}
            <div className="w-full max-w-2xl">
              <h2
                className={`${fingerpaint.className} text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight break-words`}
              >
                Imagination Becomes REALITY
              </h2>

              <p className="text-black/80 text-base sm:text-lg leading-relaxed">
                The Retriever Proposal Portal bridges creativity and collaboration at UMBC. It’s a space where
                students, faculty, and industry partners can present innovative ideas, explore potential solutions,
                and contribute to real projects that enhance campus life. Whether proposing, supporting, or testing
                new initiatives, Retrievers can turn classroom knowledge into tangible, community driven impact.
              </p>

              <button
                onClick={() => router.push("/login")}
                className="mt-8 border border-black text-black hover:bg-black hover:text-white px-6 py-2 font-semibold transition"
              >
                Get Started
              </button>
            </div>

            {/* Image */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <Image
                src="/pawprints.png"
                alt="Paw prints"
                width={320}
                height={320}
                className="w-40 h-40 sm:w-56 sm:h-56 lg:w-80 lg:h-80 object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
