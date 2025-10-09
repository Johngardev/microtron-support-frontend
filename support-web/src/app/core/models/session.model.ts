import { Manufacturer } from "./manufacturer.model";

export interface Session {
  id: string;
  manufacturer: Manufacturer;
  title: string;
  description: string;
  host: string;
  emails: string[];
  scheduledDate: Date;
  status: 'Abierta' | 'Cerrada';
}