import { redirect } from "next/navigation";

// Today is the default landing so a returning user needs zero decisions
// to make progress (design.md §4.1).
export default function Home() {
  redirect("/today");
}
