import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from 'generated/prisma/client';

type ListingWithRelations = Prisma.ListingsGetPayload<{
  include: {
    categories: true;
    images: true;
    user: {
      select: {
        id: true;
        first_name: true;
        last_name: true;
        email: true;
      };
    };
  };
}>;

type ListingWithCategoriesAndImages = Prisma.ListingsGetPayload<{
  include: {
    categories: true;
    images: {
      select: {
        id: true;
        created_at: true;
        url: true;
      };
    };
  };
}>;

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async getListings(): Promise<ListingWithRelations[]> {
    const listings = await this.prisma.listings.findMany({
      include: {
        categories: true,
        images: true,
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    if (listings.length === 0) {
        throw new NotFoundException('No listings found')
    }

    return listings;
  }

  async getListingsByCategory(categoryName: string): Promise<ListingWithRelations[]> {
    const category = await this.prisma.categories.findFirst({
      where: {
        name: {
          equals: categoryName,
          mode: 'insensitive',
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category does not exist: ${categoryName}`);
    }

    const listings = await this.prisma.listings.findMany({
      where: {
        categories: {
          some: {
            name: {
              equals: categoryName,
              mode: 'insensitive', // Case-insensitive search
            },
          },
        },
      },
      include: {
        categories: true,
        images: true,
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    if (listings.length === 0) {
        throw new NotFoundException(`No listings found under the category: ${categoryName}`)
    }

    return listings;
  }

  async getListingsByUser(userId: number): Promise<ListingWithCategoriesAndImages[]> {
    // First, check if the user exists
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get listings for the user
    const listings = await this.prisma.listings.findMany({
      where: {
        user_id: userId,
      },
      include: {
        categories: true,
        images: {
          select: {
            id: true,
            created_at: true,
            url: true,
          },
        },
      },
    });

    // Check if user has any listings
    if (listings.length === 0) {
      throw new NotFoundException(`No listings found for user with ID: ${userId}`);
    }

    return listings;
  }

  async getListingsById(id: number): Promise<ListingWithCategoriesAndImages> {
    const listing = await this.prisma.listings.findUnique({
      where: {
        id: id,
      },
      include: {
        categories: true,
        images: {
          select: {
            id: true,
            created_at: true,
            url: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException(`No listing found for ID: ${id}`);
    }

    return listing;
  }
}