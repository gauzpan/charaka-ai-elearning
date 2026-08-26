import { PageLoader } from "@/components/ui/PageLoader";

// Next's route-segment loading convention: shown only while a segment below
// root is actually pending server work (e.g. (tabs)/layout.tsx's
// requireOnboardedUser() DB lookup right after sign-in) — never a persistent
// chrome, it's replaced the instant that segment resolves.
export default function Loading() {
  return <PageLoader />;
}
