var newrelic = require('newrelic');
var csNodeCache = require('cache-service-node-cache');
var rp = require('request-promise');
 
var nodeCache = new csNodeCache({defaultExpiration: 60});

_init();

const _init = () => {
    if (!nodeCache.get("location_trends")) {
        console.log("initiating cache for location_trends");

    } 
    if (!nodeCache.get("type_trends")) {
        console.log("initiating cache for type_trends");
    }
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
/**
 * Returns an object complying with the GraphQL spec
 * type Trends {
        locations: [TrendData]
        types: [TrendData]
    }
    type TrendData {
        label: String
        value: Int
    }
 */
const retrieveTrends = () => {
    return {
        locations: nodeCache.get("location_trends"),
        types: nodeCache.get("type_trends")
    }
}
module.exports = { instrumentOrderItems, retrieveTrends };