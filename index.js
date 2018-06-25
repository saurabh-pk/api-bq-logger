(function () {
    "use strict";
    const BigQuery = require('@google-cloud/bigquery');
    const path = require('path');
    var BQkeyFilename = "";
    var BQdatasetName = "";
    var BQtable = "";
    var SHOWLOG = false;
    var bigquery;
    function isNull(val) {
        return (val ? !(val != null && val != "") : true);
    }

    function getBigquery() {
        bigquery = new BigQuery({
            keyFilename: BQkeyFilename
        });
    }

    function insertInBigquery(json) {
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

    function req_id(ip_from) {
        var ts = new Date().getTime();
        return ip_from.split('.').map(v => {
            return v * ts;
        }).join('');
    }

    function remoteActions(app) {
        app.remotes().before('**', (ctx, next) => {
            ctx.req['request_id'] = req_id(ctx.req.ip);
            ctx.req['request_time'] = process.hrtime();
            var json = {
                request_id: ctx.req.request_id,
                requested_api_url: ctx.req.baseUrl,
                requesting_hostname: ctx.req.hostname,
                requesting_ip: ctx.req.ip,
                request_method: ctx.req.method,
                request_url: ctx.req.originalUrl,
                request_from_user_agent: ctx.req.headers['user-agent'],
                request_referer: ctx.req.headers.referer,
                request_params: JSON.stringify(ctx.req.params),
                request_query: JSON.stringify(ctx.req.query),
                request_body: JSON.stringify(ctx.req.body),
                request_accessToken: ctx.req.accessToken,
                request_args: JSON.stringify(ctx.args),
                request_headers: JSON.stringify(ctx.req.headers),
                processing_time: 0,
                action_type: "request",
                action_details: ""
            };
            insertInBigquery(json);
            next();
        });
        app.remotes().after('**', (ctx, next) => {
            var diff = process.hrtime(ctx.req.request_time);
            var ms = diff[0] * 1e3 + diff[1] * 1e-6;
            var json = {
                request_id: ctx.req.request_id,
                requested_api_url: ctx.req.baseUrl,
                requesting_hostname: ctx.req.hostname,
                requesting_ip: ctx.req.ip,
                request_method: ctx.req.method,
                request_url: ctx.req.originalUrl,
                request_from_user_agent: ctx.req.headers['user-agent'],
                request_referer: ctx.req.headers.referer,
                request_params: JSON.stringify(ctx.req.params),
                request_query: JSON.stringify(ctx.req.query),
                request_body: JSON.stringify(ctx.req.body),
                request_accessToken: ctx.req.accessToken,
                request_args: JSON.stringify(ctx.args),
                request_headers: JSON.stringify(ctx.req.headers),
                processing_time: ms,
                action_type: "response",
                action_details: ""
            };
            if (ctx.result == null) {
                json.action_info = 'RESULT_IS_NULL';
            }
            insertInBigquery(json);
            next();
        });
        app.remotes().afterError('**', (ctx, next) => {
            var diff = process.hrtime(ctx.req.request_time);
            var ms = diff[0] * 1e3 + diff[1] * 1e-6;
            var json = {
                request_id: ctx.req.request_id,
                requested_api_url: ctx.req.baseUrl,
                requesting_hostname: ctx.req.hostname,
                requesting_ip: ctx.req.ip,
                request_method: ctx.req.method,
                request_url: ctx.req.originalUrl,
                request_from_user_agent: ctx.req.headers['user-agent'],
                request_referer: ctx.req.headers.referer,
                request_params: JSON.stringify(ctx.req.params),
                request_query: JSON.stringify(ctx.req.query),
                request_body: JSON.stringify(ctx.req.body),
                request_accessToken: ctx.req.accessToken,
                request_args: JSON.stringify(ctx.args),
                request_headers: JSON.stringify(ctx.req.headers),
                processing_time: ms,
                action_type: "error",
                action_info: ctx.error
            };
            insertInBigquery(json);
            next();
        });
    }

    function loggeride(app, keyFilename, datasetName, tableName, showlogs) {
        SHOWLOG = (showlogs == null || showlogs == "") ? false : true;
        var fs = require('fs');
        fs.access(path.resolve(keyFilename), fs.constants.R_OK, (err) => {
            if (!err) {
                BQkeyFilename = keyFilename;
                getBigquery();
                if (!isNull(datasetName) && !isNull(tableName)) {
                    bigquery.dataset(datasetName).exists(function (dserr, dsexists) {
                        if (!dserr) {
                            if (dsexists) {
                                BQdatasetName = datasetName;
                                bigquery.dataset(BQdatasetName).table(tableName).exists(function (tblerr, tblexists) {
                                    if (!tblerr) {
                                        if (tblexists) {
                                            BQtable = tableName;
                                            remoteActions(app);
                                        } else {
                                            console.error("Tabale not found in given dataset :", tableName);
                                            process.exit();
                                        }
                                    } else {
                                        console.error("Bigquery error in table check :", JSON.stringify(tblerr));
                                        process.exit();
                                    }
                                });
                            } else {
                                console.error("Dataset not found :", datasetName);
                                process.exit();
                            }
                        } else {
                            console.error("Bigquery error in dataset check :", JSON.stringify(dserr));
                            process.exit();
                        }
                    });
                } else {
                    console.error("Invalid Dataset name or Table name.");
                    process.exit();
                }
            } else {
                console.error("Key file is not accessible :", path.resolve(keyFilename));
                process.exit();
            }
        });
    }
    module.exports.factory = loggeride;
}());