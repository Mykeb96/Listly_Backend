import { Controller, BadRequestException, Query, Get, Post, ParseIntPipe, Body, Delete, Param } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDTO } from "./dto/create-message.dto";

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    getMessages(
        @Query('sender', new ParseIntPipe({ optional: true })) sender: number,
        @Query('recipient', new ParseIntPipe({ optional: true })) recipient?: number
    ) {

        if (sender && recipient) {
            return this.messagesService.getMessagesByUserForUser(sender, recipient);
        }

        if (sender && !recipient) {
            return this.messagesService.getMessagesByUser(sender);
        }

        if (!sender) {
            throw new BadRequestException(`Please provider a 'sender' ID as a query parameter`)
        }
    }

    @Post()
    createMessage(
        @Body() createMessageDTO: CreateMessageDTO
    ) {
        return this.messagesService.createMessage(createMessageDTO)
    }

    @Delete(':id')
    deleteMessage(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.messagesService.deleteMessage(id)
    }
}