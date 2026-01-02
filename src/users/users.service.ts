import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "generated/prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUsers() {
        const users = await this.prisma.users.findMany()

        if (users.length === 0) {
            throw new NotFoundException('No users found')
        }

        return users;
    }

    async getUserById(id) {
        const user = await this.prisma.users.findUnique({
            where : {
                id: id
            }
        })

        if (!user) {
            throw new NotFoundException(`No user found for ID: ${id}`)
        }

        return user;
    }
}