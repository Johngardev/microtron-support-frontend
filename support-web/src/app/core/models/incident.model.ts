export interface Incident {
  _id: string;
  code: string;
  status: 'Abierto' | 'En Proceso' | 'Resuelto' | 'Cerrado';
  product: string;
  title: string;
  description?: string;
  priority: 'Alta' | 'Media' | 'Baja';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  notificationEmails?: string[];
  attachments?: string[];
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}