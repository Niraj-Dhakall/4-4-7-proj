'use client'
import Image from "next/image";
import { z, ZodError } from 'zod'
import { useState } from 'react'
import { useRouter } from "next/navigation"
import LandingPage from "./landingpage/page";
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
    <LandingPage/>
  );
}
