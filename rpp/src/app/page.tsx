'use client'
import Image from "next/image";
import { z, ZodError } from 'zod'
import { useState } from 'react'
import { useRouter } from "next/navigation"

const signUpSchema = z.object({
  username: z.string(),
  password: z.string()

})

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '', 
    password: ''

  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name ,value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}))

  }
  return (
    <div className="flex font-sans bg-blue-300/90 items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex items-center flex-col bg-white rounded-lg w-[320px] h-[525px]">
        <div className="flex flex-col">
          <h1 className="text-black font-semibold text-2xl mt-2">Proposal Portal</h1>
          <button className="rounded-lg p-2 bg-yellow-300 mt-20 text-black font-semibold"> Login with umbc </button>
          <form>
            <div className="flex flex-col">
            <label htmlFor="username" className="text-sm text-black font-medium"> username</label>
            <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder=" username"
                className="border-black placeholder-gray-400 border-[1px] rounded-lg"
              />
            </div>
            
          </form>
          <div>
              <button onClick={() => router.push('/portal')} className="bg-black cursor-pointer">
                continue
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
