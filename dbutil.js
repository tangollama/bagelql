var r = require('rethinkdb');
var { instrumentOrderItems } = require('./instrumentation');

const _dbConfig = {
    host: 'db', port: 28015, db: 'test'
};
class Order {
    constructor(id, {request_date, location, items, customer, source}) {
        this.id = id;
        this.request_date = request_date;
        this.location = location;
        this.source = source;
        this.customer = customer; //object
        this.items = items; //array of objects
    }
}
const loadOrder = (id) => {
    return new Promise((resolve, reject) => {
        r.connect(_dbConfig, (err, conn) => {
            if (err) reject(err);
            r.table('orders')
                .get(id)
                .run(conn, (err2, result) => {
                    if (err2) {
                        reject(err2);
                    } else {
                        //console.log("load Order results ", result)
                        const order = new Order(id, result);
                        resolve(order);
                    }
                }).finally(() => {
                    conn.close();
                });
        })
    });
}
const queryOrders = (location) => {
    return new Promise((resolve, reject) => {
        r.connect( _dbConfig, function(err, conn) {
            if (err) reject(err);
            r.table('orders')
                .run(conn, function(err, cursor) {
                    if (err) reject(err);
                    cursor.toArray(function(err, results) {
                        if (err) {
                            reject(err);
                        } else {
                            //console.log("queryResults", results)
                            resolve(results);    
                        }
                    });
                }).finally(() => {
                    conn.close(function(err) { if (err) throw err; });
            });
        });    
    });
}
const upsertOrder = (input) => {
    return new Promise((resolve, reject) => {
        r.connect( _dbConfig, function(err, conn) {
            if (err) reject(err);
            r.table('orders')
                .insert(input)
                .run(conn, function(err, result) {
                    //console.dir(result);
                    if (err) {
                        reject(err);
                    } else {
                        const order = new Order(input.id, input);
                        instrumentOrderItems(order);
                        resolve(order);
                    }
                }).finally(() => {
                    conn.close(function(err) { if (err) throw err; });
            });    
        });    
    });
}
const initDb = function() {
    return new Promise((resolve, reject) => {
        r.connect( _dbConfig, function(err, conn) {
            if (err) {
                console.error(err);
                reject(err);
            }
            r.db('test')
                .tableCreate('orders')
                .run(conn, function(err, result) {
                    if (err) {
                        if (err.message.indexOf('already exists') == -1) {
                            console.log(`Error Message: ${err.message}`, err);
                            resolve(result);
                        } else {
                            reject(err);
                        }                
                    } else {
                        resolve(result);
                    }            
            }).finally(() => {
                conn.close(function(err) { if (err) throw err; });
            });    
        });
    });
}
module.exports = { loadOrder, queryOrders, upsertOrder, initDb, Order };