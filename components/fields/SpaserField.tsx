"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  LuHeading1,
  LuSeparatorHorizontal,
} from "react-icons/lu";
import { z } from "zod";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import useDesigner from "../hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";

const type: ElementsType = "SpaserField";

const extraAttributes = {
  height: 20,
};

const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
});

export const SpaserFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: LuSeparatorHorizontal,
    label: "Title field",
  },

  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

type propertiesFormSchemaType = z.infer<
  typeof propertiesSchema
>;
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;

  const { updateElement } = useDesigner();

  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      height: element.extraAttributes.title,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { height } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        height,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        className='space-y-3'
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormField
          control={form.control}
          name='height'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Height (px): {form.watch("height")}
                </FormLabel>
                <FormControl className='pt-2'>
                  <Slider
                    defaultValue={[field.value]}
                    min={5}
                    max={200}
                    step={1}
                    onValueChange={(value) => {
                      field.onChange(value[0]);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { height } = element.extraAttributes;
  return (
    <div className='flex flex-col gap-2 w-full items-center'>
      <Label className='text-muted-foreground'>
        Spacer field: {height}px
      </Label>
      <LuSeparatorHorizontal className='h-8 w-8' />
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
}) {
  const element = elementInstance as CustomInstance;

  const { height } = element.extraAttributes;
  return <div style={{ height, width: "100%" }}></div>;
}
