import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

// Authed but not-yet-onboarded users land here; finished users skip to Today.
export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.onboardedAt) redirect("/today");
  return <OnboardingFlow />;
}
