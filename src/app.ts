import * as thinkyModule from 'thinky';
import { ThinkyInstance, Model } from 'thinky';
import { ModelFactory } from './models/model.factory'

export class DataService {
    private thinky: ThinkyInstance;
    private modelFactory: ModelFactory;

    constructor( host, port, authKey, dbName ) {
        this.thinky = thinkyModule( { host: host, port: port, authKey: authKey, db: dbName });
        this.modelFactory = new ModelFactory( this.thinky );
    }

    public get thinkTypes() {
        return this.thinky.type;
    }

    public defineResource( tableName: string, columns: any, indexes: any ) {
        return this.modelFactory.createModel( tableName, columns, indexes );
    }

    public saveFromReq( Model: Model, req ) {
        const data = req.body;
        data.id = parseInt( req.decodedToken.sub );
        delete data.userId;

        return this.save( Model, data );
    }

    public save( Model, data ) {
        if ( !( data.userId || data.id ) ) {
            throw new Error( 'Dados inconsistentes' );
        }

        if ( !data.id && data.userId ) {
            data.id = data.userId;
            delete data.userId;
        }
        
        return Model.get( data.id ).run()
            .then( res => {
                if ( new Date( data.date ).getTime() > new Date( res.date ).getTime() ) {
                    return Model.get( data.id ).replace( data ).execute();
                } else {
                    return res;
                }
            })
            .catch( err => {
                if ( err.name === 'DocumentNotFoundError' ) {
                    const obj = new Model( data );
                    return obj.save();
                } else {
                    throw err;
                }
            });
    };
} 
