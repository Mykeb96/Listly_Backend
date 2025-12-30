import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  getListings(): any {
    return this.prisma.listings.findMany();
  }
}