import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  error(message: string, duration = 5000) {
    this.show({ id: String(Date.now()), message, type: 'error', duration });
  }

  success(message: string, duration = 4000) {
    this.show({ id: String(Date.now()), message, type: 'success', duration });
  }

  warning(message: string, duration = 5000) {
    this.show({ id: String(Date.now()), message, type: 'warning', duration });
  }
  private notificationSubject = new BehaviorSubject<Notification[]>([]);
  public notification$ = this.notificationSubject.asObservable();

  show(notification: Notification): void {
    this.notificationSubject.next([notification]);

    if (notification.duration !== 0) {
      setTimeout(() => {
        this.hide();
      }, notification.duration || 5000);
    }
  }

  hide(): void {
    this.notificationSubject.next([]);
  }

  constructor() { }
}
