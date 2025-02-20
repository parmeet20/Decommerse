import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Company Info */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-4">DeComerse</h3>
            <p className="text-sm mb-4">
              Transforming your shopping experience with blockchain technology.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <TwitterIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <FacebookIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <InstagramIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <GitHubIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">About</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="text-sm hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-sm hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm hover:text-white transition-colors">Returns</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white mb-4">Stay Updated</h4>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-gray-800" />

        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DeComerse. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

// Social Media Icons
function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}