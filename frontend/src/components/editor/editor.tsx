import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
    type DragStartEvent,
    useDraggable,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Types
type PageBlock = {
    id: UniqueIdentifier;
    type: 'input' | 'divider' | 'image';
    content?: string;
    size?: 'sm' | 'md' | 'lg';
    src?: string;
};

type DraggableToolboxItem = {
    id: UniqueIdentifier;
    type: PageBlock['type'];
    label: string;
};

// Toolbox Items
const TOOLBOX_ITEMS: DraggableToolboxItem[] = [
    { id: 'header', type: 'input', label: 'Header' },
    { id: 'label', type: 'input', label: 'Label' },
    { id: 'divider', type: 'divider', label: 'Divider' },
    { id: 'image', type: 'image', label: 'Image' },
];

// Draggable Toolbox Item Component
const ToolboxItem = ({ item }: { item: DraggableToolboxItem }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.id,
        data: {
            fromToolbox: true,
            itemType: item.type,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="cursor-grab rounded border bg-white p-3 shadow-sm hover:bg-gray-50"
        >
            {item.label}
        </div>
    );
};

// Toolbox Component
const Toolbox = () => {
    return (
        <div className="w-64 rounded-lg border bg-gray-50 p-4">
            <h2 className="mb-4 text-lg font-semibold">Blocks</h2>
            <div className="space-y-2">
                {TOOLBOX_ITEMS.map((item) => (
                    <ToolboxItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

// Sortable Block Component
const SortableBlock = ({ block }: { block: PageBlock }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: block.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="group relative mb-2 rounded-lg border bg-white p-4 shadow-sm"
        >
            <button
                {...listeners}
                className="absolute -left-2 top-1/2 -translate-y-1/2 cursor-grab rounded-full bg-gray-100 p-1 opacity-0 transition-opacity group-hover:opacity-100"
            >
                ⋮⋮
            </button>

            {block.type === 'input' && (
                <input
                    type="text"
                    placeholder={block.content || `Enter ${block.size} text...`}
                    className={`${block.size === 'sm' ? 'text-lg' : block.size === 'md' ? 'text-xl' : 'text-2xl'} w-full`}
                />
            )}

            {block.type === 'divider' && <hr className="my-4 border-t-2" />}

            {block.type === 'image' && (
                <div className="flex items-center justify-center bg-gray-100 p-4">
                    {block.src ? (
                        <img src={block.src} alt="Uploaded" className="max-h-32 object-cover" />
                    ) : (
                        <span className="text-gray-400">Click to upload image</span>
                    )}
                </div>
            )}
        </div>
    );
};

// Building Container Component
const BuildingContainer = ({ children }: { children: React.ReactNode }) => {
    const { setNodeRef } = useDroppable({
        id: 'building-container',
    });

    return (
        <div ref={setNodeRef} className="flex-1 rounded-lg border bg-white p-4">
            {children}
        </div>
    );
};

// Page Builder Component
const PageBuilder = () => {
    const [blocks, setBlocks] = useState<PageBlock[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [activeItem, setActiveItem] = useState<DraggableToolboxItem | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Need to move 8px before dragging starts
            },
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id);

        if (event.active.data.current?.fromToolbox) {
            const itemId = event.active.id;
            const item = TOOLBOX_ITEMS.find(toolItem => toolItem.id === itemId);
            if (item) setActiveItem(item);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);
        setActiveItem(null);

        // If dropped outside or not over the building container, return
        if (!over || over.id !== 'building-container') return;

        // Only create new block if dragging from toolbox
        if (active.data.current?.fromToolbox) {
            const itemType = active.data.current?.itemType;
            const newBlock: PageBlock = {
                id: `block-${Date.now()}`,
                type: itemType,
                size: itemType === 'input' ? (active.id === 'header' ? 'lg' : 'md') : undefined,
            };
            setBlocks([...blocks, newBlock]);
            return;
        }

        // Handle reordering if dragging existing blocks
        if (active.id !== over.id && blocks.some(b => b.id === over.id)) {
            const oldIndex = blocks.findIndex((b) => b.id === active.id);
            const newIndex = blocks.findIndex((b) => b.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                setBlocks(arrayMove(blocks, oldIndex, newIndex));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto flex max-w-6xl gap-8">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={() => {
                        setActiveId(null);
                        setActiveItem(null);
                    }}
                >
                    <Toolbox />

                    <BuildingContainer>
                        <SortableContext
                            items={blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {blocks.map((block) => (
                                <SortableBlock key={block.id} block={block} />
                            ))}
                        </SortableContext>
                    </BuildingContainer>

                </DndContext>
            </div>

            <div className="mt-8 rounded-lg bg-gray-800 p-4 font-mono text-sm text-white">
                <pre>{JSON.stringify(blocks, null, 2)}</pre>
            </div>
        </div>
    );
};

export default PageBuilder;
