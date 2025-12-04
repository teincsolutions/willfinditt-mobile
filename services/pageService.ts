import axios from "axios";

// Create an Axios instance for Directus API
const api = axios.create({
  baseURL: "https://directus.willfind8.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface PageData {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

export interface PageResponse {
  data: PageData;
}

export const pageService = {
  // Fetch page by slug from Directus
  getPageBySlug: async (slug: string): Promise<PageData> => {
    const response = await api.get<PageResponse>(`/items/page/${slug}`);
    return response.data.data;
  },
};
