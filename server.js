var newrelic = require('newrelic');
var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var uuid = require('uuidv4');
var { getCachedTrends } = require('./custom_instrumentation');
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
        trends: Trends  
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
        items: [OrderItem]
        customer: Customer
        source: String
    }
    type OrderItem {
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
    type Trends {
        locations: [TrendData]
        types: [TrendData]
    }
    type TrendData {
        label: String
        value: Int
    }
`);
var getOrder = (args) => { 
    var id = args.id;
    return loadOrder(id);
}
var getOrders = (args) => {
    if (args.location) {
        return queryOrders(args.location)
    } else {
        return queryOrders()
    } 
}
var createOrder = (args) => {
    var orderInput = args.input
    if (!orderInput.id)
        orderInput.id = uuid();
    if (!orderInput.request_date)
        orderInput.request_date = new Date()
    return upsertOrder(orderInput)
    
}
var getTrends = () => {
    return getCachedTrends();
}
var root = {
    addOrder: createOrder,
    order: getOrder,
    orders: getOrders,
    trends: getTrends
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true,
    formatError: error => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path
        })
}));
app.listen(4000, () => {
    initDb().then(() => {
        console.log('Express GraphQL Server Now Running On localhost:4000/graphql')
    }).catch((err) => {
        console.log("Error during startup.")
    });
});