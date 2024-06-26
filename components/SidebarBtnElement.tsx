import React from "react";
import { FormElement } from "./FormElements";
import { Button } from "./ui/button";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export const SidebarBtnElement = ({
  formElement,
}: {
  formElement: FormElement;
}) => {
  const { label, icon: Icon } =
    formElement.designerBtnElement;
  const draggable = useDraggable({
    id: `designer-btn=${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      variant={"outline"}
      className={cn(
        "flex flex-col gap-2 h-[120px] w-[120px] curdsor-grab",
        draggable.isDragging && "rind-2 rind-primary"
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <Icon className='h-8 w-8 text-primary cursor-grab' />
      <p className='text-xs'></p>
    </Button>
  );
};

export const SidebarBtnElementDragOverlay = ({
  formElement,
}: {
  formElement: FormElement;
}) => {
  console.log(formElement);

  const { label, icon: Icon } =
    formElement.designerBtnElement;
  const draggable = useDraggable({
    id: `designer-btn=${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      variant={"outline"}
      className='flex flex-col gap-2 h-[120px] w-[120px] curdsor-grab'
    >
      <Icon className='h-8 w-8 text-primary cursor-grab' />
      <p className='text-xs'></p>
    </Button>
  );
};
