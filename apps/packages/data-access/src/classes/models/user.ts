import { WidgetKey } from "./widgets";

export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string;
    document: string;
    image: string;
    selectedWidgets: WidgetKey[];
}
