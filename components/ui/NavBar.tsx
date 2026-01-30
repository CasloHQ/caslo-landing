"use client";

import Image from "next/image";
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";

type Props = {
  hidden?: boolean;
};

export default function NavBar({ hidden = false }: Props) {
  return (
    <nav
      className={[
        "fixed top-0 left-0 w-full z-50",
        "transition-all duration-300 ease-out",
        hidden
          ? "opacity-0 -translate-y-3 pointer-events-none"
          : "opacity-100 translate-y-0",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        {/* Left - Brand Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/caslo_logo.png"
            alt="Brand Logo"
            width={120}
            height={20}
            priority
          />
        </Link>

        {/* Center - Navigation */}
        <ul className="hidden md:flex items-center gap-10 text-sm [font-family:var(--font-aboreto)] text-gray-300">
          <li className="hover:text-white transition">
            <Link href="/collections">COLLECTIONS</Link>
          </li>
          <li className="hover:text-white transition">
            <Link href="/products">PRODUCTS</Link>
          </li>
          <li className="hover:text-white transition">
            <Link href="/about-us">ABOUT US</Link>
          </li>
        </ul>

        {/* Right - Explore Button */}
        <Link href="/explore" className="[font-family:var(--font-aboreto)]">
          <ShimmerButton>EXPLORE</ShimmerButton>
        </Link>
      </div>
    </nav>
  );
}
