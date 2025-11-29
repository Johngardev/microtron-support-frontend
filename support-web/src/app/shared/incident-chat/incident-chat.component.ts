import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { ChatMessage, ChatService } from '../../core/services/chat.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-incident-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './incident-chat.component.html',
  styleUrl: './incident-chat.component.css'
})
export class IncidentChatComponent implements OnInit, OnDestroy {
  @Input({ required: true }) incidentId!: string;
  @Input({ required: true }) currentUserName!: string;
  @Input({ required: true }) currentUserType!: 'Admin' | 'User';

  private _chatService = inject(ChatService);
  private _httpClient = inject(HttpClient);
  private msgSub!: Subscription;
  

  messages = signal<ChatMessage[]>([]);
  newMessage = '';

  ngOnInit() {
    // 1. CARGAR HISTORIAL DE MENSAJES VIA HTTP REST
    this.loadMessageHistory();

    // 2. Unirse a la sala
    this._chatService.joinIncident(this.incidentId);

    // 3. Escuchar mensajes nuevos en tiempo real
    this.msgSub = this._chatService.getMessages().subscribe((msg) => {
      this.messages.update(msgs => [...msgs, msg]);
      this.scrollToBottom();
    });
  }

  loadMessageHistory(): void {
    const url = `${environment.apiUrl}/incidents/${this.incidentId}/messages`;
    
    this._httpClient.get<ChatMessage[]>(url).subscribe(history => {
      // Ordenamos por fecha en el frontend (client-side)
      const sortedHistory = history.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      
      this.messages.set(sortedHistory);
      this.scrollToBottom();
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const msgPayload: ChatMessage = {
        text: this.newMessage,
        sender: this.currentUserName,
        senderType: this.currentUserType,
        createdAt: new Date()
    };

    // Optimistic Update: Lo mostramos inmediatamente
    // Nota: Si el socket.io rebota el mensaje, podrías duplicarlo si no manejas IDs únicos.
    // Una estrategia común es esperar el socket o filtrar por ID temporal.
    // Por simplicidad, aquí asumimos que el socket broadcast es nuestra fuente de verdad.
    
    this._chatService.sendMessage(
      this.incidentId, 
      this.newMessage, 
      this.currentUserName, 
      this.currentUserType
    );

    this.newMessage = '';
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.chat-container');
      if(container) container.scrollTop = container.scrollHeight;
    }, 100);
  }

  ngOnDestroy() {
    this._chatService.leaveIncident(this.incidentId);
    if (this.msgSub) this.msgSub.unsubscribe();
  }
}
