import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { RegistrationForm } from '@/components/RegistrationForm';
import axios from 'axios';

async function getEvent(id: string) {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch event');
  }
}

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {format(new Date(event.date), 'PPP')} at {event.location}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="prose max-w-none">
            <p className="text-gray-700">{event.description}</p>
          </div>
          <div className="mt-6">
            <div className="flex items-center text-sm text-gray-500">
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
          <div className="mt-6">
            <RegistrationForm eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 