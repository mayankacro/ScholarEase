import mongoose from "mongoose";
import mangoose, { mongo } from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL as string);

        console.log("MongoDB Connectes Succesfully");
    } catch (error){
        console.error("MnogoDB Connnection Failed", error);

        process.exit(1);
    }
};

export default connectDB;