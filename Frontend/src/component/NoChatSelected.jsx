import React from "react";
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full  flex flex-col items-center justify-center p-8 bg-base-100 overflow-hidden">
      <div className="max-w-md text-center space-y-6">
        {/** Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse"
              aria-label="Chat icon"
            >
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/** Welcome Text */}
        <h2 className="text-2xl font-bold text-base-content">Welcome to Chatty!</h2>
        <p className="text-base-content/70">
          Select a conversation from the sidebar to start chatting.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
