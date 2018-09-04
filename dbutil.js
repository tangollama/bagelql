var r = require('rethinkdb');
const _dbConfig = {
    host: 'localhost', port: 28015, db: 'test'
};
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
                        resolve(result);
                    }
                }).finally(() => {
                    conn.close();
                });
        })
    });
}
const queryOrders = function() {
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
const upsertOrder = function(order) {
    return new Promise((resolve, reject) => {
        r.connect( _dbConfig, function(err, conn) {
            if (err) reject(err);
            r.table('orders')
                .insert(order)
                .run(conn, function(err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }).finally(() => {
                    conn.close(function(err) { if (err) throw err; });
            });    
        });    
    });
}
const initDb = function() {    
    r.connect( _dbConfig, function(err, conn) {
        if (err) {
            console.error(err);
            return;
        }
        r.db('test')
            .tableCreate('orders')
            .run(conn, function(err, result) {
            if (err) {
                if (err.message.indexOf('already exists') > -1) {
                    console.log(err.message);
                } else {
                    throw err;
                }                
            } else {
                console.log(JSON.stringify(result, null, 2));
            }            
        }).finally(() => {
            conn.close(function(err) { if (err) throw err; });
        });    
    });
}
module.exports = { loadOrder, queryOrders, upsertOrder, initDb };