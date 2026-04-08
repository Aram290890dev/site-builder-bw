import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await hash("demo123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@bookwise.dev" },
    update: { password: hashedPassword },
    create: {
      email: "demo@bookwise.dev",
      name: "Demo Owner",
      password: hashedPassword,
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

  const properties = [
    {
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
    },
    {
      id: "seed-property-2",
      name: "Mountain Retreat Cabin",
      description:
        "A cozy 2-bedroom cabin nestled in the mountains with a fireplace, hot tub, and hiking trails at your doorstep.",
      address: "Aspen, Colorado",
      latitude: 39.1911,
      longitude: -106.8175,
      price: 320,
      currency: "USD",
      maxGuests: 4,
      images: ["/images/features-drag.png"],
      amenities: ["Hot Tub", "WiFi", "Fireplace", "Kitchen", "Parking", "Mountain View"],
    },
    {
      id: "seed-property-3",
      name: "Beachfront Bungalow",
      description:
        "A charming beachfront bungalow with direct ocean access, tropical garden, and open-air living spaces perfect for a relaxing getaway.",
      address: "Bali, Indonesia",
      latitude: -8.4095,
      longitude: 115.1889,
      price: 180,
      currency: "USD",
      maxGuests: 4,
      images: ["/images/features-booking.png"],
      amenities: ["Beach Access", "WiFi", "Pool", "Kitchen", "AC", "Garden"],
    },
  ];

  for (const p of properties) {
    const property = await prisma.property.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, siteId: site.id },
    });
    console.log("Seeded property:", property.name);
  }
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
