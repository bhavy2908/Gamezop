import { ReactNode } from 'react';
import DesktopNavbar from '../components/DesktopNavbar';
import MobileNavbar from '../components/MobileNavbar';
import '../styles/globals.css';

export const metadata = {
  title: 'Gamezop Clone',
  description: 'A Gamezop clone with Apple App Store-like design',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow flex">
            <DesktopNavbar className="hidden md:flex md:w-1/5 fixed h-screen 2xl:min-w-[200px]" />
            <div className="md:ml-[20%] w-full md:w-4/5 flex-grow">
              {children}
            </div>
          </div>
          <MobileNavbar className="md:hidden" />
        </div>
      </body>
    </html>
  );
}