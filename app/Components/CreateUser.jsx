"use client"
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function CreateUser() {
  const [arid, setArid] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!arid || !name || !password) {
      setMessage('All fields are required')
      return
    }

    const aridInt = parseInt(arid, 10)
    const passwordInt = parseInt(password, 10)
    if (isNaN(aridInt) || isNaN(passwordInt)) {
      setMessage('ARID and Password must be numbers')
      return
    }

    const result = await signup({ arid: aridInt, name, password: passwordInt })

    if (result.success) {
      setMessage('Signup successful! Redirecting...')
      setTimeout(() => router.push('/'), 1000)
    } else {
      setMessage(result.error || 'Signup failed')
    }
  }

  return (
    <div className="bg-white text-black dark:text-white dark:bg-gray-900 flex flex-col md:flex-row min-h-screen">
      {/* Left side - Logo and App Name */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-600 p-4 min-h-[200px] md:min-h-screen">
        <div className="text-white text-center">
          <img src="/Logo.png" alt="DBVS Logo" className="w-32 md:w-64 h-auto mb-4" />
          <p className="text-xl md:text-2xl">BIIT VOTING</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="p-4 md:p-8 rounded-lg dark:shadow-blue-200 shadow-xl w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">Create User</h2>
          
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <input
              type="number"
              placeholder="ARID"
              className="border p-2 md:p-3 w-full rounded-lg text-sm md:text-base"
              value={arid}
              onChange={(e) => setArid(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Name"
              className="border p-2 md:p-3 w-full rounded-lg text-sm md:text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Password"
              className="border p-2 md:p-3 w-full rounded-lg text-sm md:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg transition duration-200 text-sm md:text-base"
            >
              Create User
            </button>

            {message && (
              <p className={`text-center text-sm md:text-base ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
