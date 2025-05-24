import Link from 'next/link';
import { format } from 'date-fns';
import { EventWithRegistrationCount } from '@/lib/types';

export function EventCard({ event }: { event: EventWithRegistrationCount }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">
          <Link href={`/events/${event.id}`} className="hover:text-primary">
            {event.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {event.description}
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <svg
            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {event.location}
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <svg
            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          {format(new Date(event.date), 'PPP')}
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <svg
            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          {event.registration_count} registered
        </div>
      </div>
    </div>
  );
} 