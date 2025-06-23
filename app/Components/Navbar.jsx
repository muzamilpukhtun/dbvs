"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleNavClick = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Listen for route change events to trigger loader
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events?.on("routeChangeStart", handleStart);
    router.events?.on("routeChangeComplete", handleComplete);
    router.events?.on("routeChangeError", handleComplete);

    return () => {
      router.events?.off("routeChangeStart", handleStart);
      router.events?.off("routeChangeComplete", handleComplete);
      router.events?.off("routeChangeError", handleComplete);
    };
  }, [router]);

  // Theme handling
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    localStorage.theme = isDark ? "dark" : "light";
  };

  return (
    <>
    {loading && <Loader />}
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white dark:bg-gray-900 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[5rem] items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={handleNavClick}>
              <Image src="/Logo.png" alt="Logo" width={40} height={40} className="h-16 w-auto" priority />
              <span className="text-xl font-bold text-gray-900 dark:text-white">BIIT VOTING</span>
            </Link>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white transition"
              title="Toggle theme"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12H3m15.07 4.24l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600"
              >
                <span className="sr-only">Open main menu</span>
                {menuOpen ? (
                  <svg className="block h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/my-polls" className="text-gray-700 dark:text-white hover:text-blue-600 font-semibold px-3 py-2 rounded">My Polls</Link>
                <Link href="/public-polls" className="text-gray-700 dark:text-white hover:text-blue-600 font-semibold px-3 py-2 rounded">Public Polls</Link>
                <Link href="/create-poll" className="text-gray-700 dark:text-white hover:text-blue-600 font-semibold px-3 py-2 rounded">Create Poll</Link>
                <button onClick={handleLogout} className="text-gray-700 dark:text-white hover:text-red-600 font-semibold px-3 py-2 rounded transition">Log Out</button>
              </>
            ) : (
              <>
                <Link href="/create-user">
                  <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    Signup
                  </button>
                </Link>
                <Link href="/login">
                  <button className="flex items-center bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-200 ease-in-out ${menuOpen ? "block" : "hidden"}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 backdrop-blur-md shadow-md">
          {isLoggedIn ? (
            <>
              <Link href="/my-polls" className="block text-gray-700 dark:text-white hover:text-blue-600 font-semibold px-3 py-2 rounded" onClick={handleNavClick}>My Polls</Link>
              <Link href="/public-polls" className="block text-gray-700 dark:text-white hover:text-blue-600 font-semibold px-3 py-2 rounded" onClick={handleNavClick}>Public Polls</Link>
              <Link href="/create-poll" className="block text-gray-700 dark:text-white hover:text-blue-600 font-semibold px-3 py-2 rounded" onClick={handleNavClick}>Create Poll</Link>
              <button onClick={() => { handleLogout(); handleNavClick(); }} className="block text-red-600 font-semibold px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Log Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/create-user">
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition w-full justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                  Signup
                </button>
              </Link>
              <Link href="/login">
                <button className="flex items-center bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition w-full justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
