import { Suspense } from 'react';
import EventList from '@/components/EventList';
import EventFilters from '@/components/EventFilters';

export default function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        
        <EventFilters />
        
        <Suspense fallback={<div className="mt-8 text-center">Loading events...</div>}>
          <EventList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
} 