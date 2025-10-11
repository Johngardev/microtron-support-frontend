import { Manufacturer } from "./manufacturer.model";

export interface Session {
  id: string;
  manufacturer: Manufacturer;
  title: string;
  description?: string;
  admin: string;
  emails: string[];
  requestDate: Date;
  scheduledDate: Date;
  status: 'Abierto' | 'Cerrado';
}