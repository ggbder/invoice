// prisma/seed.ts
import { PrismaClient, RoleUtilisateur } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const userId = "admin";

  const existing = await prisma.utilisateur.findUnique({
    where: { nomUtilisateur: userId },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.$transaction([
      prisma.utilisateur.create({
        data: {
          nomUtilisateur: userId,
          motDePasseHash: hashedPassword,
          role: RoleUtilisateur.ADMIN,
        },
      }),
    ]);

    console.log("✅ Admin user created.");
  } else {
    console.log("⚠️ Admin user already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
