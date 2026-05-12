import ViralishHomepage from "@/components/ViralishHomepage";
import { profiles } from "@/lib/profiles";

export default function Home() {
  const profile = profiles["kriszy"];
  return <ViralishHomepage name={profile.name} photo={profile.photo} />;
}