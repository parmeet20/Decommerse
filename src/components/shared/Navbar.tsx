"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import React, { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { useTheme } from "next-themes";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const {theme} = useTheme();
  return (
    <nav className="p-4 border-b shadow-md bg-white/80 dark:bg-slate-950 backdrop-blur-md fixed top-3 left-2 right-2 rounded-2xl z-50 m-0 w-[97%]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="text-2xl font-bold">
          Decommerse
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/" className="hover:text-gray-400 transition-colors">
            Home
          </Link>
          <Link
            href="/createproduct"
            className="hover:text-gray-400 transition-colors"
          >
            CreateProduct
          </Link>
          <Link
            href="/profile"
            className="hover:text-gray-400 transition-colors"
          >
            Profile
          </Link>
        </div>

        {/* Connect Wallet Button */}
        <div className="hidden lg:block items-center space-x-2 ">
          <ModeToggle/>
          <WalletMultiButton
            style={{
              backgroundColor: `${theme === "light"?"black":"white"}`,
              borderRadius: "20px",
              color: `${theme === "light"?"white":"black"}`,
              padding: "10px 20px",
              fontWeight: "500",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        } mt-4 space-y-4 text-center`}
      >
        <Link
          href="/"
          className="block text-lg hover:text-gray-400 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/createproduct"
          className="block text-lg hover:text-gray-400 transition-colors"
        >
          CreateProduct
        </Link>
        <Link
          href="/profile"
          className="block text-lg hover:text-gray-400 transition-colors"
        >
          Profile
        </Link>
        <div className="mt-4 flex justify-center space-x-2">
          <ModeToggle/>
          <WalletMultiButton
            style={{
              backgroundColor: `${theme === "light"?"black":"white"}`,
              borderRadius: "20px",
              color: `${theme === "light"?"white":"black"}`,
              padding: "10px 20px",
              fontWeight: "500",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
