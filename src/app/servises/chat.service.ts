import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

export class ChatService {
    private url = '45.83.43.173:3000';
    private socket;
    constructor() {
        this.socket = io(this.url);
    }
    public sendMessage(message) {
        this.socket.emit('new-message', message);
    }

    public requestHistory(message) {
        this.socket.emit('get-history', message);
    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
        });
    }

    public getHistory = () => {
        return Observable.create((observer) => {
            this.socket.on('get-history', (message) => {
                observer.next(message);
            });
        });
    }
}