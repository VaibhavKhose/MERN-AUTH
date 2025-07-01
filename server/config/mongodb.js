import mongoose from "mongoose"

const connectDB = async() =>{

    //  mongoose.connection.on("connected", console.log("Database Connected "));
     mongoose.connection.on("connected", () => {
      console.log("Database Connected Sucessfully");
    });


await mongoose.connect(`${process.env.MongoDB_URI}/mern-auth`)


}
export default connectDB;