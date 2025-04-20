"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { initializeUsers } from "@/lib/data-utils"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (user) {
      router.push("/dashboard")
      return
    }

    // Initialize users if they don't exist
    initializeUsers()

    // Show login alert
    const username = prompt("Username:")
    const password = prompt("Password:")

    if (username && password) {
      const usersString = localStorage.getItem("users")
      if (!usersString) {
        alert("No users found. Please contact administrator.")
        return
      }

      const users = JSON.parse(usersString)
      const user = users.find((u) => u.username === username && u.password === password)

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        alert("Invalid username or password")
        window.location.reload()
      }
    } else {
      window.location.reload()
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-5xl text-blue-600 font-bold">LOGIN</div>
    </main>
  )
}
