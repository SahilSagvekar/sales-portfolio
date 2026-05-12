import { profiles } from "@/lib/profiles";
import ViralishHomepage from "@/components/ViralishHomepage";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = profiles[slug];
  if (!profile) return notFound();
  return <ViralishHomepage name={profile.name} photo={profile.photo} />;
}

export async function generateStaticParams() {
  return Object.keys(profiles).map(slug => ({ slug }));
} 