import { Controller, Get, Query } from '@nestjs/common';
import { ListingsService } from './listings.service'

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Get()
    getListings(
        @Query('category') category?: string,
        @Query('user') user?: string
    ): any {
        if (user) {
            const userId = parseInt(user, 10);
            if (isNaN(userId)) {
                throw new Error('Invalid user ID');
            }
            return this.listingsService.getListingsByUser(userId);
        }
        if (category) {
            return this.listingsService.getListingsByCategory(category);
        }
        return this.listingsService.getListings();
    }
}