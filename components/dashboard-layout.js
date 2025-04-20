"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BarChart2, LogOut, Menu, X } from "lucide-react";
import Image from "next/image";

export function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("currentUser");
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    } else {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center">
              <div className="text-xl font-bold text-blue-600">
               Recepto
                {/* <Image src="/placeholder.svg?height=30&width=100" alt="Recepto" width={100} height={30} /> */}
              </div>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4 pb-2 text-xs font-semibold text-gray-400">MAIN</div>
            <nav className="space-y-1 px-2">
              <Link href="/dashboard" passHref>
                <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Leads
                </Button>
              </Link>
              <Link href="/dashboard/analytics" passHref>
                <Button
                  variant={pathname === "/dashboard/analytics" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <BarChart2 className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
              </Link>
            </nav>
            <div className="mt-6 px-4 pb-2 text-xs font-semibold text-gray-400">MORE</div>
            <nav className="space-y-1 px-2">
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100 text-blue-600 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">Company name</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="default" size="sm" className="bg-blue-600 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 9a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm7 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                    clipRule="evenodd"
                  />
                </svg>
                0 credits
              </Button>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-medium">{currentUser?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{currentUser?.role || "Member"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
