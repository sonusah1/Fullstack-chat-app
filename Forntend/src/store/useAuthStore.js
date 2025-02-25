import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL =import.meta.env.MODE === "development"? "http://localhost:5001":"/" ;

export const useAuthStore = create((set, get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUser : [],
    socket:null,

    checkAuth:async() => {
        try {
            const res =await axiosInstance.get('/auth/check');

            set({authUser:res.data});
            get().connectSocket();
        } catch (error) {
            console.log("error occure at checkAuth is :",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup : async(data) => {
        set({isSigningUp : true});
        try {
            const res=await axiosInstance.post('/auth/signup', data);
            set({authUser:res.data})
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("message occure during signup is :",error);
        }finally{
            set({isSigningUp : false});
        }
    },

    logout:async()=> {
        try {
            await axiosInstance.post('/auth/logout');
            set({authUser:null});
            toast.success("Logout successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    login:async(data) =>{
        set({isLoggingIng : true});
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({authUser:res.data});
            toast.success("Login successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIng : false});
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: res.data }); // Update authUser with the response
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connented)return;

        const socket = io(BASE_URL , {
            query: {
                userId: authUser._id,
            }
        });
        socket.connect();
        set({socket:socket});

        socket.on("OnlineUsers",(userIds) =>{
            set({onlineUser :userIds});
        })
    },
    disconnectSocket: ()=>{
        if(get().socket?.connented) get().socket.disconnect();
    },
}));