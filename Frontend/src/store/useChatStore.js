import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

import {useAuthStore} from './useAuthStore.js'

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
      set({ isMessagesLoading: true });
    
      try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data });
      } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to load messages");
      } finally {
        set({ isMessagesLoading: false });
      }
    },
    
  
    sendMessage: async (messageData) => {
      const { selectedUser, messages } = get();
      if (!selectedUser) {
        toast.error("No user selected");
        return;
      }
  
      try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set((state) => ({ messages: [...state.messages, res.data] }));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to send message");
      }
    },
    
    subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;
  
      const socket = useAuthStore.getState().socket;
  
      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;
  
        set({
          messages: [...get().messages, newMessage],
        });
      });
    },
  
    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))