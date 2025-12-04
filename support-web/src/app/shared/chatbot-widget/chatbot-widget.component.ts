import { Component, inject, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../core/services/chatbot.service';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../core/models/chat-message.model';

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrls: []
})
export class ChatbotWidgetComponent implements AfterViewInit {
  isOpen = false;
  private chatbotService = inject(ChatbotService);
  messages$: Observable<ChatMessage[]> = this.chatbotService.messages$;

  @ViewChild('chatBody') private chatBody: ElementRef<HTMLDivElement> | undefined;
  @ViewChildren('message') private messageElements: QueryList<ElementRef> | undefined;

  ngAfterViewInit() {
    this.messageElements?.changes.subscribe(() => {
      this.scrollToBottom();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  sendMessage(input: HTMLInputElement) {
    const message = input.value.trim();
    if (message) {
      this.chatbotService.sendMessage(message);
      input.value = '';
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }
}
