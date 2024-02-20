import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface Body {
  userId: number;
  title: string;
  body: string;
}

export const useEditPost = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async ({ params, id }: { params: Body; id: number }) => {
      const response = await axiosInstance.patch(`/posts/${id}`, params);
      return response;
    },
    onSuccess,
  });
};
