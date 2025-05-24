import { Suspense } from 'react';
import { format } from 'date-fns';
import { EventCard } from '@/components/EventCard';
import { EventWithRegistrationCount, DailyStats } from '@/lib/types';
import axios from 'axios';

async function getAnalytics() {
  try {
    const { data } = await axios.get<{
      popularEvents: EventWithRegistrationCount[];
      dailyStats: DailyStats[];
    }>(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Analytics fetch error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } else {
      console.error('Unknown error:', error);
    }
    throw new Error('Failed to fetch analytics');
  }
}

export default async function AdminPage() {
  const { popularEvents, dailyStats } = await getAnalytics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Analytics</h1>

      {/* Popular Events */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Popular Events</h2>
        <div className="mt-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {popularEvents.map((event: EventWithRegistrationCount) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Daily Stats */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900">Daily Statistics</h2>
        <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total Registrations
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total Events
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {dailyStats.map((stat: DailyStats) => (
                <tr key={stat.date}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {format(new Date(stat.date), 'PPP')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {stat.total_registrations}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {stat.total_events}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 