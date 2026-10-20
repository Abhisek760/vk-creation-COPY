"use client";

import Link from "next/link";
import {
  ArrowUp,
  Camera,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Packages", href: "/#packages" },
  { label: "Build Coverage", href: "/builder" },
  { label: "Book Now", href: "/booking" },
];

const services = [
  "Wedding Photography",
  "Candid Photography",
  "Cinematic Videography",
  "Pre Wedding",
  "Wedding Album",
];

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505]">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[170px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 sm:gap-14 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500">
                <Camera className="h-6 w-6 text-black" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  VK Creation
                </h2>

                <p className="text-sm text-gray-500">
                  Wedding Photography Studio
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-base leading-7 text-gray-400">
              Creating timeless wedding memories through premium photography,
              cinematic films, and handcrafted storytelling.
            </p>

            <div className="mt-8 flex gap-3">
              {[
                {
                  icon: FaInstagram,
                  href: "https://instagram.com",
                },
                {
                  icon: FaFacebookF,
                  href: "https://facebook.com",
                },
                {
                  icon: FaYoutube,
                  href: "https://youtube.com",
                },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:text-amber-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 transition-colors duration-300 hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Services
            </h3>

            <ul className="space-y-4">
              {services.map((service) => (
                <li
                  key={service}
                  className="text-gray-400"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <p className="text-white">+91 XXXXX XXXXX</p>
                  <p className="text-sm text-gray-500">
                    Call / WhatsApp
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <p className="break-all text-white">
                    contact@vkcreation.in
                  </p>
                  <p className="text-sm text-gray-500">
                    Email Support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
                <div>
                  <p className="text-white">
                    Madhya Pradesh, India
                  </p>
                  <p className="text-sm text-gray-500">
                    Available Across India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 md:mt-16 md:flex-row">
          <p className="text-center text-sm text-gray-500 md:text-left">
            © {new Date().getFullYear()} VK Creation. All Rights Reserved.
          </p>

          <button
            onClick={scrollTop}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-amber-400/40 hover:text-amber-300"
          >
            Back to Top
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}