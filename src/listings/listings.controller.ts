import { Controller, Get } from '@nestjs/common';
import { ListingsService } from './listings.service'

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Get()
    getListings(): any {
        return this.listingsService.getListings();
    }
}