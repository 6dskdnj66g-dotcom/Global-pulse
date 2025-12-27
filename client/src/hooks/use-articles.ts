import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ArticleResponse } from "@shared/routes";

export function useArticles(filters?: { 
  category?: string; 
  language?: 'en' | 'ar';
  search?: string;
  limit?: number; 
}) {
  const queryParams = new URLSearchParams();
  if (filters?.category) queryParams.append('category', filters.category);
  if (filters?.language) queryParams.append('language', filters.language);
  if (filters?.search) queryParams.append('search', filters.search);
  if (filters?.limit) queryParams.append('limit', String(filters.limit));

  return useQuery({
    queryKey: [api.articles.list.path, filters],
    queryFn: async () => {
      const url = `${api.articles.list.path}?${queryParams.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch articles");
      return api.articles.list.responses[200].parse(await res.json());
    },
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: [api.articles.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.articles.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch article");
      return api.articles.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useSyncArticles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.articles.sync.path, { 
        method: "POST",
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to sync articles");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.articles.list.path] });
    },
  });
}
