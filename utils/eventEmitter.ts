// ============================================
// Event Payload Types for Logout
// ============================================

export interface LogoutEventPayload {
  reason:
    | "invalid_token"
    | "invalid_user"
    | "no_refresh_token"
    | "refresh_failed"
    | "unauthorized"
    | "manual";
  message?: string;
}

// ============================================
// Simple callback storage for logout events
// ============================================

let logoutCallbacks: ((payload: LogoutEventPayload) => void)[] = [];

// ============================================
// Helper Functions
// ============================================

export const emitLogout = (payload: LogoutEventPayload) => {
  console.log("Emitting logout event:", payload);
  logoutCallbacks.forEach((callback) => {
    try {
      callback(payload);
    } catch (error) {
      console.error("Error in logout callback:", error);
    }
  });
};

export const onLogout = (
  callback: (payload: LogoutEventPayload) => void
): (() => void) => {
  logoutCallbacks.push(callback);

  // Return cleanup function
  return () => {
    logoutCallbacks = logoutCallbacks.filter((cb) => cb !== callback);
  };
};
