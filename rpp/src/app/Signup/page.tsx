'use client'

//import Image from "next/image";
import { z, ZodError } from 'zod'
import { useState } from 'react'
import { useRouter } from "next/navigation"

const signUpSchema = z.object({
  username: z.string(),
  password: z.string()

})

export default function Login() {
  const router = useRouter()

  const [rememberMe, setRememberMe]=useState(false);

  const [formData, setFormData] = useState({
    username: '', 
    password: '',
    confirm_password: ''

  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name ,value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}))

  }
  return (
    <div className="bg-[url('/blackandgold.png')] bg-cover bg-center justify-center flex  min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex items-center flex-col bg-gray-100 rounded-lg w-[330px] h-[460px] mt-15 p-1">
        <div className="flex flex-col">
          <h1 className="text-white font-semibold rounded-lg text-center hover:text-amber-500 mt-12 bg-black   p-2 "> Proposal Portal </h1>
          <form>
            <div className="flex flex-col">
            <label htmlFor="username" className="text-sm text-black font-bold mt-5"> Email Address </label>
            <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
                className="border-black text-black placeholder-gray-400 border-[1px] p-2 rounded-lg"
              />

              <label htmlFor="password"className="text-sm text-black font-bold mt-5">Password</label>
              <input 
              id ="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="border-black text-black placeholder-gray-400 border-[1px] p-2 rounded-lg"
              />

              <label htmlFor="confirm_password" className="text-sm text-black font-bold mt-5">Confirm Password</label>
              <input
              id ="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              placeholder="Confirm Password"
              className="border-black text-black placeholder-gray-400 border-[1px] p-2 rounded-lg"
              />

             

            </div>

            <div className='flex items-center mt-3'>
                 <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e => setRememberMe(e.target.checked))}
              className="h-3.5 w-3.5 text-amber-500  focus:ring-amber-400 border-gray-500 rounded mb-2"
              />
              <div><label htmlFor="rememberMe" className="  ml-2 block text-sm text-gray-900 mb-2">Remember Me</label></div>
            </div>
            
          </form>
          <div className="flex justify-start w-full mt-1">
              <button onClick={() => router.push('/portal')} className="bg-black hover:text-amber-500 rounded-lg  font-bold mb-10 ml-40 p-2 cursor-pointer">
                Sign Up
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
