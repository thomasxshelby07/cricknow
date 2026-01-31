import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Cricknow - Online Betting & Cricket News",
  description: "Your guide to online betting sites, cricket updates, and casino strategies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={cn("min-h-screen bg-neutral-light font-sans antialiased", inter.variable)}>
        {/* We can check path here to conditionally render Header/Footer if needed, 
            but for now we assume Public Layout is default. 
            Admin has its own layout.tsx which avoids this RootLayout? 
            No, Admin is sub-route. Admin layout handles its own shell. 
            BUT Admin is inside RootLayout. 
            We should conditionally render Header/Footer or move them to a (public) group. 
            Refactoring to (public) group is cleaner but simple conditional is faster. 
        */}
        <MainWrapper>{children}</MainWrapper>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

// Simple wrapper to check pathname if needed, but for now we'll put Header/Footer here using Server Logic?
// Actually, pure Root Layout wraps EVERYTHING (including Admin). 
// So Admin pages will have Public Header if we put it here.
// FIX: We need robust route grouping.
// BUT for simpler fix now: We will move `children` to pure body and only wrap Public pages in a layout or specific page wrapper.
// Better: Create `src/app/(public)/layout.tsx` for Header/Footer.
// And move `page.tsx` and `[...slug]/page.tsx` into `(public)`.
// `admin` is already in `(admin)`. 
// So public pages just need their own group.
// I will refactor `src/app/page.tsx` to `src/app/(public)/page.tsx` etc.
// Wait, `src/app/layout.tsx` MUST exist. It should be empty of UI elements.

function MainWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
