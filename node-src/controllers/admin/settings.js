import {httpGet, httpPost} from 'easy-express-controllers';

export default class Settings {
    @httpGet
    getSettings({id}){
        this.send({membershipLevel: 'Pro', id: id});
    }

    @httpPost
    save({id, newMembershipLevel}){
        this.send({saved: true});
    }
}