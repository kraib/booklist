import {httpGet, httpPost} from 'easy-express-controllers';

export default class RestProduct {
    get({id}){
        this.send({name: 'Some Product', id: id});
    }

    post({id, name, price}){
        this.send({updated: true});
    }

    put({id, name, price}){
        this.send({inserted: true});
    }

    delete({id}){
        this.send({deleted: true})
    }
}