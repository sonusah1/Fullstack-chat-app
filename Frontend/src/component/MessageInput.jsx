import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send } from "lucide-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [username, setUsername] = useState(""); // User's name (Roshan or Sonu)
  const { sendMessage, messages } = useChatStore(); // Fetch chat messages

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    const today = new Date().toLocaleDateString();

    if (lastMessage && lastMessage.sender !== username) {
      if (lastMessage.text.toLowerCase() === "hello") {
        sendAutoReply(`Hello,I am A chatBot . How Can I help you!`, lastMessage.sender);
      } else if (lastMessage.text.toLowerCase() === "date") {
        sendAutoReply(`Today's date is ${today}.`, lastMessage.sender);
      } else if (lastMessage.text.toLowerCase() === "location") {
        requestLocation((locationText) => {
          sendAutoReply(locationText, lastMessage.sender);
        });
      }
    }
  }, [messages, sendMessage, username]);

  const sendAutoReply = (message, receiver) => {
    setTimeout(() => {
      sendMessage({
        text: message,
        sender: username,
        receiver: receiver,
      });
    }, 500);
  };

  const requestLocation = (callback) => {
    if (!navigator.geolocation) {
      return callback("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        callback(`📍 My location: [Lat: ${latitude}, Lng: ${longitude}]`);
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          callback("❌ Location access denied. Enable GPS & try again.");
        } else if (error.code === error.TIMEOUT) {
          callback("⏳ Location request timed out. Please retry.");
        } else {
          callback("⚠️ Unable to fetch location. Try again later.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await sendMessage({
        text: text.trim(),
        sender: username,
        receiver: "Unknown",
      });

      setText(""); // Clear input
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
