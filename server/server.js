const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const { makeExecutablesSchema } = require("graphql-tools");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
require("dotenv").config();
const { authCheck, authCheckMiddleware } = require("./helpers/auth");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const port = process.env.PORT || 8000;
const app = express();

// db

const db = async () => {
  try {
    const success = await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("DB Connected");
  } catch (error) {
    console.log("DB connection error", error);
  }
};

// execute database connection
db();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// usage
const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, "./schema")));
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);

const pubsub = new PubSub();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

app.get("/rest", authCheck, (req, res) => {
  res.json({
    data: "you hit rest endpoint great!",
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post("/uploadimages", authCheckMiddleware, (req, res) => {
  cloudinary.uploader.upload(
    req.body.image,
    {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    },
    (error, result) => {
      if (!error) {
        console.log(result);
        res.send({
          url: result.url,
          public_id: result.public_id,
        });
      } else {
        console.log("Tracked error: ", error);
      }
    }
  );
});

app.post("/removeimage", authCheckMiddleware, (req, res) => {
  let image_id = req.body.public_id;

  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error) return res.json({ success: false, error });

    res.send("ok");
  });
});

apolloServer.applyMiddleware({ app });

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(port, () => {
  console.log(`server is ready at http://localhost ${port}`);
  console.log(
    `server is ready at http://localhost ${port} on ${apolloServer.graphqlPath}`
  );
  console.log(
    `subscription is ready at http://localhost ${port} on ${apolloServer.subscriptionsPath}`
  );
});
