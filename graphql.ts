import { ApolloServer } from 'apollo-server-lambda'
import neo4j from 'neo4j-driver'

// eslint-disable-next-line
const neo4jGraphqlJs = require('neo4j-graphql-js')
const { makeAugmentedSchema } = neo4jGraphqlJs

const typeDefs = `
  type Step {
    latitude: Float
    longitude: Float
  }

  type Tag {
    key: String
    value: String
  }

  type PointOfInterest {
    name: String
    location: Point
    type: String
    node_osm_id: ID!

    wikipedia: String @cypher(statement: """
      MATCH (this)-->(t:OSMTags)
      WHERE EXISTS(t.wikipedia) WITH t LIMIT 1
      CALL apoc.load.json('https://en.wikipedia.org/w/api.php?action=parse&prop=text&formatversion=2&format=json&page=' + apoc.text.urlencode(t.wikipedia)) YIELD value
      RETURN value.parse.text
    """)

    tags: [Tag] @cypher(statement: """
      MATCH (this)-->(t:OSMTags)
      UNWIND keys(t) AS key
      RETURN {key: key, value: t[key]} AS tag
    """)

    routeToPOI(poi: ID!): [Step] @cypher(statement: """
      MATCH (other:PointOfInterest {node_osm_id: $poi})
      CALL gds.alpha.shortestPath.stream({
        nodeProjection: 'OSMNode',
          relationshipProjection: {
            ROUTE: {
                type: 'ROUTE',
                  properties: 'distance',
                  orientation: 'UNDIRECTED'
              }
          },
          startNode: this,
          endNode: other,
          relationshipWeightProperty: 'distance'
      })
      YIELD nodeId, cost
      WITH gds.util.asNode(nodeId) AS node
      RETURN {latitude: node.location.latitude, longitude: node.location.longitude} AS route
    """)
  }
`

const schema = makeAugmentedSchema({ typeDefs })
const driver = neo4j.driver(
  'bolt://52.201.184.95:33525',
  neo4j.auth.basic('neo4j', 'dwell-profit-subject')
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
