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

  async createListing(data: {
    user_id: number;
    title: string;
    description: string;
    cost: number;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    categoryIds?: number[];
    images?: { url: string }[];
  }): Promise<ListingWithRelations> {
    const user = await this.prisma.users.findUnique({
      where: { id: data.user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${data.user_id} not found`);
    }

    const listing = await this.prisma.listings.create({
      data: {
        user_id: data.user_id,
        title: data.title,
        description: data.description,
        cost: data.cost,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        country: data.country,
        categories: data.categoryIds && data.categoryIds.length > 0
          ? {
              connect: data.categoryIds.map(id => ({ id })),
            }
          : undefined,
        images: data.images && data.images.length > 0
          ? {
              create: data.images,
            }
          : undefined,
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

    return listing;
  }

  async updateListing(
    id: number,
    data: {
      title?: string;
      description?: string;
      cost?: number;
      city?: string;
      state?: string;
      zip_code?: string;
      country?: string;
      categoryIds?: number[];
      images?: { url: string }[];
    }
  ): Promise<{ message: string; updatedListing: ListingWithRelations }> {
    const listing = await this.prisma.listings.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID: ${id} does not exist`);
    }

    // If images are provided, delete old images and create new ones
    if (data.images !== undefined) {
      await this.prisma.listing_Images.deleteMany({
        where: { listing_id: id },
      });
    }

    // Build update data object, excluding undefined values
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.cost !== undefined) updateData.cost = data.cost;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zip_code !== undefined) updateData.zip_code = data.zip_code;
    if (data.country !== undefined) updateData.country = data.country;

    // Handle categories - replace all if provided
    if (data.categoryIds !== undefined) {
      updateData.categories = {
        set: data.categoryIds.map((catId) => ({ id: catId })),
      };
    }

    // Handle images - create new ones if provided
    if (data.images !== undefined && data.images.length > 0) {
      updateData.images = {
        create: data.images,
      };
    }

    // Update the listing
    const updatedListing = await this.prisma.listings.update({
      where: { id },
      data: updateData,
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

    return {
      message: 'Listing has been successfully updated',
      updatedListing: updatedListing,
    };
  }

  async deleteListing(id: number): Promise<{ 
    message: string; 
    deletedListing: { 
      id: number; 
      title: string; 
      user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
      };
    } 
  }> {
    const listing = await this.prisma.listings.findUnique({
      where: {
        id: id,
      },
      include: {
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

    if (!listing) {
      throw new NotFoundException(`Listing with ID: ${id} does not exist`);
    }

    await this.prisma.listing_Images.deleteMany({
      where: {
        listing_id: id,
      },
    });

    await this.prisma.listings.delete({
      where: {
        id: id,
      },
    });

    return {
      message: `Listing has been successfully deleted`,
      deletedListing: {
        id: listing.id,
        title: listing.title,
        user: listing.user,
      },
    };
  }
}