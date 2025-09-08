import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - DatorQue",
  description: "Learn more about DatorQue, our team, and our mission to fuel your digital momentum.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
