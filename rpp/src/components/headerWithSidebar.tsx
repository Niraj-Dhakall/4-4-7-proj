'use client'
import React, { useState } from "react"
import SearchBar from "@/components/searchBar";
import Hamburger from 'hamburger-react';
import { HiInbox, HiTable, HiUser, HiArrowSmRight } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation"
import { AiOutlinePlus } from "react-icons/ai";
import { useSession } from "next-auth/react"
interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick?: () => void;
  badge?: string;
  badgeColor?: string;
}

function SidebarLink({ href, icon: Icon, children, onClick, badge, badgeColor = "bg-gray-700" }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.includes(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 transition-colors  group ${isActive
        ? 'bg-gray-800 text-white'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
        }`} />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className={`${badgeColor} text-white text-xs px-2 py-1 rounded-full`}>
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function HeaderWithSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter()
  const closeSidebar = () => setSidebarOpen(false);
  const { data: session, status } = useSession()
  return (
    <>
      {/* Header */}
      <header className="bg-black shadow-sm w-full fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between py-3 max-w-auto px-2 mx-auto">

          <div className="flex items-center justify-start max-w-md">
            <div className="ml-auto">
              <Hamburger
                toggled={sidebarOpen}
                toggle={setSidebarOpen}
                size={20}
                color="#ffffff"
              />
            </div>
            <div className="flex-shrink-0 ml-5">

              <button
                className="hover:cursor-pointer  p-2"
                onClick={() => router.push("/portal")}
              >
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  UMBC RPP
                </h1>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-1 max-w-md">
            {session && session.user.userType === "Stakeholder" &&
              <div>
                <button onClick={() => router.push('/portalrequest')} className="flex font-semibold border hover:border-red-500 hover:cursor-pointer text-center btn-prmary  bg-black text-amber-200 rounded-lg p-2 ">
                  Create <AiOutlinePlus size={25} />
                </button>
              </div>
            }
            <SearchBar />
          </div>

        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={closeSidebar}
          style={{ top: '64px' }} // Adjust based on header height
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-15 left-0 h-full bg-black shadow-xl z-50 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{
          width: '280px',
          paddingTop: '0px' // Adjust based on header height
        }}
      >

        <nav className="flex flex-col gap-1 p-4 h-full overflow-y-auto">
          <SidebarLink href="/portal" icon={HiInbox} onClick={closeSidebar}>
            Portal
          </SidebarLink>
          <SidebarLink href="/profile" icon={HiUser} onClick={closeSidebar}>
            Profile
          </SidebarLink>
          <div className="h-[40px]">
            <div className="border border-slate-400 mt-5"></div>
          </div>
          <div className="flex flex-col">
            <SidebarLink href="/login" icon={HiArrowSmRight} onClick={closeSidebar}>
              Sign In
            </SidebarLink>
            <SidebarLink href="/Signup" icon={HiTable} onClick={closeSidebar}>
              Sign Up
            </SidebarLink>
          </div>
        </nav>
      </aside>

      {/* Spacer for fixed header */}
      <div style={{ height: '64px' }} />
    </>
  );
}
