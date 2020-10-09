"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
exports.hello = function (event, context, cb) {
    var response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
            input: event,
        }),
    };
    cb(null, response);
};
//# sourceMappingURL=handler.js.map