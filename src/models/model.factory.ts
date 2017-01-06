import { ThinkyInstance, Types, ModelSchema, Model } from 'thinky';
import { BaseModel } from './models/baseModel'

export class ModelFactory {
    private types: Types;

    constructor( private thinky: ThinkyInstance ) {
        this.types = thinky.type;
    }

    private baseModel(): BaseModel {
        return {
            id: this.types.number(),
            date: this.types.date().default( new Date() )
        };
    }

    /**
     * Creates the base model for favorite protocol specific table
     *
     * @param {any} tableName
     * @returns
     */
    public createModel( tableName: string, columns: any, indexes: [ { name: string, options: any }] | undefined[] = [] ): Model {
        let model = this.baseModel();

        model = Object.assign( {}, model, columns );

        const entity = this.thinky.createModel( tableName, model );

        indexes.forEach( item => entity.ensureIndex( item.name, undefined, item.options ) );

        return entity;
    }
}