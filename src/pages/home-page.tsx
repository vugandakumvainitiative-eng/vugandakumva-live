import { HeroCarousel } from "../features/home/hero-carousel";
import { AboutSection } from "../features/home/about-section";
import { AwarenessSection } from "../features/home/awareness-section";
import { SupportFinder } from "../features/home/support-finder";
export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HeroCarousel />
      <AboutSection />
      <AwarenessSection />
      <SupportFinder />
    </main>
  );
}
