var newrelic = require('newrelic');
var env = require('node-env-file');
var cache = require('memory-cache');
var { GraphQLClient } = require('graphql-request');

//load environment variables
env(__dirname + '/.env');
const apiKey = process.env.NEWRELIC_API_KEY;
const account_id = process.env.NEWRELIC_ACCOUNT_ID;
const nerdGraphEndpoint = process.env.NEWRELIC_GRAPHQL_ENDPOINT;
const query = `{
        actor { 
            account(id: ${account_id}) { 
                bagelLocations: nrql(query: "SELECT sum(quantity) FROM BagelOrderItem SINCE 7 days AGO facet location limit 1000") {
                    results
                }
                bagelTypes: nrql(query: "SELECT sum(quantity) FROM BagelOrderItem SINCE 7 days AGO facet type limit 1000") {
                    results
                }
            } 
        } 
}`;
class Trends {
    constructor(locations, types) {
        this.locations = locations;
        this.types = types;
    }    
} 
class TrendData {
    constructor(label, value) {
        this.label = label;
        this.value = value;
    }
}
/**
  * Returns an object complying with this portion of the server's GraphQL spec
    type Trends {
        locations: [TrendData]
        types: [TrendData]
    }
    type TrendData {
        label: String
        value: Int
    }
  */
const getCachedTrends = () => {
    //console.log(`Return location_trends`, cache.get("location_trends"))
    //console.log(`Return type_trends`, cache.get("type_trends"))
    return new Trends(cache.get("location_trends"), cache.get("type_trends"));    
}
const refreshCache = () => {
    console.log("Entering refreshCache");
    const client = new GraphQLClient(nerdGraphEndpoint, { headers: { 'Api-Key': apiKey } })
    client.request(query)
        .then(data => {
            let bagelTypes = [];
            data.actor.account.bagelTypes.results.forEach(el => {
                bagelTypes.push(new TrendData(el.type, Number.parseInt(el["sum.quantity"])));
            })
            //bagelTypes.sort();
            cache.put("type_trends", bagelTypes);
            //console.log(`Set type_trends`, bagelTypes);
            let bagelLocations = [];
            data.actor.account.bagelLocations.results.forEach(el => {
                bagelLocations.push(new TrendData(el.location, Number.parseInt(el["sum.quantity"])));
            })
            //bagelLocations.sort();
            cache.put("location_trends", bagelLocations);
            //console.dir([cache.get("type_trends"), cache.get("location_trends")]);
        })
        .catch(e => { console.log(`Catching the following error ${e.message}`, e)});
    //redo it in 30 seconds
    setTimeout(() => {refreshCache()}, 30000);    
}
const instrumentOrderItems = (order) => {
    order.items.forEach(item => {
        try {
            //flatten the bagel order item into one level
            let flattenedOrder = {
                orderId: order.id, 
                location: order.location,
                request_date: order.request_date.getTime(),
                source: order.source                                    
            }
            if (order.customer.anonymous_id) {
                flattenedOrder.customer_anonymous_id = order.customer.anonymous_id;
            }
            if (order.customer.external_id) {
                flattenedOrder.customer_external_id = order.customer.external_id;
            }
            const bagelOrderItem = Object.assign(flattenedOrder, item);
            //record it in new relic for real-time analysis
            newrelic.recordCustomEvent("BagelOrderItem", bagelOrderItem)
        } catch (err) {
            console.error(`Failed to record item in bagel order ${order.id} for ${order.location} in New Relic.`, item);
        }
    });
}
const _init = () => {
    //console.log("Environment", process.env);
    console.log("initiating cache");
    if (nerdGraphEndpoint && apiKey && account_id) {
        refreshCache();    
    } else {
        console.log("Unable to initiate New Relic trending data cache refresh due to missing variables from .env file.");
    }
}

_init();

module.exports = { instrumentOrderItems, getCachedTrends, Trends };