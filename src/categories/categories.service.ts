import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async getCategories() {
        const categories = await this.prisma.categories.findMany()

        if (categories.length === 0) {
            throw new NotFoundException(`No categories available`)
        }

        return categories;
    }

}