import { HelpTopic } from "./help-topic.interface";

export interface Manufacturer {
  key: string;
  name: string;
  topics: HelpTopic[];
}