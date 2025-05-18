import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let Tweets = [
  {
    id: "1",
    text: "first tweet!",
    userId: "2",
  },
  {
    id: "2",
    text: "second tweet!",
    userId: "1",
  },
];

const Users = [
  {
    id: "1",
    username: "@elonmusk",
    firstName: "Elon",
    lastName: "Musk",
  },
  {
    id: "2",
    username: "@nasa",
    firstName: "NASA",
    lastName: "NASA",
  },
];
//GraphQL Schema

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
  }

  """
  #The Tweet type represents a resource for a Tweet.
  """
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type Query {
    allMovies: [Movie!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String
    movie(id: String!): Movie
  }
  type Mutation {
    """
    #Posts a tweet for a given user
    """
    postTweet(text: String!, userId: ID!): Tweet!
    """
    #Deletes a tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

// GET /api/v1/tweets
// GET /api/v1/tweets/:id
// POST /api/v1/tweets //Mutation
// DELETE /api/v1/tweets/:id
// PUT /api/v1/tweets/:id

const resolvers = {
  Query: {
    tweet(root, { id }) {
      return Tweets.find((tweet) => tweet.id === id);
    },
    ping() {
      return "pong";
    },
    allTweets() {
      return Tweets;
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
  },

  Tweet: {
    author({ userId }) {
      return Users.find((user) => user.id === userId);
    },
  },

  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: String(Tweets.length + 1),
        text,
        userId,
      };
      Tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(root, { id }) {
      const tweet = Tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      Tweets.splice(Tweets.indexOf(tweet), 1);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
