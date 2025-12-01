"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Invite() {
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = async () => {
    if (divRef.current) {
      const textToCopy = divRef.current.innerText;
      try {
        await navigator.clipboard.writeText(textToCopy);
        alert("Invitation text copied to clipboard.");
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-amber-400 flex justify-center min-h-screen py-10">
      <div className="bg-white shadow-md w-full max-w-5xl flex flex-col rounded-md">

        {/* CONTENT */}
        <div className="flex-1 p-8">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Stakeholder Invitation
            </h1>

            {/* Edit / Save Toggle */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                Save
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Template to copy and paste when emailing stakeholders so they can join the platform.
          </p>
          <hr className="border-black mb-6" />

          {/* Editable Content */}
          <div
            ref={divRef}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            className={`text-gray-700 leading-relaxed space-y-4 ${
              isEditing ? "border border-gray-300 p-3 rounded-md" : ""
            }`}
          >

            <p>Subject: Invitation to Join the Retriever Proposal Portal (RPP)</p>

            <p>Hello "Stakeholder Name",</p>

            <p>
              I am reaching out to invite you to join the Retriever Proposal Portal (RPP),
              a collaborative platform designed to connect university stakeholders, faculty,
              and student development teams.
            </p>

            <p>
              The RPP allows stakeholders like you to post real world problems, challenges, or project
              ideas directly on the portal. Once posted, students can view your proposal, learn about
              your problem, and submit applications to work on your project. Students then form 
              development teams and collaborate throughout the semester to design and build software 
              systems that solve the problems you present.
            </p>

            <p>
              At this time, you are being invited to participate in the class specific version of the
              RPP as part of CMSC 447: Software Engineering. During this semester, student teams enrolled
              in the course will review stakeholder proposals, apply to projects, and follow formal
              software engineering processes to deliver a functional solution by the end of the term.
            </p>

            <p>
              You may join the portal using the link below:
              <br />
              <span contentEditable={false}>
                <strong>"specific stakeholder registration link"</strong>
              </span>
            </p>

            <p>
              You can read more about us here:
              <br />
              <span contentEditable={false}>
                <strong>"PDF/Google doc link"</strong>
              </span>
            </p>

            <p>
              We appreciate your interest in working with our students and contributing to a meaningful
              applied learning opportunity. Your participation provides students with valuable experience
              while also giving your organization the opportunity to receive a thoughtfully engineered solution.
            </p>

            <p>
              Sincerely,<br />
              "Your Name"
            </p>

          </div>
        </div>

        {/* BOTTOM BUTTONS */}
        <div className="flex justify-between border-t border-gray-200 p-4 bg-white rounded-b-md">
          <button
            onClick={() => router.push("/profile/admin")}
            className="bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 px-6 rounded-md transition duration-200"
          >
            Go Back
          </button>

          <button
            onClick={handleCopy}
            className="bg-black hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200"
          >
            Copy
          </button>
        </div>

      </div>
    </div>
  );
}
