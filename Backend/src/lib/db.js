import mongoose from 'mongoose';

export const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGOODB_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error){
        console.log("mongoose connection error ", error);
    }
};