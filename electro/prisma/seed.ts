import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = [
    "Beef",
    "Chicken",
    "Goat Meat",
    "Pork",
    "Fish",
    "Sausage & Bacon",
    "Others",
  ];

  const categoryMap = new Map<string, string>();

  for (const categoryName of categories) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(categoryName) },
      update: { name: categoryName, isActive: true },
      create: {
        name: categoryName,
        slug: slugify(categoryName),
        isActive: true,
      },
    });

    categoryMap.set(categoryName, category.id);
  }

  const CATEGORY_ALIASES: Record<string, string> = {
    Goat: "Goat Meat",
    "Sausage/Bacon": "Sausage & Bacon",
  };

  const SKU_PREFIXES: Record<string, string> = {
    Beef: "BEEF",
    Chicken: "CHK",
    "Goat Meat": "GOAT",
    Pork: "PORK",
    Fish: "FISH",
    "Sausage & Bacon": "SAUS",
    Others: "OTHR",
  };

  const buildImageUrl = (category: string, name: string) => {
    const query = encodeURIComponent(`${category} ${name}`.replace(/[^a-zA-Z0-9\s]/g, ""));
    return `https://source.unsplash.com/featured/?${query}`;
  };

  const RAW_PRODUCTS = [
    { category: "Beef", name: "Beef Boneless Cubes, Lean", unit: "kg", price: 900 },
    { category: "Beef", name: "Beef Boneless Cubes, Ordinary", unit: "kg", price: 850 },
    { category: "Beef", name: "Beef Ordinary Steak", unit: "kg", price: 850 },
    { category: "Beef", name: "Beef Chuck Bone In", unit: "kg", price: 750 },
    { category: "Beef", name: "Beef Chuck Boneless", unit: "kg", price: 750 },
    { category: "Beef", name: "Beef Minced Meat, Lean", unit: "kg", price: 800 },
    { category: "Beef", name: "Beef Minced Meat, Ordinary", unit: "kg", price: 850 },
    { category: "Beef", name: "Beef on Bone (MOB)", unit: "kg", price: 750 },
    { category: "Beef", name: "Beef Stir Fry Strips", unit: "kg", price: 1260 },
    { category: "Beef", name: "Beef Rump Steak Whole", unit: "kg", price: 1200 },
    { category: "Beef", name: "Beef Rump Steak Sliced/Cubed", unit: "kg", price: 1300 },
    { category: "Beef", name: "Beef Top Rump Whole", unit: "kg", price: 1400 },
    { category: "Beef", name: "Beef Top Rump Sliced/Cubed", unit: "kg", price: 1400 },
    { category: "Beef", name: "Beef Topside Whole", unit: "kg", price: 900 },
    { category: "Beef", name: "Beef Topside Sliced/Cubed", unit: "kg", price: 1200 },
    { category: "Beef", name: "Beef Silverside Whole", unit: "kg", price: 1200 },
    { category: "Beef", name: "Beef Silverside Sliced/Cubed", unit: "kg", price: 1200 },
    { category: "Beef", name: "Beef Flank Steak/Goose Neck", unit: "kg", price: 1300 },
    { category: "Beef", name: "Beef Trimmed Fillet", unit: "kg", price: 1400 },
    { category: "Beef", name: "Beef Untrimmed Fillet", unit: "kg", price: 1300 },
    { category: "Beef", name: "Beef Trimmed Striploin", unit: "kg", price: 1400 },
    { category: "Beef", name: "Beef Untrimmed Striploin", unit: "kg", price: 1300 },
    { category: "Beef", name: "Beef Sirloin Steak", unit: "kg", price: 1400 },
    { category: "Beef", name: "Beef T-bone Whole", unit: "kg", price: 1000 },
    { category: "Beef", name: "Beef Ribeye Whole Bone In", unit: "kg", price: 980 },
    { category: "Beef", name: "Beef Ribeye Bone In", unit: "kg", price: 1300 },
    { category: "Beef", name: "Beef Ribeye Whole Boneless", unit: "kg", price: 1400 },
    { category: "Beef", name: "Beef Ribeye Boneless", unit: "kg", price: 1300 },
    { category: "Beef", name: "Beef Tomahawk Whole", unit: "kg", price: 1600 },
    { category: "Beef", name: "Beef Tomahawk", unit: "kg", price: 1800 },
    { category: "Beef", name: "Beef Barbeque Ribs", unit: "kg", price: 1200 },
    { category: "Beef", name: "Beef Short Ribs", unit: "kg", price: 1100 },
    { category: "Beef", name: "Beef Striploin", unit: "kg", price: 900 },
    { category: "Beef", name: "Beef Boneless Brisket", unit: "kg", price: 1300 },
    { category: "Beef", name: "Whole Beef Boneless Brisket", unit: "kg", price: 1300 },
    { category: "Beef", name: "Sliced Beef Hump Whole", unit: "kg", price: 600 },
    { category: "Beef", name: "Beef Hump Sliced", unit: "kg", price: 650 },
    { category: "Beef", name: "Beef Ossobuco", unit: "kg", price: 750 },
    { category: "Beef", name: "Ox Tail - Sliced", unit: "kg", price: 600 },
    { category: "Beef", name: "Ox Liver", unit: "kg", price: 800 },
    { category: "Beef", name: "Ox Kidney", unit: "kg", price: 400 },
    { category: "Beef", name: "Ox Tripe", unit: "kg", price: 400 },
    { category: "Beef", name: "Ox Heart", unit: "kg", price: 600 },
    { category: "Beef", name: "Beef Soup Bones", unit: "kg", price: 150 },
    { category: "Goat", name: "Whole Goat", unit: "kg", price: 900 },
    { category: "Goat", name: "Goat Leg", unit: "kg", price: 900 },
    { category: "Goat", name: "Goat Shoulder Whole", unit: "kg", price: 1000 },
    { category: "Goat", name: "Goat Shoulder Chops", unit: "kg", price: 1100 },
    { category: "Goat", name: "Goat Loin Chops", unit: "kg", price: 1300 },
    { category: "Goat", name: "Goat Leg Chops", unit: "kg", price: 1300 },
    { category: "Goat", name: "Goat Rack", unit: "kg", price: 1300 },
    { category: "Goat", name: "Goat Neck Sliced (Casserole)", unit: "kg", price: 820 },
    { category: "Goat", name: "Goat Mix Cut Up", unit: "kg", price: 800 },
    { category: "Goat", name: "Goat Mince", unit: "kg", price: 900 },
    { category: "Goat", name: "Goat Tripe", unit: "kg", price: 400 },
    { category: "Goat", name: "Goat Heart", unit: "kg", price: 650 },
    { category: "Goat", name: "Goat Liver", unit: "kg", price: 650 },
    { category: "Pork", name: "Pork Belly Ribs", unit: "kg", price: 1000 },
    { category: "Pork", name: "Pork Loin Chops", unit: "kg", price: 900 },
    { category: "Pork", name: "Smoked Pork Belly", unit: "kg", price: 1050 },
    { category: "Pork", name: "Pork Belly/Rashers", unit: "kg", price: 900 },
    { category: "Pork", name: "Pork Leg Steak", unit: "kg", price: 650 },
    { category: "Pork", name: "Pork Cubes", unit: "kg", price: 800 },
    { category: "Pork", name: "Pork on Skin", unit: "kg", price: 650 },
    { category: "Pork", name: "Pork Leg", unit: "kg", price: 650 },
    { category: "Pork", name: "Pork on Bone", unit: "kg", price: 780 },
    { category: "Pork", name: "Pork Cutlet", unit: "kg", price: 800 },
    { category: "Pork", name: "Pork Steak", unit: "kg", price: 800 },
    { category: "Chicken", name: "Chicken Drumsticks", unit: "kg", price: 700 },
    { category: "Chicken", name: "Chicken Capon", unit: "pc", price: 600 },
    { category: "Chicken", name: "Chicken Legs", unit: "kg", price: 580 },
    { category: "Chicken", name: "Chicken Wings", unit: "kg", price: 620 },
    { category: "Chicken", name: "Chicken Breast", unit: "kg", price: 730 },
    { category: "Chicken", name: "Chicken Gizzards", unit: "kg", price: 550 },
    { category: "Chicken", name: "Chicken Mince", unit: "kg", price: 750 },
    { category: "Fish", name: "Fish Fillet", unit: "kg", price: 1200 },
    { category: "Fish", name: "Whole Tilapia", unit: "pc", price: 450 },
    { category: "Sausage/Bacon", name: "Beef Sausage", unit: "kg", price: 700 },
    { category: "Sausage/Bacon", name: "Beef Sausage", unit: "500g", price: 350 },
    { category: "Sausage/Bacon", name: "Beef Bacon", unit: "kg", price: 1300 },
    { category: "Sausage/Bacon", name: "Beef Bacon", unit: "500g", price: 650 },
    { category: "Sausage/Bacon", name: "Beef Choma Sausage", unit: "kg", price: 800 },
    { category: "Sausage/Bacon", name: "Bacon Pieces", unit: "kg", price: 850 },
    { category: "Sausage/Bacon", name: "Pork Sausage", unit: "kg", price: 700 },
    { category: "Sausage/Bacon", name: "Pork Sausage", unit: "500g", price: 380 },
    { category: "Sausage/Bacon", name: "Pork Spicy Sausage", unit: "kg", price: 700 },
    { category: "Sausage/Bacon", name: "Collar Bacon", unit: "kg", price: 1400 },
    { category: "Sausage/Bacon", name: "Collar Bacon", unit: "500g", price: 700 },
    { category: "Sausage/Bacon", name: "Streaky Bacon", unit: "kg", price: 1500 },
    { category: "Sausage/Bacon", name: "Garlic Salami", unit: "kg", price: 830 },
    { category: "Sausage/Bacon", name: "Back Bacon", unit: "kg", price: 1400 },
    { category: "Others", name: "Eggs", unit: "Tray", price: 500 },
    { category: "Others", name: "Honey", unit: "kg", price: 700 },
    { category: "Others", name: "Spices", unit: "100g", price: 150 },
    { category: "Others", name: "Pet Food", unit: "kg", price: 130 },
    { category: "Others", name: "Pet Mince", unit: "kg", price: 180 },
  ];

  const categoryCounters = new Map<string, number>();

  const products = RAW_PRODUCTS.map((item) => {
    const normalizedCategory = CATEGORY_ALIASES[item.category] ?? item.category;
    const count = (categoryCounters.get(normalizedCategory) ?? 0) + 1;
    categoryCounters.set(normalizedCategory, count);
    const skuPrefix = SKU_PREFIXES[normalizedCategory] ?? "GEN";

    return {
      name: item.name,
      sku: `MNS-${skuPrefix}-${count.toString().padStart(3, "0")}`,
      description: `${item.name} sold per ${item.unit}.`,
      unit: item.unit,
      price: item.price,
      stock: 30,
      categoryName: normalizedCategory,
      imageUrl: buildImageUrl(normalizedCategory, item.name),
      isFeatured: count === 1,
      isPopular: count <= 3,
    };
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: slugify(product.name) },
      update: {
        name: product.name,
        sku: product.sku,
        description: product.description,
        unit: product.unit,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        isFeatured: product.isFeatured,
        isPopular: product.isPopular,
        status: "active",
        categoryId: categoryMap.get(product.categoryName),
      },
      create: {
        name: product.name,
        slug: slugify(product.name),
        sku: product.sku,
        description: product.description,
        unit: product.unit,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        isFeatured: product.isFeatured,
        isPopular: product.isPopular,
        status: "active",
        categoryId: categoryMap.get(product.categoryName),
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@meatnspice.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await hash(adminPassword, 12);

  const bannerSeeds = [
    {
      title: "Fresh Cuts Delivered Daily",
      description: "Order premium beef, chicken, goat, pork, fish, and sausages.",
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
      linkUrl: "/search",
      placement: "main",
      sortOrder: 0,
    },
    {
      title: "Butcher's Picks",
      description: "Curated bundles for grilling and roasting.",
      imageUrl: "https://images.unsplash.com/photo-1506368083636-6defb67639d8?auto=format&fit=crop&w=900&q=80",
      linkUrl: "/search",
      placement: "side",
      sortOrder: 0,
    },
    {
      title: "Fresh Arrivals",
      description: "Line-caught fish filleted each morning.",
      imageUrl: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=900&q=80",
      linkUrl: "/search",
      placement: "side",
      sortOrder: 1,
    },
  ];

  for (const banner of bannerSeeds) {
    await prisma.banner.create({ data: banner });
  }

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      isActive: true,
      role: "admin",
      name: "Admin",
    },
    create: {
      email: adminEmail,
      passwordHash,
      isActive: true,
      role: "admin",
      name: "Admin",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
