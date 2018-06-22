(function () {
    "use strict";
    const BigQuery = require('@google-cloud/bigquery');
    const path = require('path');
    var BQkeyFilename = "";
    var BQdatasetName = "";
    var BQtable = "";
    var SHOWLOG = false;
    function isNull(val) {
        return (val ? !(val != null && val != "") : true);
    }

    function insertInBigquery(json) {
        const bigquery = new BigQuery({
            keyFilename: BQkeyFilename
        });
        bigquery.dataset(BQdatasetName)
                .table(BQtable)
                .insert([json])
                .then(data => {
                    if (SHOWLOG) {
                        console.log("Insert completed " + JSON.stringify(data));
                    }
                })
                .catch(err => {
                    if (SHOWLOG) {
                        console.log("Error occured in insertion " + JSON.stringify(err));
                    }
                });
    }

    function req_id(ip_from){
        var ts = new Date().getTime();
         return ip_from.split('.').map( v =>{return v*ts;}).join('');
    }

    function remoteActions(app) {
        app.remotes().before('**', (ctx, next) => {
            ctx.req['request_id'] = req_id(ctx.req.ip);
            var json = {
                api_url: ctx.req.baseUrl,
                hostname: ctx.req.hostname,
                ip_from: ctx.req.ip,
                request_method: ctx.req.method,
                request_url: ctx.req.originalUrl,
                request_id: ctx.req.request_id,
                user_agent:ctx.req.headers['user-agent'],
                referer:ctx.req.headers.referer,
                params:JSON.stringify(ctx.req.params),
                query:JSON.stringify(ctx.req.query),
                body:JSON.stringify(ctx.req.body),
                accessToken:ctx.req.accessToken,
                args:JSON.stringify(ctx.args),
                action_type: "request",
                action_info: ""
            };
            insertInBigquery(json);
            next();
        });
        app.remotes().after('**', (ctx, next) => {
            var json = {
                api_url: ctx.req.baseUrl,
                hostname: ctx.req.hostname,
                ip_from: ctx.req.ip,
                request_method: ctx.req.method,
                request_url: ctx.req.originalUrl,
                request_id: ctx.req.request_id,
                user_agent:ctx.req.headers['user-agent'],
                referer:ctx.req.headers.referer,
                params:JSON.stringify(ctx.req.params),
                query:JSON.stringify(ctx.req.query),
                body:JSON.stringify(ctx.req.body),
                accessToken:ctx.req.accessToken,
                args:JSON.stringify(ctx.args),
                action_type: "response",
                action_info: ""
            };
            insertInBigquery(json);
            next();
        });
        app.remotes().afterError('**', (ctx, next) => {
            var json = {
                api_url: ctx.req.baseUrl,
                hostname: ctx.req.hostname,
                ip_from: ctx.req.ip,
                request_method: ctx.req.method,
                request_url: ctx.req.originalUrl,
                request_id: ctx.req.request_id,
                user_agent:ctx.req.headers['user-agent'],
                referer:ctx.req.headers.referer,
                params:JSON.stringify(ctx.req.params),
                query:JSON.stringify(ctx.req.query),
                body:JSON.stringify(ctx.req.body),
                accessToken:ctx.req.accessToken,
                args:JSON.stringify(ctx.args),
                action_type: "error",
                action_info: ctx.error
            };
            insertInBigquery(json);
            next();
        });
    }

    function loggeride(app, keyFilename, datasetName, table, showlogs) {
        SHOWLOG = (showlogs == null || showlogs == "")?false:true;
        var fs = require('fs');
        fs.access(path.resolve(keyFilename), fs.constants.R_OK, (err) => {
            if (!err) {
                if (!isNull(datasetName) && !isNull(table)) {
                    BQkeyFilename = keyFilename;
                    BQdatasetName = datasetName
                    BQtable = table;
                    remoteActions(app);
                } else {
                    console.log("You miss something.");
                }
            } else {
                console.log("Key file is not accessible.", path.resolve(keyFilename));
            }
        });
    }
    module.exports.factory = loggeride;
}());