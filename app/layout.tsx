// app/layout.tsx
'use client';

import './globals.css';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component
import { Sora } from 'next/font/google'; // Import Sora font
import StripeProvider from '@/app/stripe-provider';
import { useState, useEffect } from 'react'; // Import useState for managing menu state

// Initialize the Sora font with the weights you want to use
const sora = Sora({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sora', // This allows you to use it as a CSS variable
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Disable body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup function to ensure scroll is re-enabled when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Add this useEffect to handle resize events and close mobile menu at desktop size
  useEffect(() => {
    // Function to handle window resize
    const handleResize = () => {
      // Check if we're at desktop breakpoint (md in Tailwind is 768px by default)
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]); // Dependency array includes mobileMenuOpen

  return (
    <html lang="en" className={sora.variable}>
      <body className={`flex flex-col min-h-screen font-sans ${sora.className}`}>
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-6">

            {/* --- Desktop Navigation (hidden on small screens, flex on medium+) --- */}
            <div className="hidden md:flex items-center justify-between h-48">
              {/* Left Navigation Links */}
              <div className="flex items-center space-x-6 lg:space-x-8">
                <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
                  Home
                </Link>
                <Link href="/programs" className="text-gray-700 hover:text-green-600 transition-colors">
                  Programs
                </Link>
              </div>

              {/* Center Logo and Title */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                  <Image
                    src="/logo.png"
                    alt="Lil Farm Hill Logo"
                    width={36}
                    height={36}
                    className="h-36 w-auto"
                  />
                </Link>
              </div>

              {/* Right Navigation Links */}
              <div className="flex items-center space-x-6 lg:space-x-8">
                <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
                  About
                </Link>
                <Link href="/donate" className="text-gray-700 hover:text-green-600 transition-colors">
                  Donate
                </Link>
              </div>
            </div>

            {/* --- Mobile Navigation (flex on small screens, hidden on medium+) --- */}
            <div className="md:hidden flex items-center justify-between h-28 relative">
              {/* Mobile Logo/Title */}
              <Link href="/" className="flex items-center space-x-1">
                 <Image
                    src="/logo.png"
                    alt="Lil Farm Hill Logo"
                    width={30}
                    height={30}
                    className="h-24 w-auto"
                  />
              </Link>

              {/* Mobile Menu Button with onClick handler - position unchanged but higher z-index */}
              <button 
                className="text-gray-700 hover:text-green-600 p-2 -mr-2 focus:outline-none z-[100] relative" 
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              > 
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Slide from side */}
        <div 
          className={`fixed top-28 right-0 h-full bg-white shadow-lg border-t border-gray-100 transform transition-transform duration-300 ease-in-out z-[95] 
            sm:w-64 w-full ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-5">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors px-4 py-3 text-lg rounded-md" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/programs" 
                className="text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors px-4 py-3 text-lg rounded-md" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Programs
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors px-4 py-3 text-lg rounded-md" 
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/donate" 
                className="text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors px-4 py-3 text-lg rounded-md" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Donate
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay when menu is open */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 top-28 bg-black/50 z-[90] md:hidden animate-fadeIn" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-grow">
          <StripeProvider>{children}</StripeProvider>
        </main>

        <footer className="bg-white py-6 border-t border-gray-100">
          <div className="mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-center items-center text-sm space-y-3 md:space-y-0 md:space-x-8">
              {/* Footer Links - Keep as is, or update if needed */}
              <Link href="/" className="text-gray-500 hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link href="/programs" className="text-gray-500 hover:text-green-600 transition-colors">
                Programs
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-green-600 transition-colors">
                About
              </Link>
              <Link href="/legal/terms-of-service" className="text-gray-500 hover:text-green-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/legal/privacy-policy" className="text-gray-500 hover:text-green-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/donate" className="text-gray-500 hover:text-green-600 transition-colors">
                Donate
              </Link>
              <div className="text-gray-400 text-sm mt-4 md:mt-0">
                © {new Date().getFullYear()} Lil Farm Hill, Upper Ojai, California
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
