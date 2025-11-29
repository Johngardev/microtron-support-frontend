import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface ChatMessage {
  text: string;
  sender: string;
  senderType: 'Admin' | 'User';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl || 'http://localhost:3000');
  }

  joinIncident(incidentId: string) {
    this.socket.emit('joinIncident', incidentId);
  }

  leaveIncident(incidentId: string) {
    this.socket.emit('leaveIncident', incidentId);
  }

  sendMessage(incidentId: string, text: string, sender: string, senderType: 'Admin' | 'User') {
    this.socket.emit('sendMessage', { incidentId, text, sender, senderType });
  }

  getMessages(): Observable<ChatMessage> {
    return new Observable(observer => {
      this.socket.on('newMessage', (data: ChatMessage) => {
        observer.next(data);
      });
      // Cleanup on unsubscribe
      return () => {
        this.socket.off('newMessage');
      };
    });
  }
}
