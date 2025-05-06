// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component
import type { Metadata } from 'next';
import { Sora } from 'next/font/google'; // Import Sora font
import StripeProvider from '@/app/stripe-provider';
// Initialize the Sora font with the weights you want to use
const sora = Sora({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sora', // This allows you to use it as a CSS variable
});

export const metadata: Metadata = {
  title: 'Lil Farm Hill | Nature-Based Learning in Upper Ojai, California',
  description: 'Lil Farm Hill Learning Village is a nature-based outdoor learning program supporting homeschool families in Upper Ojai, California.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body className={`flex flex-col min-h-screen font-sans ${sora.className}`}>
        <nav className="bg-white shadow-sm top-0 z-50"> {/* Added sticky, top-0, z-50 for sticky nav */}
          <div className="container mx-auto px-6"> {/* Removed fixed height to allow for logo height */}

            {/* --- Desktop Navigation (hidden on small screens, flex on medium+) --- */}
            <div className="hidden md:flex items-center justify-between h-48"> {/* Added h-32 to accommodate h-24 logo with padding */}

              {/* Left Navigation Links */}
              <div className="flex items-center space-x-6 lg:space-x-8"> {/* Adjusted spacing */}
                <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
                  Home {/* Placeholder */}
                </Link>
                <Link href="/programs" className="text-gray-700 hover:text-green-600 transition-colors">
                  Programs
                </Link>
              </div>

              {/* Center Logo and Title */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center"> {/* Added flex items-center */}
                <Link href="/" className="flex items-center space-x-2 group"> {/* Added group for hover effect */}
                  <Image
                    src="/logo.png" // Path relative to public folder
                    alt="Lil Farm Hill Logo"
                    width={36}      // Specify width (adjust as needed)
                    height={36}     // Specify height (adjust as needed)
                    className="h-36 w-auto" // Tailwind class to control rendered size, maintains aspect ratio
                  />
                </Link>
              </div>

              {/* Right Navigation Links */}
              <div className="flex items-center space-x-6 lg:space-x-8"> {/* Adjusted spacing */}
                <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
                  About {/* Your original link */}
                </Link>
                <Link href="https://lanternsglobal.com/reviews" className="text-gray-700 hover:text-green-600 transition-colors">
                  Reviews {/* Placeholder */}
                </Link>
                <Link href="https://lanternsglobal.com/donate" className="text-gray-700 hover:text-green-600 transition-colors">
                  Donate {/* Placeholder */}
                </Link>
              </div>
            </div>

            {/* --- Mobile Navigation (flex on small screens, hidden on medium+) --- */}
            <div className="md:hidden flex items-center justify-between h-28"> {/* Added h-28 for mobile */}
              {/* Mobile Logo/Title */}
              <Link href="/" className="flex items-center space-x-1">
                 <Image
                    src="/logo.png"
                    alt="Lil Farm Hill Logo"
                    width={30}
                    height={30}
                    className="h-24 w-auto" // Same height as desktop for consistency
                  />
              </Link>

              {/* Mobile Menu Button (Placeholder) */}
              <button className="text-gray-700 hover:text-green-600 p-2 -mr-2"> {/* Added padding, negative margin for better touch area */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
        <StripeProvider>{children}</StripeProvider>
        </main>

        <footer className="bg-white py-6 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8">
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
