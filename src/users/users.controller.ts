import { Controller, Get, Query, BadRequestException, ParseIntPipe } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getUsers(
        @Query('id', new ParseIntPipe({ optional: true})) id?: number
    ) {
        if (id) {
            return this.usersService.getUserById(id)
        }
        return this.usersService.getUsers()
    }
}