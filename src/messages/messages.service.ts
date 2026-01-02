import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "generated/prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) {}

    async getMessages() {
        const messages = await this.prisma.messages.findMany()

        if (messages.length === 0) {
            throw new NotFoundException(`No messages found`)
        }

        return messages;
    }

    async getMessagesByUser(user_id) {
        const user = await this.prisma.users.findUnique({
            where: {
                id: user_id
            }
        })

        if (!user) {
            throw new NotFoundException(`No user found for ID: ${user_id}`)
        }

        const messages = await this.prisma.messages.findMany({
            where: {
                user_id: user_id
            },
            select: {
                id: true,
                created_at: true,
                user_id: true,
                content: true,
                recipient: true
            }
        })

        if (messages.length === 0) {
            throw new NotFoundException(`This user has no messages`)
        }

        return messages;
    }

    async getMessagesByUserForUser(sender_id, recipient_id) {
        const sender = await this.prisma.users.findUnique({
            where: {
                id: sender_id
            }
        })

        const recipient = await this.prisma.users.findUnique({
            where: {
                id: recipient_id
            }
        })

        if (!sender) {
            throw new NotFoundException(`User with ID: ${sender_id} does not exist`);
        }
        if (!recipient) {
            throw new NotFoundException(`Recipient with ID: ${recipient_id} does not exist`);
        }

        const messages = await this.prisma.messages.findMany({
            where: {
                user_id: sender_id,
                recipient_id: recipient_id
            },
            select: {
                id: true,
                created_at: true,
                content: true,
                user: true,
                recipient: true
            }
        })

        if (messages.length === 0) {
            throw new NotFoundException('There are no messages between these users')
        }

        return messages;
    }

    
}