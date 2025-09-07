import { Testimonials } from "@/components/sections/testimonials";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="py-20 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            About <span className="text-gradient bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">Datorque</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            We&apos;re a team of passionate developers and designers creating exceptional digital experiences for Indian businesses.
          </p>
        </div>
      </div>
      <Testimonials />
    </div>
  );
}

export const metadata = {
  title: "About - Datorque",
  description: "Learn more about Datorque, our team, and our mission to fuel your digital momentum.",
};
