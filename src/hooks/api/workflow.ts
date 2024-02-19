import { authClient } from "@/common/axios";

export const getAuthUrl = async (id: string, redirectUri: string): Promise<{ authUri: string }> => {
  return authClient.get(`/api/oauth2/auth?id=${id}&redirectUri=${redirectUri}`).then(response => {
    return response.data;
  });
};
