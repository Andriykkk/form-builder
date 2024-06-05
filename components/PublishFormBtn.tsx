import React, {
  startTransition,
  useTransition,
} from "react";
import { Button } from "./ui/button";
import { MdOutlinePublish } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { FaIcons, FaSpinner } from "react-icons/fa";
import { toast } from "./ui/use-toast";
import { PublishForm } from "@/actions/form";
import { useRouter } from "next/navigation";

const PublishFormBtn = ({ id }: { id: number }) => {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function publishForm() {
    try {
      await PublishForm(id);
      toast({
        title: "Success",
        description: "Your form has been published",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant={"outline"}
          className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400 hover:cursor-pointer'
        >
          <MdOutlinePublish className='h-6 w-6' />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutrely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. AFter publishing
            you will not be able to edit this form. <br />
            <span className='font-medium'>
              By publishing this form you will make it
              available to the public and you will be able
              to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishForm);
            }}
          >
            Proceed{" "}
            {loading && (
              <FaSpinner className='animate-spin' />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishFormBtn;
