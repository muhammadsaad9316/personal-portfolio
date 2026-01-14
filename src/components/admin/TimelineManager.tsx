'use native';
'use client';

import { useState, useEffect } from 'react';
import { createTimelineItem, deleteTimelineItem, updateTimelineItem, reorderTimelineItems } from '@/actions/timeline';
import { FaEdit, FaTrash, FaPlus, FaGraduationCap, FaBriefcase, FaGripVertical } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface TimelineItem {
    id: string;
    year: string;
    title: string;
    provider: string;
    desc: string;
    type: string;
    order: number;
}

export default function TimelineManager({ initialItems }: { initialItems: TimelineItem[] }) {
    const [items, setItems] = useState<TimelineItem[]>(initialItems);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<TimelineItem>>({});
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        if (sourceIndex === destinationIndex) return;

        // Reorder locally
        const newItems = Array.from(items);
        const [movedItem] = newItems.splice(sourceIndex, 1);
        newItems.splice(destinationIndex, 0, movedItem);

        // Update order property locally
        const updatedItems = newItems.map((item, index) => ({
            ...item,
            order: index
        }));

        setItems(updatedItems);

        // Save new order to server
        const updates = updatedItems.map(item => ({
            id: item.id,
            order: item.order
        }));

        await reorderTimelineItems(updates);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (currentItem.id) {
                const result = await updateTimelineItem(currentItem.id, currentItem);
                if (result.success && result.item) {
                    setItems(items.map(i => i.id === result.item!.id ? result.item! as TimelineItem : i));
                    setIsEditing(false);
                }
            } else {
                const result = await createTimelineItem({ ...currentItem, order: items.length });
                if (result.success && result.item) {
                    setItems([...items, result.item as TimelineItem]);
                    setIsEditing(false);
                }
            }
        } catch (error) {
            console.error('Failed to save item', error);
            alert('Failed to save item');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        const result = await deleteTimelineItem(id);
        if (result.success) {
            setItems(items.filter(i => i.id !== id));
        } else {
            alert('Failed to delete item');
        }
    };

    const openEdit = (item: TimelineItem) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const openNew = () => {
        setCurrentItem({
            type: 'education',
            year: '',
            title: '',
            provider: '',
            desc: '',
            order: items.length
        });
        setIsEditing(true);
    };

    // Sort items by order (or year if we prefer)
    // For now, let's just render them as returned (sorted by order desc usually? or asc)

    return (
        <div className="space-y-8">
            <button
                onClick={openNew}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
                <FaPlus /> Add New Entry
            </button>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{currentItem.id ? 'Edit Entry' : 'New Entry'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                                    <select
                                        value={currentItem.type}
                                        onChange={e => setCurrentItem({ ...currentItem, type: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                    >
                                        <option value="education">Education</option>
                                        <option value="experience">Experience</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Year/Duration</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2023 - Present"
                                        value={currentItem.year || ''}
                                        onChange={e => setCurrentItem({ ...currentItem, year: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title / Degree</label>
                                <input
                                    type="text"
                                    placeholder="e.g. BS Computer Science"
                                    value={currentItem.title || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Provider / Company</label>
                                <input
                                    type="text"
                                    placeholder="e.g. University Name"
                                    value={currentItem.provider || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, provider: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Details about this role..."
                                    value={currentItem.desc || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, desc: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 hover:bg-white/10 rounded text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                                >
                                    {loading ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Drag and Drop List */}
            {isMounted ? (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="timeline-list">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="grid gap-4"
                            >
                                {items.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-lg">
                                        No entries found. Add your first journey item!
                                    </div>
                                ) : (
                                    items.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between group bg-[#1a1a1a]"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="text-gray-500 hover:text-white cursor-grab active:cursor-grabbing p-2"
                                                        >
                                                            <FaGripVertical />
                                                        </div>
                                                        <div className={`p-3 rounded-full ${item.type === 'education' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                                            {item.type === 'education' ? <FaGraduationCap size={20} /> : <FaBriefcase size={20} />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-bold text-lg">{item.title}</h3>
                                                                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">{item.year}</span>
                                                            </div>
                                                            <p className="text-sm text-blue-300 mb-1">{item.provider}</p>
                                                            <p className="text-sm text-gray-400 line-clamp-1">{item.desc}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => openEdit(item)}
                                                            className="p-2 hover:bg-white/10 rounded text-blue-400 transition-colors"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 hover:bg-white/10 rounded text-red-400 transition-colors"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <div className="text-center py-12 text-gray-500">Loading editor...</div>
            )}
        </div>
    );
}
