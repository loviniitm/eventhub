'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';

export default function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for immediate input updates
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');

  // Debounced values for API calls
  const debouncedSearch = useDebounce(searchInput, 1000);
  const debouncedLocation = useDebounce(locationInput, 1000);

  // Update URL when debounced values change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    
    if (debouncedLocation) {
      params.set('location', debouncedLocation);
    } else {
      params.delete('location');
    }

    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/events?${params.toString()}`);
  }, [debouncedSearch, debouncedLocation, router, searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'search') {
      setSearchInput(value);
    } else if (name === 'location') {
      setLocationInput(value);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/events?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchInput('');
    setLocationInput('');
    router.push('/events');
  };

  const hasActiveFilters = Array.from(searchParams.entries()).some(([key]) => key !== 'page');

  const activeFilters = Array.from(searchParams.entries())
    .filter(([key]) => key !== 'page')
    .map(([key, value]) => ({
      key,
      value,
      label: key.charAt(0).toUpperCase() + key.slice(1)
    }));

  return (
    <div className="space-y-4">
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            name="search"
            id="search"
            value={searchInput}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2"
            placeholder="Search events..."
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={locationInput}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2"
            placeholder="Filter by location..."
          />
        </div>
        
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={searchParams.get('startDate') || ''}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2"
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={searchParams.get('endDate') || ''}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
            >
              {filter.label}: {filter.value}
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete(filter.key);
                  if (filter.key === 'search') setSearchInput('');
                  if (filter.key === 'location') setLocationInput('');
                  router.push(`/events?${params.toString()}`);
                }}
                className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/20"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearFilters}
            className="ml-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
} 