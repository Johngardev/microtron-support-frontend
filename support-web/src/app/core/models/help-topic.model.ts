// Este archivo ahora es la única fuente de verdad para estas estructuras de datos.
export interface HelpCard {
    title: string;
    description: string;
    links: { text: string; url: string }[];
  }
  
  export interface HelpTopic {
    topicTitle: string;
    popularLinks?: { text: string; url: string }[];
    cards: HelpCard[];
  }