import { Hero } from "@/components/niyantra/hero";
import { Features } from "@/components/niyantra/features";
import { HowItWorks } from "@/components/niyantra/how-it-works";
import { RoleShowcase } from "@/components/niyantra/role-showcase";
import { Testimonials } from "@/components/niyantra/testimonials";
import { CTABanner } from "@/components/niyantra/cta-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <RoleShowcase />
      <Testimonials />
      <CTABanner />
    </>
  );
}
