import { Controller, BadRequestException, Query, Get, ParseIntPipe } from "@nestjs/common";
import { MessagesService } from "./messages.service";

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
}