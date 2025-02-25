
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async(req,res) => {
    try {
        const loggedInUserd = req.user._id;
        const filteredUsers = await User.find({_id : {$ne:loggedInUserd}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessage = async(req , res ) => {
    try {
        const {id:userToChatId} = req.params;
        const myId= req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        });
        res.status(200).json(messages); // Send the fetched messages back to the client
    } catch (error) {
        console.error("Error in getMessage controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendMessage = async(req , res ) => {
    try {
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId ,
            receiverId ,
            text ,
            image: imageUrl,
        })

        await newMessage.save();

        //todo : send notification to receiver
        const recevierSocketId = getReceiverSocketId(receiverId);

        if(recevierSocketId){
            io.to(recevierSocketId).emit('newMessage', newMessage);
        }

        res.status(200).json(newMessage)

    } catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
