import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private messages = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messages.asObservable();

  private apiUrl = `${environment.apiUrl}/chatbot`;

  constructor(private http: HttpClient) {
    // Mensaje inicial del bot
    const initialMessage: ChatMessage = {
      text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    };
    this.messages.next([initialMessage]);
  }

  sendMessage(text: string): void {
    const userMessage: ChatMessage = {
      text,
      sender: 'user',
      timestamp: new Date()
    };
    // Añade el mensaje del usuario al stream
    this.messages.next([...this.messages.value, userMessage]);

    // Llama a la API del backend
    this.http.post<{ reply: string }>(`${this.apiUrl}/message`, { message: text })
      .subscribe(response => {
        const botMessage: ChatMessage = {
          text: response.reply,
          sender: 'bot',
          timestamp: new Date()
        };
        // Añade la respuesta del bot al stream
        this.messages.next([...this.messages.value, botMessage]);
      });
  }
}
