"use server";

import {
  formSchema,
  formSchemaType,
} from "./../schemas/form";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

class UserNoFoundErr extends Error {}

export async function GetFormStats() {
  const user = await currentUser();

  if (!user) {
    throw new UserNoFoundErr();
  }

  const stats = prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = (await stats)._sum.visits || 0;
  const submission = (await stats)._sum.submissions || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submission / visits) * 100;
  }

  const bouceRate = 100 - submissionRate;

  return { visits, submission, submissionRate, bouceRate };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Form not valid");
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNoFoundErr();
  }

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error("something went wrong");
  }

  return form.id;
}

export async function GetForms() {
  const user = await currentUser();

  if (!user) {
    throw new UserNoFoundErr();
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function GetFormById(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new UserNoFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function UpdateFormContent(
  id: number,
  jsonContent: string
) {
  const user = await currentUser();

  if (!user) {
    throw new UserNoFoundErr();
  }

  return await prisma.form.update({
    where: {
      userId: user.id,
      id,
    },
    data: { content: jsonContent },
  });
}

export async function PublishForm(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new UserNoFoundErr();
  }

  return await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL: formUrl,
    },
  });
}

export async function SumbitForm(
  formUrl: string,
  content: string
) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new UserNoFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}
