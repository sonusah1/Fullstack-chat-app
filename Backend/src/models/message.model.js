import mongoose from 'mongoose';

const messageSchenma = new mongoose.Schema(
    {
        receiverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        text:{
            type:String,
        },
        image:{
            type:String,
        }
    },
    {timestamps:true}
)

const Message = mongoose.model("Message",messageSchenma);

export default Message;