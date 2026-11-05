"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Smartphone, Calendar, Scissors, MapPin, Clock, Users, ExternalLink } from "lucide-react";

export default function LevelzBarberStudioCaseStudy() {
  return (
    <div className="min-h-screen bg-bg-dark pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <h1 className="text-5xl md:text-6xl font-serif text-secondary mb-6">
            Levelz Barber Studio Website
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Web Development
            </span>
            <a
              href="https://levelzbarberstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Live at levelzbarberstudio.com
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed">
            Modern barbershop website for a local business, with online booking through Booksy's embedded widget.
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 bg-bg-elevated rounded-2xl p-8 border border-primary/20"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6">Project Overview</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Challenge</h3>
              <p className="text-secondary/80 leading-relaxed">
                Levelz Barber Studio, a local barbershop, needed a website where new customers could find its services, prices, barbers, and hours, and book an appointment without calling the shop.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                Built a hand-coded, mobile-first static site (plain HTML, CSS, and JavaScript, no framework) deployed on Netlify, with real-time appointment booking through an embedded Booksy widget. The site covers services and pricing, the barbers, products, a gallery, booking, and contact details. Schema.org structured data describes the shop, its services and products, and its FAQ, so search engines can show hours, prices, and answers directly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Impact</h3>
              <p className="text-secondary/80 leading-relaxed">
                The shop has a fast, mobile-first static site on Netlify with Booksy's embedded booking widget on every page. A Lighthouse CI workflow checks Core Web Vitals budgets (LCP 2.5s or less, INP 200ms or less, CLS 0.1 or less) on desktop and mobile for every pull request.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Integration Deep Dive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16 space-y-8"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Integration Deep Dive
          </h2>

          <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Booksy Booking Integration</h3>
              <p className="text-secondary/80 leading-relaxed mb-4">
                Embedded Booksy's official booking widget so customers see live availability and book without leaving the site, while Booksy handles payments, confirmations, and reminders. Every Book button opens the same Booksy booking dialog, and FAQ answers link to the booking page.
              </p>
            </div>

            {/* Code Example */}
            <div className="bg-bg-dark rounded-lg p-6 border border-primary/10">
              <h4 className="text-lg font-semibold text-secondary mb-4">Code Example</h4>
              <pre className="text-sm text-secondary/80 font-mono overflow-x-auto">
{`// Booksy widget: any element with .js-booksy-open opens the booking dialog
window.booksyWidgetConfig = {
    id: "1066445",
    country: "us",
    lang: "en-US",
    button: { container: ".js-booksy-open", label: "Book Now!" },
    mode: "dialog"
};`}
              </pre>
            </div>

            {/* Key Features */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Key Features
              </h4>
              <ul className="space-y-3">
                {[
                  "Embedded Booksy widget for real-time availability and instant booking confirmation",
                  "Mobile-first responsive design optimized for on-the-go booking",
                  "Service menu with pricing, from haircuts and beard work to hot towel shaves",
                  "Staff profiles highlighting barber expertise and specialties",
                  "Location integration with Google Maps and business hours display",
                  "Schema.org structured data for the shop, its services and products, and its FAQ",
                  "Email confirmations and appointment reminders handled by Booksy",
                ].map((feature, i) => (
                  <li key={i} className="text-secondary/80 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Services & Content Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
          >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Scissors className="w-8 h-8 text-primary" />
            Website Content & Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Services */}
            <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-serif text-secondary mb-6 flex items-center gap-2">
                <Scissors className="w-6 h-6 text-primary" />
                Services Offered
              </h3>
              <ul className="space-y-3">
                {[
                  { service: "LVL 1: Haircut", price: "$30", desc: "Haircut" },
                  { service: "LVL 2: Haircut and Beard", price: "$40", desc: "Haircut and beard" },
                  { service: "LVL 5: Full Service", price: "$80", desc: "Haircut, beard, eyebrows, steamer, and wash" },
                  { service: "Kids Special", price: "$25", desc: "12 and under" },
                  { service: "Hot Towel Shave", price: "$20", desc: "Classic hot towel shave" },
                ].map((item, i) => (
                  <li key={i} className="border-b border-primary/10 pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-secondary font-semibold">{item.service}</span>
                      <span className="text-primary font-mono">{item.price}</span>
                    </div>
                    <p className="text-secondary/60 text-sm">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Info */}
            <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-serif text-secondary mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Business Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-secondary/60 text-sm mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hours
                  </div>
                  <div className="text-secondary">
                    <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                    <div>Saturday: 9:00 AM - 3:00 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
                <div>
                  <div className="text-secondary/60 text-sm mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team
                  </div>
                  <div className="text-secondary">
                    Each barber has a profile on the Our Barbers page listing experience and specialties
                  </div>
                </div>
                <div>
                  <div className="text-secondary/60 text-sm mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </div>
                  <div className="text-secondary">
                    46 Main St, Succasunna, NJ, with an embedded Google Map on the contact page
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

