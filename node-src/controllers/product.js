import {httpGet, httpPost, route} from 'easy-express-controllers';

export default class Product {
    getProduct({id}){
        this.send({name: 'Some Product', id: id});
    }

    @httpPost
    save({id, name, price}){
        this.send({saved: true});
    }

    //you can also override the route
    //this will use the default route, so GET product/
    //if I'd written @httpGet('all') this action would be
    //available at GET product/all
    @httpGet('') 
    allProducts(){
        this.send({products: [{id: 1, name: 'Product 1'}]})
    }    
}