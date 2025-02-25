import ChatContainer from "../component/ChatContainer";
import NoChatSelected from "../component/NoChatSelected";
import Sidebar from "../component/Sidebar";
import { useChatStore } from "../store/useChatStore.js";
import { useThemeStore } from "../store/useThemeStore.js"; // Import the theme store

function HomePage() {
  const { selectedUser } = useChatStore(); // Correct function call
  const { theme } = useThemeStore(); // Get the selected theme

  return (
    <div className="h-screen bg-base-200" data-theme={theme}> {/* Apply theme here */}
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-6rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
