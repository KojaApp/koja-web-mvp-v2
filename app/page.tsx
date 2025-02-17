import AcmeLogo from '@/app/ui/koja-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { merriweather } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-[#0A2540] p-4 md:h-52">
        {<AcmeLogo />}
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
        
          <p className={`${merriweather.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Koja.</strong> Childcare payments made simple.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-[#F76C6C] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black md:text-base"
          >
            <span>Log in</span> 
          </Link>
          <p>Don't have an account?
          <Link
          href="/register"
          className="font-bold underline ml-1"
          >Register</Link>
          </p>
    
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
        src="/koja-hero-desktop.jpg"
        width={1000}
        height={760}
        className="hidden md:block rounded-md"
        alt="Hero Image"
          />

          <Image
        src="/koja-hero-mobile.jpg"
        width={650}
        height={620}
        className="block md:hidden rounded-md"
        alt="Hero Image"
          />  
        </div>
      </div>
    </main>
  );
}
