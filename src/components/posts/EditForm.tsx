import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilePenLine } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";
import { useDeletePost, useFetchPosts, useEditPost } from "@/features/posts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(2).max(500),
  description: z.string().min(2).max(500),
});

interface PropsEdit {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const EditForm = ({ data }: { data: PropsEdit }) => {
  const { toast } = useToast();
  const { refetch: refetchPosts } = useFetchPosts();

  const { mutate: editPost } = useEditPost({
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Success to edit the post",
      });
      refetchPosts();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      description: data.body,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const body = {
      userId: data.userId,
      title: values.title,
      body: values.description,
    };

    editPost({ params: body, id: data.id });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FilePenLine />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-10 text-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditForm;
