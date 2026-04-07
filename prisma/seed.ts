import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@bookwise.dev" },
    update: {},
    create: {
      email: "demo@bookwise.dev",
      name: "Demo Owner",
      password: "demo123",
    },
  });

  console.log("Seeded user:", user.email);

  const site = await prisma.site.upsert({
    where: { subdomain: "astra-villas" },
    update: {},
    create: {
      name: "Astra Villas",
      subdomain: "astra-villas",
      ownerId: user.id,
      published: false,
      config: {
        theme: {
          primaryColor: "#4f46e5",
          fontFamily: "Inter",
        },
        sections: [
          {
            id: "hero-1",
            type: "hero",
            data: {
              title: "Welcome to Astra Villas",
              subtitle: "Luxury stays in the heart of the Mediterranean",
              ctaText: "Browse Properties",
            },
          },
          {
            id: "properties-1",
            type: "propertyGrid",
            data: {
              title: "Our Properties",
              columns: 3,
            },
          },
        ],
      },
    },
  });

  console.log("Seeded site:", site.name);

  const property = await prisma.property.upsert({
    where: { id: "seed-property-1" },
    update: {},
    create: {
      id: "seed-property-1",
      name: "The Clifftop Villa",
      description:
        "A stunning 4-bedroom villa perched on the cliffs of Mykonos with panoramic Aegean views, infinity pool, and private access to the beach.",
      address: "Mykonos, Greece",
      latitude: 37.4467,
      longitude: 25.3289,
      price: 450,
      currency: "EUR",
      maxGuests: 8,
      images: ["/images/hero-mockup.png"],
      amenities: ["Pool", "WiFi", "Kitchen", "Parking", "Sea View", "AC"],
      siteId: site.id,
    },
  });

  console.log("Seeded property:", property.name);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
