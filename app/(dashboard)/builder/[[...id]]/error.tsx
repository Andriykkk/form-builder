"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";

function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className='flex w-full h-full flex-col justify-center'>
      <h2 className='text-destructive text-4xl'>
        Something went wrong
      </h2>
      <Button asChild>
        <Link href={"/"}>Go back to home</Link>
      </Button>
    </div>
  );
}

export default Error;
