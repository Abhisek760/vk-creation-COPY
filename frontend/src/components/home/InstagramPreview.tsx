"use client";

import {
  ArrowUpRight,
  Heart,
} from "lucide-react";

import {
  FaInstagram,
} from "react-icons/fa";

const posts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80&auto=format&fit=crop",
  },
];

export default function InstagramPreview() {
  return (
    <section className="relative overflow-hidden bg-black py-24">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-pink-500/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2 text-sm font-medium text-pink-300">
            <FaInstagram className="h-4 w-4" />
            Instagram
          </div>


          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Follow Our
            <span className="block bg-linear-to-r from-pink-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent">
              Wedding Stories
            </span>
          </h2>


          <p className="mt-6 text-lg text-gray-400">
            A glimpse into the beautiful moments we've captured across weddings,
            pre-weddings, engagements, and celebrations.
          </p>

        </div>


        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

          {posts.map((post) => (

            <div
              key={post.id}
              className="group relative aspect-square overflow-hidden rounded-3xl"
            >

              <img
                src={post.image}
                alt="Wedding"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />


              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />


              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 transition duration-500 group-hover:opacity-100">

                <Heart className="h-7 w-7 fill-white text-white" />

                <ArrowUpRight className="h-6 w-6 text-white" />

              </div>

            </div>

          ))}

        </div>



        <div className="mt-14 text-center">

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-pink-500 via-fuchsia-500 to-orange-500 px-8 py-4 font-semibold text-white transition hover:scale-105"
          >

            <FaInstagram className="h-5 w-5" />

            Follow on Instagram

          </a>

        </div>


      </div>

    </section>
  );
}