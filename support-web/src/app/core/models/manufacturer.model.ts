import { HelpTopic } from "./help-topic.model";

export interface Manufacturer {
    key: string;
    name: string;
    topics: HelpTopic[];
}