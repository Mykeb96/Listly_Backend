import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "generated/prisma/client";
import { PrismaService } from "src/prisma.service";

type MessageWithRelations = Prisma.MessagesGetPayload<{
    select: {
        id: true,
        created_at: true,
        content: true,
        user: {
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true
            }
        },
        recipient: {
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true
            }
        }
    }
}>

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

    async getMessagesByUser(user_id): Promise<MessageWithRelations[]> {
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
                content: true,
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            }
        })

        if (messages.length === 0) {
            throw new NotFoundException(`This user has no messages`)
        }

        return messages;
    }

    async getMessagesByUserForUser(sender_id, recipient_id): Promise<MessageWithRelations[]> {
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
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            }
        })

        if (messages.length === 0) {
            throw new NotFoundException('There are no messages between these users')
        }

        return messages;
    }

    async createMessage(data: {
        user_id: number,
        recipient_id: number,
        content: string
    }): Promise<{
        message: string,
        createdMessage: any
    }> {
        const user = await this.prisma.users.findUnique({
            where: {
                id: data.user_id
            }
        })

        if (!user) {
            throw new NotFoundException(`No user found with the ID: ${data.user_id}`)
        }

        const createdMessage = await this.prisma.messages.create({
            data: {
                user_id: data.user_id,
                recipient_id: data.recipient_id,
                content: data.content
            },
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            }
        })

        return {
            message: 'Message successfully created',
            createdMessage: createdMessage
        }
    }

    async deleteMessage(id: number): Promise<{
        message: string,
        deletedMessage: {
            id: number,
            content: string,
            user: {
                id: number,
                first_name: string,
                last_name: string,
                email: string
            },
            recipient: {
                id: number,
                first_name: string,
                last_name: string,
                email: string
            }
        }
    }>{
        const message = await this.prisma.messages.findUnique({
            where: {
                id: id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            }
        })

        if (!message) {
            throw new NotFoundException(`Message with ID: ${id} not found`)
        }

        await this.prisma.messages.delete({
            where: {
                id: id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                recipient: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                }
            }
        })

        return {
            message: `Message successfully deleted`,
            deletedMessage: {
                id: message.id,
                content: message.content,
                user: message.user,
                recipient: message.recipient
            }
        }
    }

}