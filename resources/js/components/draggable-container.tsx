import hideProgress from '@/lib/hide-progress';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Move } from 'lucide-react';
import { useRef } from 'react';

interface DraggableItem {
    id: string | number;
    sort: number;
    [key: string]: any; // Allow for additional properties
}

interface Props<T extends DraggableItem> {
    items: T[];
    onOrderChange?: (items: T[]) => void;
    updateRoute?: string;
    renderItem: (item: T, index: number) => React.ReactNode;
    containerClassName?: string;
    iconClassName?: string;
    itemClassName?: string;
}

const DraggableContainer = <T extends DraggableItem>({
    items,
    onOrderChange,
    updateRoute,
    renderItem,
    containerClassName,
    itemClassName,
    iconClassName,
}: Props<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.add('dragging');
    };

    const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('dragging');

        const container = containerRef.current;
        if (container) {
            const updatedItems: T[] = [];

            // Get all draggable elements with item_id
            const elements = Array.from(
                container.querySelectorAll('[data-item_id]'),
            );

            // Starting sort value
            const baseSort = items[0].sort;

            elements.forEach((element, index) => {
                const id = parseInt(element.getAttribute('data-item_id') || '');
                if (id) {
                    const originalItem = items.find((item) => item.id === id);
                    if (originalItem) {
                        updatedItems.push({
                            ...originalItem,
                            sort: baseSort + index, // This will give us 4, 5, 6
                        });
                    }
                }
            });

            // Call the callback with updated items
            onOrderChange?.(updatedItems);

            // If updateRoute is provided, send update to server
            if (updateRoute) {
                hideProgress();
                router.put(updateRoute, {
                    items: updatedItems,
                });
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(
            containerRef.current!,
            e.clientY,
        );
        const draggable: any = document.querySelector('.dragging');

        if (afterElement == null) {
            containerRef.current?.appendChild(draggable);
        } else {
            containerRef.current?.insertBefore(draggable, afterElement);
        }
    };

    const getDragAfterElement = (
        container: HTMLElement,
        y: number,
    ): HTMLElement | null => {
        const draggableElements = [
            ...container.querySelectorAll<HTMLElement>(
                '.draggable:not(.dragging)',
            ),
        ];

        return draggableElements.reduce(
            (closest: any, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY, element: null },
        ).element;
    };

    // Sort items by sort value before rendering
    const sortedItems = [...items].sort((a, b) => a.sort - b.sort);

    return (
        <div
            ref={containerRef}
            className={containerClassName}
            onDragOver={handleDragOver}
        >
            {sortedItems.map((item, index) => (
                <div
                    draggable
                    key={item.id}
                    data-item_id={item.id}
                    className={cn('draggable flex items-center', itemClassName)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <Move
                        className={cn(
                            'mr-4 h-5 w-5 cursor-grab',
                            iconClassName,
                        )}
                    />
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    );
};

export default DraggableContainer;
