"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/isLoggedIn");
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout');
      setIsLoggedIn(false);
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const navLinkClass = (href: string) =>
    pathname === href
      ? "text-emerald-600 font-semibold underline underline-offset-4"
      : "text-gray-700 hover:text-emerald-600 transition";

  const links = [
    { href: "/Model", label: "Predict" },
    { href: "/Vet", label: "Nearby Vet" },
    { href: "/gallery", label: "Gallery" },
    { href: "/rescuetask", label: "Rescue Task" },
    { href: "/reportdanger", label: "Report Danger" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/forum", label: "Forum" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm px-4 md:px-10 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xl font-bold">
        <span className="text-2xl">🐾</span> Jeevan
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/" className={navLinkClass("/")}>Home</Link>
        {!loading && isLoggedIn && (
          <>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className={navLinkClass(href)}>
                {label}
              </Link>
            ))}
            <Link href="/donation">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-medium">
                Donate
              </button>
            </Link>
          </>
        )}
        
        {!loading && (
          isLoggedIn ? (
            <div className="flex items-center gap-4 ml-2">
              <Link href="/profile" className="text-emerald-600 font-semibold hover:text-emerald-700 transition">
                Profile
              </Link>
              <button onClick={handleLogout} className="text-red-500 font-semibold hover:text-red-600 transition">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-2">
              <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition">
                Login
              </Link>
              <Link href="/signup" className="text-emerald-600 font-semibold hover:text-emerald-700 transition">
                Signup
              </Link>
            </div>
          )
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-600"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-40 flex flex-col gap-4 p-6 md:hidden transition-all">
          <Link href="/" className={navLinkClass("/")}>Home</Link>
          {!loading && isLoggedIn && (
            <>
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={navLinkClass(href)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link href="/donation">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full w-full mt-2">
                  Donate
                </button>
              </Link>
            </>
          )}
          
          {!loading && (
            isLoggedIn ? (
              <div className="flex flex-col gap-4 mt-2 border-t pt-4">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-emerald-600 font-semibold">Profile</span>
                </Link>
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                  className="text-left text-red-500 font-semibold hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-2 border-t pt-4">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-emerald-600 font-semibold">Login</span>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-emerald-600 font-semibold">Signup</span>
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </header>
  );
}
