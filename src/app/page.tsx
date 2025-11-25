"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Maximize2, Palette } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-50">
          {/* Placeholder for Video Background - using a high-quality gradient/image for now */}
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-white"
          >
            Elevate Your Space with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Timeless Porcelain
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Discover over 1000+ premium designs. From classic marble to modern concrete,
            find the perfect foundation for your vision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/products"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/catalogs"
              className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              View Catalogs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Layers,
                title: "Premium Quality",
                desc: "Crafted with precision engineering for durability and elegance."
              },
              {
                icon: Maximize2,
                title: "Various Sizes",
                desc: "From 600x600 to large format 1200x2400 slabs for seamless looks."
              },
              {
                icon: Palette,
                title: "1000+ Designs",
                desc: "Endless possibilities with our extensive collection of finishes."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center space-y-4 p-6 rounded-2xl hover:bg-accent/50 transition-colors"
              >
                <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center text-primary">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Curated Collections</h2>
            <p className="text-muted-foreground">Browse by category to find your style</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Porcelain Tiles", "Ceramic Tiles", "Slab Tiles", "Sanitary Ware", "Artificial Quartz", "Mosaic"].map((cat, i) => (
              <Link
                key={i}
                href={`/products?category=${cat}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-200"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                {/* Placeholder Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-500" />

                <div className="absolute bottom-0 left-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">{cat}</h3>
                  <span className="text-white/80 text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    View Products <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
