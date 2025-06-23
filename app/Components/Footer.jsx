import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-white text-black dark:text-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Company Logo"
                width={60}
                height={60}
                className="mr-3"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                BIIT VOTING
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-600 dark:text-gray-400">
              Empowering your digital journey with secure and reliable solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:gap-6">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Quick Links
              </h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4">
                  <Link href="/" className="hover:underline">Home</Link>
                </li>
                <li className="mb-4">
                  <Link href="/login" className="hover:underline">Login</Link>
                </li>
                <li>
                  <Link href="/create-user" className="hover:underline">Sign Up</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()} BIITVOTING™. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
