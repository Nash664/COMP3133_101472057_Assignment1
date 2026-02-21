require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { connectDb } = require("./config/db");
const { initCloudinary } = require("./config/cloudinary");
const { typeDefs } = require("./schema/typeDefs");
const { resolvers } = require("./schema/resolvers");

const startServer = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));

  await connectDb();
  initCloudinary();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  });

  await apolloServer.start();

  app.use("/graphql", expressMiddleware(apolloServer));

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
