import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDTO } from "./dto/create-category.dto";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    getCategories() {
        return this.categoriesService.getCategories()
    }

    @Post()
    createCategory(
        @Body() createMessageDTO: CreateCategoryDTO
    ) {
        return this.categoriesService.createCategory(createMessageDTO)
    }

    @Delete(':id')
    deleteCategory(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.categoriesService.deleteCategory(id)
    }
}