require("dotenv").config();

import http from "http";
import { app } from "./app";
import connectToMongoDb from "./utils/connectToMongoDb";

connectToMongoDb(process.env.DATABASE_URL!)
    .then(() => console.log("Mongo Db Connected"))
    .catch((err) => console.log("Mongo Db Error", err));

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
