// frontend/src/pages/Chat.jsx
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../services/api";

function Chat() {
    const token = localStorage.getItem("token");
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [content, setContent] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        // Fetch all chats
        const fetchChats = async () => {
            try {
                const { data } = await api.get("/chat");
                setChats(data);

                // Auto-select chat from URL query
                const urlParams = new URLSearchParams(window.location.search);
                const chatId = urlParams.get('chatId');
                if (chatId) {
                    const chat = data.find(c => c._id === chatId);
                    if (chat) {
                        loadMessages(chat);
                    }
                }
            } catch (err) {
                console.error("Failed to load chats", err);
            }
        };
        fetchChats();

        // Connect socket
        socketRef.current = io("http://localhost:5000", {
            auth: { token },
        });

        socketRef.current.on("connect", () => console.log("✅ Socket connected"));
        socketRef.current.on("message received", (msg) =>
            setMessages((prev) => [...prev, msg])
        );

        return () => {
            socketRef.current?.disconnect();
        };
    }, [token]);

    // Load full conversation when a chat is selected
    const loadMessages = async (chat) => {
        try {
            const { data } = await api.get(`/chat/${chat._id}/messages`);
            setSelectedChat(chat);
            setMessages(data);

            // ✅ Join the chat room for real-time updates
            socketRef.current.emit("join chat", chat._id);
        } catch (err) {
            console.error("Failed to load messages", err);
        }
    };

    const sendMessage = async () => {
        if (!content.trim() || !selectedChat) return;
        try {
            const { data } = await api.post("/chat/message", {
                chatId: selectedChat._id,
                content,
            });
            socketRef.current.emit("new message", data);
            setMessages((prev) => [...prev, data]);
            setContent("");
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-4 h-[80vh]">
                    {/* Chat list */}
                    <div className="bg-gray-50 border-r border-gray-200 p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                            💬 Chats
                        </h2>
                        <ul className="space-y-3">
                            {chats.map((chat) => (
                                <li
                                    key={chat._id}
                                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                        selectedChat?._id === chat._id
                                            ? "bg-blue-500 text-white shadow-md"
                                            : "hover:bg-gray-200 text-gray-700"
                                    }`}
                                    onClick={() => loadMessages(chat)}
                                >
                                    <div className="font-medium">
                                        {chat.participants.map((p) => p.name).join(", ")}
                                    </div>
                                    {chat.lastMessage && (
                                        <div className={`text-sm mt-1 ${
                                            selectedChat?._id === chat._id ? "text-blue-100" : "text-gray-500"
                                        }`}>
                                            {chat.lastMessage.content.length > 20
                                                ? chat.lastMessage.content.substring(0, 20) + "..."
                                                : chat.lastMessage.content}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Messages */}
                    <div className="col-span-1 lg:col-span-3 flex flex-col">
                        <div className="bg-white p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">
                                {selectedChat ? `💬 Chat with ${selectedChat.participants.map((p) => p.name).join(", ")}` : "Select a chat to start messaging"}
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-20">
                                    <div className="text-6xl mb-4">💭</div>
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((m, i) => (
                                        <div key={i} className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {m.sender?.name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                            <div className="flex-1">
                                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                                    <div className="font-medium text-gray-800">{m.sender?.name || "You"}</div>
                                                    <div className="text-gray-700 mt-1">{m.content}</div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {new Date(m.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {selectedChat && (
                            <div className="p-6 bg-white border-t border-gray-200">
                                <div className="flex gap-3">
                                    <input
                                        className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="Type your message..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md"
                                    >
                                        📤 Send
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;