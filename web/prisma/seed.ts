import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Content (modules/lessons/cards) is typed TS in src/content — not seeded here.
// The seed only ensures a local dev user exists so M2 progress and the M3
// success metrics have an account to attach to before real auth (M4) lands.
const DEV_EMAIL = "dev@charaka.local";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: DEV_EMAIL },
    update: {},
    create: { email: DEV_EMAIL, role: "PHYSICIAN" },
  });
  console.log(`Seeded dev user: ${user.email} (${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
