import { MessageBoxAction, MessageBoxProps } from '../components/message-box';
export interface MessageBoxOptions extends Omit<MessageBoxProps, 'message' | 'modelValue'> {
    message: string;
}
export interface MessageBoxResult {
    action: 'confirm';
    value: string;
}
export type MessageBoxPromise = Promise<MessageBoxResult> & {
    close: () => void;
};
export interface MessageBoxService {
    (options: MessageBoxOptions | string): MessageBoxPromise;
    alert: (message: string, title?: string, options?: Partial<MessageBoxOptions>) => MessageBoxPromise;
    confirm: (message: string, title?: string, options?: Partial<MessageBoxOptions>) => MessageBoxPromise;
    prompt: (message: string, title?: string, options?: Partial<MessageBoxOptions>) => MessageBoxPromise;
}
export declare class MessageBoxCancelError extends Error {
    action: Exclude<MessageBoxAction, 'confirm'>;
    constructor(action: Exclude<MessageBoxAction, 'confirm'>);
}
export declare const messageBox: MessageBoxService;
