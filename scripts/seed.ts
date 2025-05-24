import { execute } from '../src/lib/db.js';

// Helper function to generate random date between start and end
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate random number between min and max
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate 100 events
const events = Array.from({ length: 100 }, (_, index) => {
  const locations = [
    'San Francisco', 'New York', 'London', 'Berlin', 'Tokyo',
    'Paris', 'Singapore', 'Sydney', 'Toronto', 'Dubai',
    'Mumbai', 'Seoul', 'Amsterdam', 'Barcelona', 'Austin'
  ];
  
  const eventTypes = [
    'Conference', 'Workshop', 'Meetup', 'Summit', 'Hackathon',
    'Seminar', 'Webinar', 'Networking', 'Training', 'Symposium'
  ];
  
  const techTopics = [
    'AI', 'Machine Learning', 'Web Development', 'Cloud Computing',
    'Blockchain', 'Cybersecurity', 'Data Science', 'DevOps',
    'Mobile Development', 'UI/UX Design', 'IoT', 'Quantum Computing',
    'AR/VR', 'Big Data', 'Edge Computing'
  ];

  const location = locations[randomInt(0, locations.length - 1)];
  const eventType = eventTypes[randomInt(0, eventTypes.length - 1)];
  const topic = techTopics[randomInt(0, techTopics.length - 1)];
  
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  const date = randomDate(startDate, endDate);

  return {
    title: `${topic} ${eventType} ${index + 1}`,
    description: `Join us for an exciting ${eventType.toLowerCase()} focused on ${topic}. Learn from industry experts, network with peers, and stay ahead of the latest trends in technology.`,
    location,
    date: date.toISOString(),
  };
});

// Generate registrations (1-5 registrations per event)
const registrations = events.flatMap((_, eventIndex) => {
  const numRegistrations = randomInt(1, 5);
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Edward', 'Emma', 'Frank', 'Grace'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Wilson', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Martinez', 'Anderson'];
  
  return Array.from({ length: numRegistrations }, () => {
    const firstName = firstNames[randomInt(0, firstNames.length - 1)];
    const lastName = lastNames[randomInt(0, lastNames.length - 1)];
    return {
      event_id: eventIndex + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    };
  });
});

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Insert events
    console.log('Inserting events...');
    for (const event of events) {
      await execute(
        'INSERT INTO events (title, description, location, date) VALUES (?, ?, ?, ?)',
        [event.title, event.description, event.location, event.date]
      );
    }
    console.log(`Inserted ${events.length} events`);

    // Insert registrations
    console.log('Inserting registrations...');
    for (const registration of registrations) {
      await execute(
        'INSERT INTO registrations (event_id, name, email) VALUES (?, ?, ?)',
        [registration.event_id, registration.name, registration.email]
      );
    }
    console.log(`Inserted ${registrations.length} registrations`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed(); 