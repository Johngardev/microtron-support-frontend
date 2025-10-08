import { HelpCard } from "./help-card.interface";

export interface HelpTopic {
  topicTitle: string;
  popularLinks?: { text: string; url: string }[];
  cards: HelpCard[];
}