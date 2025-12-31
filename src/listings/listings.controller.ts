import { Controller, Get, Query } from '@nestjs/common';
import { ListingsService } from './listings.service'

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Get()
    getListings(@Query('category') category?: string): any {
        if (category) {
            return this.listingsService.getListingsByCategory(category);
        }
        return this.listingsService.getListings();
    }
}