'use strict';
const morgan = require('morgan');

module.exports = function jsonLog() {
    morgan(jsonFormat).pipe
    return 
};

// module.exports = function jsonLog() {
//     return morgan(jsonFormat);
// };

//module.exports = jsonFormat

function jsonFormat(tokens, req, res) {
    return JSON.stringify({
        'remote-address': tokens['remote-addr'](req, res),
        'remote-user': tokens['remote-user'](req, res),
        'time': tokens['date'](req, res, 'iso'),
        'method': tokens['method'](req, res),
        'url': tokens['url'](req, res),
        'http-version': tokens['http-version'](req, res),
        'status-code': tokens['status'](req, res),
        'content-length': tokens['res'](req, res, 'content-length'),
        'referer': tokens['referer'](req, res),
        'user-agent': tokens['user-agent'](req, res)
    });
}