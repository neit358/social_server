import {
  UseFilters,
  UseInterceptors,
  /*UseGuards,*/ UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { ChatDto } from './dto/chat.dto';
import { ChatInterceptor } from './chat.interceptor';
// import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@WebSocketGateway(3002, { transports: ['websocket'] })
export class ChatGateway {
  @UseFilters(new BaseWsExceptionFilter())
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        new WsException(errors);
      },
    }),
  )
  // @UseGuards(AuthGuard)
  @UseInterceptors(ChatInterceptor)
  @SubscribeMessage('chats')
  handleChatMessage(
    @MessageBody() data: ChatDto,
    @ConnectedSocket() client: Socket,
  ): WsResponse<any> {
    try {
      console.log('Received message:', data.message);
      client.emit('response', `Server received: ${data.message}`);
      const event = 'events';
      return { event, data: data.message };
    } catch {
      throw new WsException('Invalid credentials.');
    }
  }
}
