var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var uuid = require('uuidv4');
var { loadOrder, queryOrders, upsertOrder, initDb } = require('./dbutil');

// GraphQL schema
var schema = buildSchema(`
    scalar Date
    type Query {
        order(id: String!): Order
        orders(
            location: String 
            start: Date 
            end: Date
        ): [Order]        
    }
    type Mutation {
        addOrder(input: OrderInput!): Order
    }  
    input OrderInput {
        id: String 
        request_date: Date
        location: String! 
        items: [ItemInput]!
        customer: CustomerInput
        source: String!
    }
    input CustomerInput {
        anonymous_id: String
        external_id: String
        fields: [String]
    }
    input ItemInput {
        label: String
        type: String
        quantity: Int
        perUnitPrice: Float
    }  
    type Order {
        id: String
        request_date: Date
        location: String
        items: [Item]
        customer: Customer
        source: String
    }
    type Item {
        label: String
        type: String
        quantity: Int
        perUnitPrice: Float
    }
    type Customer {
        anonymous_id: String
        external_id: String
        fields: [String]

    }
`);
var getOrder = function(args) { 
    var id = args.id;
    return loadOrder(id);
}
var getOrders = function(args) {
    if (args.location) {
        return queryOrders(args.location)
    } else {
        return queryOrders()
    } 
}
var createOrder = function(args) {
    var orderInput = args.input
    if (!orderInput.id)
        orderInput.id = uuid();
    if (!orderInput.request_date)
        orderInput.request_date = new Date()
    upsertOrder(orderInput)
    
}
var root = {
    order: getOrder,
    orders: getOrders,
    addOrder: createOrder
};
// Create an express server and a GraphQL endpoint
try {
    initDb();
} catch (error) {
    //ignore
}
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));