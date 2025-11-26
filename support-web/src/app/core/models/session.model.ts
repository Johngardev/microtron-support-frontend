import { Manufacturer } from "./manufacturer.model";

export interface Session {
  calendlyEventUri: any;
  id: string;
  // Compatibilidad: el backend devuelve manufacturerKey/manufacturerName.
  manufacturer?: Manufacturer | null;
  manufacturerKey?: string;
  manufacturerName?: string;
  title: string;
  description?: string;
  admin: string;
  emails: string[];
  requestDate: Date;
  scheduledDate: Date;
  status: 'Abierto' | 'Cerrado';
}