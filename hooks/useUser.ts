import { userService } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      return await userService.getUserById(userId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
