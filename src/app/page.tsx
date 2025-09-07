import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { ClientLogos } from "@/components/sections/client-logos";
import { LiveStats } from "@/components/sections/live-stats";
import { WebsiteAudit } from "@/components/sections/website-audit";
import { ProjectCalculator } from "@/components/sections/project-calculator";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";

export default function Home() {
  return (
    <>
      <Hero />
      <Portfolio />
      <ClientLogos />
      <LiveStats />
      <Services />
      <WebsiteAudit />
      <ProjectCalculator />
      <Testimonials />
      <Pricing />
    </>
  );
}
