
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface SearchableMultiSelectProps {
    endpoint: string;
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    labelKey?: string;
    valueKey?: string;
}

export function SearchableMultiSelect({
    endpoint,
    value = [],
    onChange,
    placeholder = "Select items...",
    labelKey = "title",
    valueKey = "_id"
}: SearchableMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const res = await fetch(endpoint);
                const json = await res.json();
                if (json.success || json.data) {
                    setItems(json.data || json.docs || []);
                }
            } catch (error) {
                console.error("Failed to fetch items", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [endpoint]);

    const handleSelect = (currentValue: string) => {
        const newValue = value.includes(currentValue)
            ? value.filter((id) => id !== currentValue)
            : [...value, currentValue];
        onChange(newValue);
    };

    const selectedLabels = items
        .filter(item => value.includes(item[valueKey]))
        .map(item => item[labelKey]);

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-auto min-h-[40px]"
                    >
                        <div className="flex flex-wrap gap-1 justify-start text-left">
                            {selectedLabels.length > 0 ? (
                                selectedLabels.map((label, i) => (
                                    <Badge key={i} variant="secondary" className="mr-1">{label}</Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground">{placeholder}</span>
                            )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                    <Command className="text-black">
                        <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="text-black" />
                        <CommandList>
                            <CommandEmpty>No item found.</CommandEmpty>
                            <CommandGroup>
                                {loading ? (
                                    <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                                ) : (
                                    items.map((item) => (
                                        <CommandItem
                                            key={item[valueKey]}
                                            value={item[labelKey]}
                                            onSelect={() => handleSelect(item[valueKey])}
                                            className="cursor-pointer data-[disabled]:opacity-100 data-[disabled]:pointer-events-auto text-black hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value.includes(item[valueKey]) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {item[labelKey]}
                                        </CommandItem>
                                    ))
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {value.length > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange([])}
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                >
                    Clear selection
                </Button>
            )}
        </div>
    );
}
