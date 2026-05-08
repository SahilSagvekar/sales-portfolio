import { profiles } from "@/lib/profiles";
import ViralishHomepage from "@/components/ViralishHomepage";
import { notFound } from "next/navigation";

export default function ProfilePage({ params }: { params: { slug: string } }) {
  const profile = profiles[params.slug];
  if (!profile) return notFound();
  return <ViralishHomepage name={profile.name} />;
}

export function generateStaticParams() {
  return Object.keys(profiles).map(slug => ({ slug }));
}