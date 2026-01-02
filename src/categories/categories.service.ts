import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

type Category = {
    id: number,
    name: string,
    description: string | null
}

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

    async createCategory(data: {
        name: string,
        description: string
    }): Promise<{
        message: string,
        createdCategory: {
            id: number,
            created_at: Date,
            name: string,
            description: string | null
        }
    }> {
        const createdCategory = await this.prisma.categories.create({
            data: {
                name: data.name,
                description: data.description
            }
        })

        return {
            message: `Category successfully created`,
            createdCategory: createdCategory
        }
    }

    async deleteCategory(id: number): Promise<{
        message: string, deletedCategory: Category
    }> {
        const category = await this.prisma.categories.findUnique({
            where: {
                id: id
            }
        })

        if (!category) {
            throw new NotFoundException(`No category found with ID: ${id}`)
        }

        await this.prisma.categories.delete({
            where: {
                id: id
            }
        })

        return {
            message: `Category successfully deleted`,
            deletedCategory: {
                id: category.id,
                name: category.name,
                description: category.description
            }
        }
    }
}