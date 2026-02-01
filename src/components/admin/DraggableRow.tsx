"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TableRow } from "@/components/ui/table";

interface DraggableRowProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export function DraggableRow({ id, children, className = "" }: DraggableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "default",
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={`${className} ${isDragging ? "z-50" : ""}`}
        >
            <td className="px-2 py-2 w-8">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded p-1 inline-flex"
                >
                    <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
            </td>
            {children}
        </TableRow>
    );
}
