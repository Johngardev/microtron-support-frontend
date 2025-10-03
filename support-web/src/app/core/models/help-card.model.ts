export interface HelpLink {
    label: string;
    externalUrl?: string;
    routerLink?: string | any[];
  }
  
  export interface HelpCard {
    title: string;
    description?: string;
    links?: HelpLink[];
  }