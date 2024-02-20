import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useDeletePost, useFetchPosts } from "@/features/posts";
import { FilePenLine, ReceiptText, Trash } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useEditPost } from "@/features/posts/useEditPost";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const Posts = () => {
  const { toast } = useToast();

  const { data, isLoading, refetch: refetchPosts } = useFetchPosts();

  const { mutate: deletePost } = useDeletePost({
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Success to delete the post",
      });
      refetchPosts();
    },
  });

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

  const EditForm = ({ data }: { data: PropsEdit }) => {
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
          {/* <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter> */}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <Toaster />
      {isLoading ? (
        <p>loading</p>
      ) : (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.body}</TableCell>
                <TableCell className="flex items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <ReceiptText />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Details</DialogTitle>
                        <DialogDescription>
                          This is details of Post Item
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Title</h4>
                          <p className="text-sm text-gray-600">{item.title}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Description</h4>
                          <p className="text-sm text-gray-600">{item.body}</p>
                        </div>
                      </div>
                      <DialogFooter>
                        {/* <Button type="submit">Save changes</Button> */}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Trash />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure to delete this post?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your post and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePost(item.id)}
                          className="bg-red-500"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <EditForm data={item} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
};

export default Posts;
