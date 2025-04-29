import Footer from "@/components/clients/Footer";
import Navbar from "@/components/clients/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="text-gray-700" suppressHydrationWarning>
      <Navbar />
      <Toaster />
      {children}
      <Footer />
    </main>
  );
};
export default RootLayout;
