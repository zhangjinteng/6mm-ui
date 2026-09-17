import { MessageProps } from '../components/message';
export interface MessageOptions extends Omit<MessageProps, 'message'> {
    message: string;
}
export interface MessageHandler {
    close: () => void;
    id: string;
}
export interface MessageService {
    (options: MessageOptions | string): MessageHandler;
    closeAll: () => void;
    error: (options: MessageOptions | string) => MessageHandler;
    info: (options: MessageOptions | string) => MessageHandler;
    success: (options: MessageOptions | string) => MessageHandler;
    warning: (options: MessageOptions | string) => MessageHandler;
}
export declare const message: MessageService;
