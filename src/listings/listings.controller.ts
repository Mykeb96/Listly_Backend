import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ListingsService } from './listings.service'

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Get()
    getListings(
        @Query('category') category?: string,
        @Query('user', new ParseIntPipe({ optional: true })) user?: number,
        @Query('id', new ParseIntPipe({ optional: true })) id?: number
    ): any {
        if (id) {
            return this.listingsService.getListingsById(id);
        }
        if (user) {
            return this.listingsService.getListingsByUser(user);
        }
        if (category) {
            return this.listingsService.getListingsByCategory(category);
        }
        return this.listingsService.getListings();
    }
}