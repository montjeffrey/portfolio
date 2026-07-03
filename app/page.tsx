import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AboutIntro from "@/components/AboutIntro";
import SkillsBentoGrid from "@/components/SkillsBentoGrid";
import FeaturedProjects from "@/components/FeaturedProjects";
import Capabilities from "@/components/Capabilities";
import BrandStatement from "@/components/BrandStatement";
import BottomCTA from "@/components/BottomCTA";

export const metadata: Metadata = {
  title: "Jeffrey Montoya - Solutions Engineer",
  description: "Solutions Engineer specializing in business automation, web design, and full-stack development. I help businesses cut manual work, integrate their systems, and ship modern, high-performing websites.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <SkillsBentoGrid />
      <FeaturedProjects />
      <Capabilities />
      <BrandStatement />
      <BottomCTA />
    </>
  );
}

