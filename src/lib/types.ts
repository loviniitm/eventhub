export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  created_at: string;
}

export interface Registration {
  id: number;
  event_id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface EventWithRegistrationCount extends Event {
  registration_count: number;
}

export interface DailyStats {
  date: string;
  total_registrations: number;
  total_events: number;
} 