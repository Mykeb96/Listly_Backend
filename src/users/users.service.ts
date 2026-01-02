import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

type User = {
    id?: number,
    created_at?: Date,
    first_name: string,
    last_name: string,
    email: string
}

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUsers(): Promise<User[]> {
        const users = await this.prisma.users.findMany()

        if (users.length === 0) {
            throw new NotFoundException('No users found')
        }

        return users;
    }

    async getUserById(id: number): Promise<User> {
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

    async createUser(data: {
        first_name: string,
        last_name: string,
        email: string
    }): Promise<{
        message: string,
        createdUser: User
    }> {
        const existingUser = await this.prisma.users.findUnique({
            where: {
                email: data.email
            }
        })

        if (existingUser) {
            throw new ConflictException(`User with email: ${data.email} already exists`)
        }

        const createdMessage = await this.prisma.users.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email
            }
        })

        return {
            message: `User ${createdMessage.email} successfully created`,
            createdUser: {
                first_name: createdMessage.first_name,
                last_name: createdMessage.last_name,
                email: createdMessage.email
            }
        }
    }

    async updateUser(
        id: number,
        data: {
        first_name?: string,
        last_name?: string,
        email?: string
    }): Promise<{
        message: string,
        updatedUser: User
    }> {
        const user = await this.prisma.users.findUnique({
            where: {
                id: id
            }
        })

        if (!user) {
            throw new NotFoundException(`User with ID: ${id} does not exist`)
        }

        const updatedUser = await this.prisma.users.update({
            where: {
                id: id
            },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email
            }
        })

        return {
            message: `User successfully updated`,
            updatedUser: {
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                email: updatedUser.email
            }
        }
    }

    async deleteUser(id: number): Promise<{message: string, deletedUser: User}> {
        const user = await this.prisma.users.findUnique({
            where: {
                id: id
            }
        })

        if (!user) {
            throw new NotFoundException(`No user found with the ID: ${id}`)
        }

        await this.prisma.users.delete({
            where: {
                id: id
            }
        })

        return {
            message: `User successfully deleted`,
            deletedUser: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        }
    }
}