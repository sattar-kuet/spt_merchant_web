import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import LeftBar from "@/components/LeftBar";
import RightSideHeader from "@/components/RightSideHeader";
import { SidebarProvider } from "@/context/SidebarContext";
import ReactQueryProvider from "@/context/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Merchant Dashboard",
  description: "Merchant dashboard for managing parcels and orders",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased">
      <ReactQueryProvider>
        <SidebarProvider>
          <div className="flex min-h-screen bg-slate-50">
            <LeftBar />
            <div className="flex-1 flex flex-col min-w-0">
              <header className="p-4 border-b bg-slate-50">
                <div className="w-full mx-auto px-4">
                  <RightSideHeader />
                </div>
              </header>
              <main className="flex-1 p-4 md:p-0">
                <div className="max-w-7xl mx-auto w-full">{children}</div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ReactQueryProvider>
    </div>
  );
}