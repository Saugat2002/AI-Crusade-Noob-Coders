import { connect } from "mongoose";

const connectToMongoDb = async (url : string) => {
    // Connection
    return connect(url);
};

export default connectToMongoDb;