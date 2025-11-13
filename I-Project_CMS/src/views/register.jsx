import { useState } from "react"

import axios from 'axios'
import baseUrl from "../constant/url"
import { useNavigate } from "react-router"
import Button from "../component/button.jsx"
import { toast } from 'react-toastify';

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    async function handleRegister(event) {
        event.preventDefault()
        try {
            const token = localStorage.getItem('access_token')
            await axios.post(`${baseUrl}/adduser`, {
                email,
                password
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success("New user registered successfully!")
            navigate("/products")
        } catch (error) {
            console.error("Registration failed:", error)
            toast.error(error.response?.data?.message || "Registration failed. Make sure you are logged in as admin.")
        }
    }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f8]">


      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-extrabold text-[#232f24]">
              Register New User 
            </h1>
          </div>


          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b6c867] focus:border-[#b6c867]"
                type="email"
                id="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#b6c867] focus:border-[#b6c867]"
                type="password"
                id="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
            </div>

            <Button nameProp={"Register"} />
          </form>


        </div>
      </main>


      <footer className="mt-auto bg-transparent">
      </footer>
    </div>
  );
}
