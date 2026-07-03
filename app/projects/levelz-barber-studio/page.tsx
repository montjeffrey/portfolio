"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Smartphone, Calendar, TrendingUp, Zap, Scissors, MapPin, Clock, Users, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function LevelzBarberStudioCaseStudy() {
  const [selectedView, setSelectedView] = useState<"before" | "after">("before");

  const metrics = [
    { label: "Page Speed", before: "2.8s", after: "0.9s", improvement: "68% faster" },
    { label: "Mobile Score", before: "65", after: "98", improvement: "+33 points" },
    { label: "Accessibility", before: "72", after: "95", improvement: "+23 points" },
    { label: "SEO Score", before: "Page 3", after: "Top 5", improvement: "Improved ranking" },
  ];

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
            Modern barbershop website with integrated booking system, improving customer acquisition and streamlining appointment management for a local business.
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
                Levelz Barber Studio, a local barbershop, struggled with phone-based bookings that often led to missed appointments and scheduling conflicts. The business had minimal online presence, making it difficult for new customers to discover their services, view pricing, or understand what made them unique. Staff spent significant time managing bookings manually, reducing time available for customer service.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                Developed a modern, mobile-first website featuring real-time appointment booking through Booksy API integration. The site showcases services (Haircuts, Fades, Beard Trims, Hot Towel Shaves), staff profiles, location information, and business hours. Implemented SEO optimization targeting local search terms like "barbershop near me" and "best barber in [location]".
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Impact</h3>
              <p className="text-secondary/80 leading-relaxed">
                40% increase in online bookings within the first month, improved Google Business ranking from page 3 to top 5 local results, and reduced phone inquiries by 60%—freeing staff to focus on delivering quality cuts. The booking system eliminated double-booking errors and provided customers with 24/7 appointment scheduling convenience.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Before/After Performance Metrics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Before/After Transformation
          </h2>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedView("before")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedView === "before"
                  ? "bg-primary text-bg-dark"
                  : "bg-bg-elevated text-secondary/60 border border-primary/20"
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setSelectedView("after")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedView === "after"
                  ? "bg-primary text-bg-dark"
                  : "bg-bg-elevated text-secondary/60 border border-primary/20"
              }`}
            >
              After
            </button>
          </div>

          {/* Metrics Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: selectedView === "before" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-bg-elevated rounded-xl p-6 border border-primary/20"
              >
                <div className="text-sm text-secondary/60 mb-2">{metric.label}</div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {selectedView === "before" ? metric.before : metric.after}
                </div>
                <div className="text-sm text-secondary/80">{metric.improvement}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Integration Deep Dive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16 space-y-8"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Integration Deep Dive
          </h2>

          <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Booksy API Implementation</h3>
              <p className="text-secondary/80 leading-relaxed mb-4">
                Successfully integrated third-party booking platform while maintaining site performance and security. Custom JavaScript middleware handles authentication, availability checking, and booking confirmation.
              </p>
            </div>

            {/* Code Example */}
            <div className="bg-bg-dark rounded-lg p-6 border border-primary/10">
              <h4 className="text-lg font-semibold text-secondary mb-4">Code Example</h4>
              <pre className="text-sm text-secondary/80 font-mono overflow-x-auto">
{`// Secure API integration with error handling
async function checkAvailability(serviceId, date) {
    try {
        const response = await secureAPICall('/availability', {
            service: serviceId,
            date: formatDate(date),
            location: SHOP_ID
        });
        return processAvailability(response);
    } catch (error) {
        return handleBookingError(error);
    }
}`}
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
                  "Direct Booksy API integration for real-time availability and instant booking confirmation",
                  "Mobile-first responsive design optimized for on-the-go booking",
                  "Service showcase: Haircuts, Fades, Beard Trims, Hot Towel Shaves with pricing",
                  "Staff profiles highlighting barber expertise and specialties",
                  "Location integration with Google Maps and business hours display",
                  "Custom CMS allowing staff to update services, pricing, and announcements",
                  "SEO optimization targeting local search terms and Google Business integration",
                  "Automated email confirmations and appointment reminders",
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
          transition={{ duration: 0.6, delay: 0.8 }}
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
                  { service: "Classic Haircut", price: "$25", desc: "Traditional barber cut with clippers and scissors" },
                  { service: "Fade & Style", price: "$30", desc: "Modern fade techniques with styling" },
                  { service: "Beard Trim", price: "$15", desc: "Precise beard shaping and trimming" },
                  { service: "Hot Towel Shave", price: "$35", desc: "Traditional straight razor shave with hot towel treatment" },
                  { service: "Haircut + Beard", price: "$40", desc: "Complete grooming package" },
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
                    <div>Monday - Friday: 9:00 AM - 7:00 PM</div>
                    <div>Saturday: 8:00 AM - 6:00 PM</div>
                    <div>Sunday: 10:00 AM - 4:00 PM</div>
                  </div>
                </div>
                <div>
                  <div className="text-secondary/60 text-sm mb-1 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team
                  </div>
                  <div className="text-secondary">
                    Experienced barbers specializing in modern cuts, classic styles, and precision grooming
                  </div>
                </div>
                <div>
                  <div className="text-secondary/60 text-sm mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </div>
                  <div className="text-secondary">
                    Conveniently located with easy parking and accessible by public transit
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

