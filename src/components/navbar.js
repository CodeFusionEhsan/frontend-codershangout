import React, { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold tracking-tight text-indigo-400">
              Coders
              <span className="text-white">Hangout</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <a
              href="/"
              className="hover:text-indigo-400 transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="/snippets"
              className="hover:text-indigo-400 transition-colors font-medium"
            >
              Snippets
            </a>
            <a
              href="/blogs"
              className="hover:text-indigo-400 transition-colors font-medium"
            >
              Blogs
            </a>
            <a
              href="/dashboard"
              className="hover:text-indigo-400 transition-colors font-medium"
            >
              Dashboard
            </a>
            {/* CTA Buttons */}
            <button
              className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow transition-colors font-semibold"
              onClick={() => {window.location = "/add_snippet"}}>
              + Add Snippet
            </button>
            <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton className="ml-2 bg-gray-800 hover:bg-gray-700 text-indigo-400 border border-indigo-600 px-4 py-2 rounded-md transition-colors font-semibold" />
          </SignedOut>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className={`h-6 w-6 transition-transform ${menuOpen ? "rotate-90" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-2 pb-4 pt-2 space-y-2">
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-indigo-400"
          >
            Home
          </a>
          <a
            href="/snippets"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-indigo-400"
          >
            Snippets
          </a>
          <a
            href="/blogs"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-indigo-400"
          >
            Blogs
          </a>
          <a
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 hover:text-indigo-400"
          >
            Dashboard
          </a>
          <button
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow transition-colors font-semibold"
            onClick={() => {window.location = "/add_snippet"}}>
            + Add Snippet
          </button>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-indigo-400 border border-indigo-600 px-4 py-2 rounded-md transition-colors font-semibold" />
          </SignedOut>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
