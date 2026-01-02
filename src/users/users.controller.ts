import { Controller, Get, Post, Body, Query, BadRequestException, ParseIntPipe, Delete, Param, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";

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

    @Post()
    createUser(
        @Body() createUserDTO: CreateUserDTO
    ) {
        return this.usersService.createUser(createUserDTO)
    }

    @Put(':id')
    updateUser(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateUserDTO: UpdateUserDTO
    ) {
        return this.usersService.updateUser(id, updateUserDTO)
    }

    @Delete(':id')
    deleteUser(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.deleteUser(id)
    }
}