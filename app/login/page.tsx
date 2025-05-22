'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

       if (!res.ok) {
        window.location.href = '/'

      let errorMessage = 'Login failed'

      try {
        const data = await res.json()
        errorMessage = data.error || errorMessage
      } catch (_) {
        // The response wasn't JSON — ignore
      }

      throw new Error(errorMessage)
    }


      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-zinc-900 text-white">
      <div className="bg-zinc-950 rounded-xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-green-500 mb-6 text-center">Log in to Musico</h1>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Email address"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Password"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded transition duration-200"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-zinc-400">
          Don&apos;t have an account? <span className="text-green-500 cursor-pointer"><Link
            href="/signup"
            className="text-white font-medium hover:underline"
          >Sign up</Link></span>
        </div>
      </div>
    </div>
  )
}
