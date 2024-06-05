"use client";

import { cn } from "@/lib/utils";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import DesignerSidebar from "./DesignerSidebar";
import useDesigner from "./hooks/useDesigner";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "./FormElements";
import { idGenerator } from "@/lib/idGenerator";
import { useState } from "react";
import { BiSolidTrash } from "react-icons/bi";
import { Button } from "./ui/button";

const Designer = () => {
  const {
    elements,
    addElement,
    removeElement,
    selectedElement,
    setSelectedElement,
  } = useDesigner();

  const dropabble = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement =
        active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;

      const droppingSidebarBtnOverDesignerDropArea =
        isDesignerBtnElement &&
        isDroppingOverDesignerDropArea;
      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[
          type as ElementsType
        ].construct(idGenerator());

        addElement(elements.length, newElement);
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement;

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

      const droppingSidevarBtnOverDesignerElement =
        isDesignerBtnElement &&
        isDroppingOverDesignerElement;

      if (droppingSidevarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[
          type as ElementsType
        ].construct(idGenerator());

        const overId = over.data?.current?.elementId;

        const overElementIndex = elements.findIndex(
          (el) => el.id === overId
        );
        if (overElementIndex === -1) {
          throw new Error("Element not found");
        }

        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, newElement);
      }

      const isDraggingDesignerElement =
        active?.data?.current?.isDesignerElement;
      const dragginDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement &&
        isDraggingDesignerElement;

      if (
        dragginDesignerElementOverAnotherDesignerElement
      ) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;

        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeId
        );
        const overElementIndex = elements.findIndex(
          (el) => el.id === activeId
        );

        if (
          activeElementIndex === -1 ||
          overElementIndex === -1
        ) {
          throw new Error("Element not found");
        }

        const activeElement = {
          ...elements[activeElementIndex],
        };
        removeElement(activeId);

        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <div className='flex w-full h-full'>
      <div
        className='p-4 w-full'
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={dropabble.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow flex-1 overflow-y-auto",
            dropabble.isOver && "ring-2 ring-primary/20"
          )}
        >
          {!dropabble.isOver && elements.length === 0 && (
            <p className='text-3xl text-muted-foreground flex flex-grow items-center justify-center font-bold text-center'>
              Drop here
            </p>
          )}

          {dropabble.isOver && elements.length === 0 && (
            <div className='p-4 w-full'>
              <div className='h-[120px] rounded-md bg-primary/20'></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className='flex flex-col w-full gap-2 p-4'>
              {elements.map((element) => (
                <DesignerElementWrapper
                  key={element.id}
                  element={element}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
};

function DesignerElementWrapper({
  element,
}: {
  element: FormElementInstance;
}) {
  const {
    removeElement,
    selectedElement,
    setSelectedElement,
  } = useDesigner();

  const [mouseIsOver, setMouseIsOver] =
    useState<boolean>(false);
  const DesignerElement =
    FormElements[element.type].designerComponent;

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });
  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(event) => {
        event.stopPropagation();
        setSelectedElement(element);
      }}
      className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-inset'
    >
      <div
        ref={topHalf.setNodeRef}
        className='absolute w-full h-1/2 rounded-t-md'
      ></div>
      <div
        ref={bottomHalf.setNodeRef}
        className='absolute w-full bottom-0 h-1/2 rounded-b-md'
      ></div>
      {mouseIsOver && (
        <>
          <div className='absolute right-0 h-full'>
            <Button
              className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500'
              variant={"outline"}
              onClick={(event) => {
                event.stopPropagation();
                removeElement(element.id);
              }}
            >
              <BiSolidTrash className='h-6 w-6' />
            </Button>
          </div>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
            <p className='text-muted-foreground text-sm'>
              Click for properties or drag to move
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className='absolute top-0 w-full rounded-md rounded-b-none h-[7px] bg-primary' />
      )}
      {bottomHalf.isOver && (
        <div className='absolute bottom-0 w-full rounded-md rounded-t-none h-[7px] bg-primary' />
      )}
      <div
        className={cn(
          "flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",
          mouseIsOver && "opacity-30"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  );
}

export default Designer;
