"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABLE_SECTIONS, PageSection } from "@/types/page";
import { GripVertical, Trash, Plus, Settings } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface LayoutEditorProps {
    sections: PageSection[];
    onChange: (sections: PageSection[]) => void;
}

export function LayoutEditor({ sections, onChange }: LayoutEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);
            onChange(arrayMove(sections, oldIndex, newIndex));
        }
    };

    const addSection = (componentId: string) => {
        const def = AVAILABLE_SECTIONS.find(s => s.id === componentId);
        if (!def) return;

        const newSection: PageSection = {
            id: uuidv4(),
            component: def.id,
            isVisible: true,
            props: { ...def.defaultProps }
        };
        onChange([...sections, newSection]);
    };

    const removeSection = (id: string) => {
        onChange(sections.filter(s => s.id !== id));
    };

    const updateSectionProps = (id: string, newProps: any) => {
        onChange(sections.map(s => s.id === id ? { ...s, props: { ...s.props, ...newProps } } : s));
    };

    const toggleVisibility = (id: string) => {
        onChange(sections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md border">
                <Select onValueChange={addSection}>
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue placeholder="Add Component..." />
                    </SelectTrigger>
                    <SelectContent>
                        {AVAILABLE_SECTIONS.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">Select a component to add to the layout.</span>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {sections.map((section) => (
                            <SortableSection
                                key={section.id}
                                section={section}
                                onRemove={() => removeSection(section.id)}
                                onUpdate={(p: any) => updateSectionProps(section.id, p)}
                                onToggle={() => toggleVisibility(section.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {sections.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-400">
                    Layout is empty. Add a component above.
                </div>
            )}
        </div>
    );
}

function SortableSection({ section, onRemove, onUpdate, onToggle }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const def = AVAILABLE_SECTIONS.find(s => s.id === section.component);

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-white dark:bg-gray-800 border p-3 rounded-md shadow-sm group">
            <div {...attributes} {...listeners} className="cursor-move p-2 text-gray-400 hover:text-gray-600">
                <GripVertical className="h-5 w-5" />
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{def?.label || section.component}</span>
                    {!section.isVisible && <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded-full">Hidden</span>}
                </div>
                <p className="text-xs text-gray-500 truncate max-w-[400px]">
                    Props: {JSON.stringify(section.props)}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={onToggle} className={section.isVisible ? "text-green-600" : "text-gray-400"}>
                    {section.isVisible ? "Visible" : "Hidden"}
                </Button>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline"><Settings className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit {def?.label}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {/* Simple Prop Editor - In real app, this would be a dynamic form based on component type */}
                            {Object.keys(section.props).map((key) => (
                                <div key={key} className="space-y-2">
                                    <Label className="capitalize">{key}</Label>
                                    <Input
                                        value={section.props[key]}
                                        onChange={(e) => onUpdate({ [key]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>

                <Button size="sm" variant="ghost" onClick={onRemove} className="text-red-500 hover:bg-red-50">
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
