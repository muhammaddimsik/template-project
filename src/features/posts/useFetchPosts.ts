import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useFetchPosts = () => {
  return useQuery({
    queryFn: async () => {
      const posts = await axiosInstance.get("/posts");

      return posts.data;
    },
    queryKey: ["fetch.posts"],
  });
};
