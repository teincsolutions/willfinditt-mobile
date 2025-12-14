import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let errorCallback: ((error: WebSocketError | null) => void) | null = null;

interface WebSocketError {
  message: string;
  description?: string;
  context?: any;
  type?: string;
  reason?: string;
}

export const chatGatewaySerivce = {
  connect: (token: string) => {
    if (socket?.connected) return;
    if (socket) socket.disconnect();

    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000";
    socket = io(`${baseUrl}/chat`, {
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to chat gateway");
    });

    socket.on("disconnect", (reason: any) => {
      console.log("Disconnected from chat gateway:", reason);
    });

    socket.on("connect_error", (error: any) => {
      console.error("Chat gateway connection error:", {
        message: error?.message || "Unknown connection error",
        description: error?.description || "No description available",
        context: error?.context || "No context",
        type: error?.type || "Unknown type",
      });
      errorCallback?.({
        message: error?.message || "Connection failed",
        description: error?.description,
        context: error?.context,
        type: error?.type,
      });
    });

    socket.on("error", (error: any) => {
      console.error("Chat gateway server error:", error);
      errorCallback?.({
        message: error?.message || "Server error occurred",
        description: error?.description || error,
      });
    });

    socket.on("connect", () => {
      console.log("Connected to chat gateway");
      // Clear any previous errors on successful connection
      errorCallback?.(null);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("Disconnected from chat gateway:", reason);
      if (reason === "io server disconnect") {
        console.error("Disconnected by server - possibly authentication issue");
        errorCallback?.({
          message: "Disconnected by server - authentication may have failed",
          reason,
        });
      }
    });

    return socket;
  },

  disconnect: () => {
    socket?.disconnect();
    socket = null;
  },

  joinChat: (chatId: string) => {
    socket?.emit("join_chat", { chatId });
  },

  leaveChat: (chatId: string) => {
    socket?.emit("leave_chat", { chatId });
  },

  emitTypingStart: (chatId: string) => {
    socket?.emit("typing_start", { chatId });
  },

  emitTypingStop: (chatId: string) => {
    socket?.emit("typing_stop", { chatId });
  },

  emit: (event: string, data: any) => {
    // Support optional ACK: return a promise that resolves with the server ack (if any)
    if (!socket) return Promise.reject(new Error("Socket not connected"));

    return new Promise((resolve) => {
      let handled = false;
      try {
        socket?.emit(event, data, (ack: any) => {
          handled = true;
          resolve(ack);
        });
      } catch (e) {
        // emit without ack support
      }

      // Fallback: resolve after timeout if no ack provided
      setTimeout(() => {
        if (!handled) resolve(null);
      }, 2000);
    });
  },

  on: (
    event:
      | "send_message"
      | "new_message"
      | "mark_as_read"
      | "typing_start"
      | "typing_stop"
      | "message_delivered"
      | "message_read"
      | "user_online"
      | "user_offline",
    handler: (...args: any[]) => void
  ) => {
    socket?.on(event, handler);
  },

  off: (
    event:
      | "send_message"
      | "new_message"
      | "mark_as_read"
      | "typing_start"
      | "typing_stop"
      | "message_delivered"
      | "message_read"
      | "user_online"
      | "user_offline",
    handler?: (...args: any[]) => void
  ) => {
    if (handler) {
      socket?.off(event, handler);
    } else {
      socket?.off(event);
    }
  },

  isConnected: () => socket?.connected || false,

  onError: (callback: (error: WebSocketError | null) => void) => {
    errorCallback = callback;
  },

  offError: () => {
    errorCallback = null;
  },
};
