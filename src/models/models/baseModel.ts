import { ModelSchema } from 'thinky';

export interface BaseModel extends ModelSchema {
    id: any;
    date: any;
}
