"use client";

import { usePathname } from "next/navigation";
import CustomNavbar from "./navbar";
import Sidebar from "./sidebar";
import ChatWidget from "@/components/Chat/ChatWidget";
import SoundSettings from "@/components/SoundSettings";
import { useCoreumWallet } from "@/providers/coreum";

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const path = usePathname()
    const { address } = useCoreumWallet();

    return (
        <div className="flex flex-col min-h-screen bg-no-repeat bg-center">
            <CustomNavbar />
            <main className="flex-grow bg-casino bg-cover flex">
                <Sidebar />
                <div className="bg-black/80 w-full">
                    {children}
                </div>
            </main>
            <footer className="bg-black text-white p-4 text-center">
                <p>&copy; 2025 CozyCasino - Powered by Coreum</p>
            </footer>
            {/* Show chat widget only when wallet is connected */}
            {address && <ChatWidget />}
            {/* Sound settings always available */}
            <SoundSettings />
        </div>
    )
}


export default Layout;