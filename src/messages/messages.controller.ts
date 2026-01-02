import { Controller, BadRequestException, Query, Get, ParseIntPipe } from "@nestjs/common";
import { MessagesService } from "./messages.service";

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    getMessages(
        @Query('sender', new ParseIntPipe({ optional: true })) sender?: number,
        @Query('recipient', new ParseIntPipe({ optional: true })) recipient?: number
    ) {
        // If both sender and recipient are provided, get messages between them
        if (sender && recipient) {
            return this.messagesService.getMessagesByUserForUser(sender, recipient);
        }
        // If only user is provided, get all messages for that user
        if (sender && !recipient) {
            return this.messagesService.getMessagesByUser(sender);
        }
        // Otherwise, get all messages
        return this.messagesService.getMessages();
    }
}