import { ApolloServer, gql } from "apollo-server";

//GraphQL Schema

const typeDefs = gql`
type Query {
    hello: String
    rollDice(numDice: Int!, numSides: Int): [Int]
}


`


const server = new ApolloServer({ typeDefs })

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})

