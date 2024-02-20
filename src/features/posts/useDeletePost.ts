import { axiosInstance } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

type OnSuccessFunction = (
  data: any,
  variables: void,
  context: unknown
) => unknown;

export const useDeletePost = ({
  onSuccess,
}: {
  onSuccess?: OnSuccessFunction;
}) => {
  return useMutation({
    mutationFn: async (id) => {
      const posts = await axiosInstance.delete(`/posts/${id}`);

      return posts.data;
    },
    onSuccess,
  });
};
