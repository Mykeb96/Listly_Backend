import { Controller, Get, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
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
            if (!isNaN(Number(category))) {
                throw new BadRequestException('Category must be a string, not a number');
            }
            return this.listingsService.getListingsByCategory(category);
        }
        return this.listingsService.getListings();
    }
}