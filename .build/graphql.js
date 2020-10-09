"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_lambda_1 = require("apollo-server-lambda");
var neo4j_driver_1 = require("neo4j-driver");
// eslint-disable-next-line
var neo4jGraphqlJs = require('neo4j-graphql-js');
var makeAugmentedSchema = neo4jGraphqlJs.makeAugmentedSchema;
// Provide resolver functions for your schema fields
var typeDefs = "\ntype Person {\n  name: String\n}\n";
var schema = makeAugmentedSchema({ typeDefs: typeDefs });
var driver = neo4j_driver_1.default.driver('bolt://18.208.119.122:32864', neo4j_driver_1.default.auth.basic('neo4j', 'floor-custody-directions'));
var server = new apollo_server_lambda_1.ApolloServer({
    schema: schema,
    introspection: true,
    playground: {
        endpoint: '/dev/graphql',
    },
    context: { driver: driver },
});
exports.graphqlHandler = server.createHandler();
//# sourceMappingURL=graphql.js.map