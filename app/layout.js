import './globals.css';
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import "@/script/worker";
import "@/script/scheduleJobs";
import { Providers } from "./provider";
import ThemeScript from './ThemeScript';

export const metadata = {
  title: "BIIT Voting App",
  description: "Secure blockchain voting system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeScript />
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
