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

export const threadGatewayService = {
  connect: (token: string) => {
    if (socket?.connected) return;
    if (socket) socket.disconnect();

    const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000";
    socket = io(`${baseUrl}/notifications`, {
      transports: ["websocket"],
      auth: { token },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to thread notifications gateway");
    });

    socket.on("disconnect", (reason: any) => {
      console.log("Disconnected from thread notifications gateway:", reason);
    });

    socket.on("connect_error", (error: any) => {
      console.error("Thread notifications gateway connection error:", {
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
      console.error("Thread notifications gateway server error:", error);
      errorCallback?.({
        message: error?.message || "Server error occurred",
        description: error?.description || error,
      });
    });

    socket.on("connect", () => {
      console.log("Connected to thread notifications gateway");
      // Clear any previous errors on successful connection
      errorCallback?.(null);
    });

    socket.on("disconnect", (reason: string) => {
      console.log("Disconnected from thread notifications gateway:", reason);
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
      | "thread.created"
      | "thread.message"
      | "thread.closed"
      | "thread.status_changed",
    handler: (...args: any[]) => void
  ) => {
    socket?.on(event, handler);
  },

  off: (
    event:
      | "thread.created"
      | "thread.message"
      | "thread.closed"
      | "thread.status_changed",
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