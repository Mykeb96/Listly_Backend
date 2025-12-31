import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  getListings(): any {
    return this.prisma.listings.findMany({
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
  }

  getListingsByCategory(categoryName: string): any {
    return this.prisma.listings.findMany({
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
  }

  getListingsByUser(userId: number): any {
    return this.prisma.listings.findMany({
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
  }
}