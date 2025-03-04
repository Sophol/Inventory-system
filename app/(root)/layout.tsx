import { ReactNode } from "react";
import AppSidebar from "@/components/navigation/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NavBar from "@/components/navigation/navbar/index";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main
      className="background-light850_dark100 realtive w-full"
      suppressHydrationWarning
    >
      <div className="flex">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <NavBar />
            <main className="w-full">{children} </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </main>
  );
};
export default RootLayout;
