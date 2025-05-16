import { ApolloServer, gql } from "apollo-server";

let Tweets = [
    {
        id: "1",
        text: "first tweet!",
        userId: "2"

    },
    {
        id: "2",
        text: "second tweet!",
        userId: "1"
    }
]

const Users = [
    {
        id: "1",
        username: "@elonmusk",
        firstName: "Elon",
        lastName: "Musk"
    },
    {
        id: "2",
        username: "@nasa",
        firstName: "NASA",
        lastName: "NASA"
    }
]
//GraphQL Schema

const typeDefs = gql`

type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
}
type Tweet {
    id: ID!
    text: String!
    author: User!
}
type Query {
    allTweets: [Tweet!]!
    tweet(id:ID!): Tweet
    ping: String

}
type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
}


`;

// GET /api/v1/tweets
// GET /api/v1/tweets/:id
// POST /api/v1/tweets //Mutation
// DELETE /api/v1/tweets/:id
// PUT /api/v1/tweets/:id

const resolvers = {
    Query: {
        tweet(root, {id}) {
            console.log(id);
            return Tweets.find(tweet => tweet.id === id);
        },
        ping() {
            return "pong";
        },
        allTweets() {
            return Tweets;
        },
        
    },
    Mutation: {
        postTweet(_, {text, userId}) {
            const newTweet = {
                id: Tweets.length + 1,
                text,
            };
            Tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(root, {id}) {
            const tweet = Tweets.find(tweet => tweet.id === id);
            if(!tweet) return false;
            Tweets.splice(Tweets.indexOf(tweet), 1);
            return true;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
});

