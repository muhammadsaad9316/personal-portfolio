import { getTimelineItems } from '@/actions/timeline';
import TimelineManager from '@/components/admin/TimelineManager';

export default async function TimelinePage() {
    // We could verify auth here if not done in middleware/layout
    const { items } = await getTimelineItems();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Education & Journey Management</h1>
            <TimelineManager initialItems={items || []} />
        </div>
    );
}
