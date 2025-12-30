import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - be careful in production!)
  console.log('🧹 Cleaning existing data...');
  await prisma.messages.deleteMany();
  await prisma.listing_Images.deleteMany();
  await prisma.listings.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.users.deleteMany();

  // Create Categories
  console.log('📁 Creating categories...');
  const electronics = await prisma.categories.create({
    data: {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
    },
  });

  const furniture = await prisma.categories.create({
    data: {
      name: 'Furniture',
      description: 'Home and office furniture',
    },
  });

  const clothing = await prisma.categories.create({
    data: {
      name: 'Clothing',
      description: 'Apparel and accessories',
    },
  });

  const books = await prisma.categories.create({
    data: {
      name: 'Books',
      description: 'Books and reading materials',
    },
  });

  // Create Users
  console.log('👥 Creating users...');
  const user1 = await prisma.users.create({
    data: {
      email: 'john.doe@example.com',
      first_name: 'John',
      last_name: 'Doe',
    },
  });

  const user2 = await prisma.users.create({
    data: {
      email: 'jane.smith@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
    },
  });

  const user3 = await prisma.users.create({
    data: {
      email: 'bob.johnson@example.com',
      first_name: 'Bob',
      last_name: 'Johnson',
    },
  });

  // Create Listings
  console.log('📝 Creating listings...');
  const listing1 = await prisma.listings.create({
    data: {
      user_id: user1.id,
      title: 'Vintage Laptop',
      description: 'A well-maintained laptop from 2020. Perfect for students or remote work. Includes charger and original box.',
      cost: 450.00,
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      country: 'USA',
      categories: {
        connect: [{ id: electronics.id }],
      },
      images: {
        create: [
          {
            url: 'https://example.com/images/laptop1.jpg',
          },
          {
            url: 'https://example.com/images/laptop2.jpg',
          },
        ],
      },
    },
  });

  const listing2 = await prisma.listings.create({
    data: {
      user_id: user2.id,
      title: 'Comfortable Office Chair',
      description: 'Ergonomic office chair with lumbar support. Barely used, moving sale.',
      cost: 120.00,
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90001',
      country: 'USA',
      categories: {
        connect: [{ id: furniture.id }],
      },
      images: {
        create: [
          {
            url: 'https://example.com/images/chair1.jpg',
          },
        ],
      },
    },
  });

  const listing3 = await prisma.listings.create({
    data: {
      user_id: user1.id,
      title: 'Designer Jacket',
      description: 'Barely worn designer jacket. Size M. Perfect condition.',
      cost: 85.50,
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      country: 'USA',
      categories: {
        connect: [{ id: clothing.id }],
      },
      images: {
        create: [
          {
            url: 'https://example.com/images/jacket1.jpg',
          },
          {
            url: 'https://example.com/images/jacket2.jpg',
          },
        ],
      },
    },
  });

  const listing4 = await prisma.listings.create({
    data: {
      user_id: user3.id,
      title: 'Book Collection - Sci-Fi Classics',
      description: 'Collection of 10 classic science fiction novels. All in great condition.',
      cost: 35.00,
      city: 'Chicago',
      state: 'IL',
      zip_code: '60601',
      country: 'USA',
      categories: {
        connect: [{ id: books.id }],
      },
      images: {
        create: [
          {
            url: 'https://example.com/images/books1.jpg',
          },
        ],
      },
    },
  });

  // Create Messages
  console.log('💬 Creating messages...');
  await prisma.messages.create({
    data: {
      user_id: user2.id,
      recipient_id: user1.id,
      content: 'Hi! Is the laptop still available?',
    },
  });

  await prisma.messages.create({
    data: {
      user_id: user1.id,
      recipient_id: user2.id,
      content: 'Yes, it is! Are you interested in viewing it?',
    },
  });

  await prisma.messages.create({
    data: {
      user_id: user3.id,
      recipient_id: user2.id,
      content: 'I saw your office chair listing. Is it still available?',
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });