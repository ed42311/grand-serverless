import { ApolloServer } from 'apollo-server-lambda'
import neo4j from 'neo4j-driver'

// eslint-disable-next-line
const neo4jGraphqlJs = require('neo4j-graphql-js')
const { makeAugmentedSchema } = neo4jGraphqlJs

// Provide resolver functions for your schema fields
const typeDefs = `
type Person {
  name: String
}
`

const schema = makeAugmentedSchema({ typeDefs })
const driver = neo4j.driver(
  'bolt://18.208.119.122:32864',
  neo4j.auth.basic('neo4j', 'floor-custody-directions')
)

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: {
    endpoint: '/dev/graphql',
  },
  context: { driver },
})

exports.graphqlHandler = server.createHandler()
