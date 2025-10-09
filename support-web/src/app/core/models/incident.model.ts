export interface Incident {
  id: string;
  status: 'Abierto' | 'Cerrado' | 'En Proceso';
  product: string;
  title: string;
  description?: string;
  priority: 'Alta' | 'Media' | 'Baja';
  creationDate: Date;
  notificationEmails?: string[];
  attachments?: File[];
  admin: string;
  phoneNumber?: string;
}