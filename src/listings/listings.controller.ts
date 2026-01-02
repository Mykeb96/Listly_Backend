import { Controller, Get, Post, Put, Body, Query, Param, ParseIntPipe, BadRequestException, Delete } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

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

    @Post()
    createListing(@Body() createListingDto: CreateListingDto) {
        return this.listingsService.createListing(createListingDto);
    }

    @Put(':id')
    updateListing(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateListingDto: UpdateListingDto
    ) {
        return this.listingsService.updateListing(id, updateListingDto);
    }

    @Delete(':id')
    deleteListing(@Param('id', ParseIntPipe) id: number) {
        return this.listingsService.deleteListing(id);
    }
}