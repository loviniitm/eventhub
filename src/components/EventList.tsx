'use client';

import { EventCard } from './EventCard';
import { EventWithRegistrationCount } from '@/lib/types';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface EventsResponse {
  events: EventWithRegistrationCount[];
  pagination: PaginationInfo;
}

export default function EventList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/events?${params.toString()}`);
  };

  const [data, setData] = React.useState<EventsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const getEvents = async (searchParams: { [key: string]: string | string[] | undefined }) => {
    const params = new URLSearchParams();
    if (searchParams.search) params.append('search', searchParams.search as string);
    if (searchParams.location) params.append('location', searchParams.location as string);
    if (searchParams.startDate) params.append('startDate', searchParams.startDate as string);
    if (searchParams.endDate) params.append('endDate', searchParams.endDate as string);
    if (searchParams.page) params.append('page', searchParams.page as string);
    params.append('limit', '6'); // Fixed limit of 6 items per page
  
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/events`;
  
    try {
      const { data } = await axios.get<EventsResponse>(url, { params });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      } else {
        console.error('Unknown error:', error);
      }
      throw new Error('Failed to fetch events');
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents(searchParams);
        setData(response);
        setError(null);
      } catch (err) {
        setError('Error loading events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]);

  if (loading) {
    return <div className="mt-8 text-center text-gray-500">Loading events...</div>;
  }

  if (error) {
    return <div className="mt-8 text-center text-red-500">{error}</div>;
  }

  if (!data || data.events.length === 0) {
    return <div className="mt-8 text-center text-gray-500">No events found</div>;
  }

  const renderPaginationButtons = () => {
    const { page, totalPages } = data.pagination;
    const buttons = [];

    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 rounded-md border text-sm font-medium ${
          1 === page
            ? 'border-primary bg-primary text-white'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        1
      </button>
    );

    // Show ellipsis if there's a gap after first page
    if (page > 3) {
      buttons.push(
        <span key="ellipsis1" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // Show current page and one page before and after if they exist
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (i !== 1 && i !== totalPages) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-md border text-sm font-medium ${
              i === page
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      }
    }

    // Show ellipsis if there's a gap before last page
    if (page < totalPages - 2) {
      buttons.push(
        <span key="ellipsis2" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded-md border text-sm font-medium ${
            totalPages === page
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="space-y-8 mt-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.events.map((event: EventWithRegistrationCount) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Pagination */}
      {data.pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(data.pagination.page - 1)}
            disabled={data.pagination.page === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {renderPaginationButtons()}
          
          <button
            onClick={() => handlePageChange(data.pagination.page + 1)}
            disabled={data.pagination.page === data.pagination.totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 