import './globals.css';
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";


import { Providers } from "./provider"; 
import ThemeScript from './ThemeScript'; // 👈 this is our client-only script component

export const metadata = {
  title: "BIIT Voting App",
  description: "Secure blockchain voting system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeScript /> {/* 👈 only this runs client-side for theme init */}
        <Providers>
          <Navbar />
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
