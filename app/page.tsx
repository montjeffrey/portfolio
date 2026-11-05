import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TailnetScan from "@/components/TailnetScan";
import OpenSourceTrack from "@/components/OpenSourceTrack";
import PipelineScene from "@/components/PipelineScene";
import AboutIntro from "@/components/AboutIntro";
import SkillsBentoGrid from "@/components/SkillsBentoGrid";
import Capabilities from "@/components/Capabilities";
import BrandStatement from "@/components/BrandStatement";
import ClientSpotlight from "@/components/ClientSpotlight";
import BottomCTA from "@/components/BottomCTA";

export const metadata: Metadata = {
  title: "Jeffrey Montoya - Security-Minded Systems Engineer",
  description: "I build systems that move fast without moving recklessly: data pipelines, integrations, and open-source developer tooling, secured as they're built. CompTIA Security+.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <TailnetScan />
      <OpenSourceTrack />
      <PipelineScene />
      <AboutIntro />
      <SkillsBentoGrid />
      <Capabilities />
      <BrandStatement />
      <ClientSpotlight />
      <BottomCTA />
    </>
  );
}

