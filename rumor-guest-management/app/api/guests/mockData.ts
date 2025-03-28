import { Guest } from '@/models/guest';

// Generate mock data for API
const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 
    'William', 'Elizabeth', 'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah',
    'Thomas', 'Karen', 'Charles', 'Nancy', 'Christopher', 'Lisa', 'Daniel', 'Margaret',
    'Matthew', 'Betty', 'Anthony', 'Sandra', 'Mark', 'Ashley', 'Donald', 'Kimberly',
    'Steven', 'Emily', 'Paul', 'Donna', 'Andrew', 'Michelle', 'Joshua', 'Carol',
    'Kenneth', 'Amanda', 'Kevin', 'Dorothy', 'Brian', 'Melissa', 'George', 'Deborah',
    'Edward', 'Stephanie', 'Ronald', 'Rebecca', 'Timothy', 'Sharon', 'Jason', 'Laura',
    'Jeffrey', 'Cynthia', 'Ryan', 'Kathleen', 'Jacob', 'Amy', 'Gary', 'Angela',
    'Nicholas', 'Shirley', 'Eric', 'Emma', 'Jonathan', 'Anna', 'Stephen', 'Ruth',
    'Larry', 'Olivia', 'Justin', 'Sophia', 'Scott', 'Ava', 'Brandon', 'Isabella',
    'Benjamin', 'Mia', 'Samuel', 'Charlotte', 'Gregory', 'Amelia', 'Alexander', 'Harper',
    'Frank', 'Evelyn', 'Patrick', 'Abigail', 'Raymond', 'Emily', 'Jack', 'Madison',
    'Dennis', 'Victoria', 'Jerry', 'Sofia', 'Tyler', 'Scarlett', 'Aaron', 'Camila',
    'Jose', 'Aria', 'Adam', 'Grace', 'Nathan', 'Chloe', 'Henry', 'Penelope',
    'Zachary', 'Riley', 'Douglas', 'Layla', 'Peter', 'Lillian', 'Kyle', 'Nora',
    'Noah', 'Zoey', 'Ethan', 'Hannah', 'Jeremy', 'Lily', 'Walter', 'Eleanor',
    'Christian', 'Audrey', 'Keith', 'Maya', 'Roger', 'Aaliyah', 'Terry', 'Claire'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
    'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
    'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
    'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
    'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson',
    'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
    'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross',
    'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell',
    'Coleman', 'Butler', 'Henderson', 'Barnes', 'Gonzales', 'Fisher', 'Vasquez', 'Simmons'
  ];
  
  // Instagram handle patterns
  const handlePatterns = [
    (firstName: string, lastName: string) => `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    (firstName: string, lastName: string) => `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    (firstName: string, lastName: string) => `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
    (firstName: string, lastName: string) => `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    (firstName: string, lastName: string) => `the_real_${firstName.toLowerCase()}`,
    (firstName: string, lastName: string) => `${firstName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
    (firstName: string, lastName: string) => `${lastName.toLowerCase()}.${firstName.toLowerCase()}`,
    (firstName: string, lastName: string) => `official${firstName.toLowerCase()}${lastName.charAt(0).toLowerCase()}`,
    (firstName: string, lastName: string) => `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
    (firstName: string, lastName: string) => `iam${firstName.toLowerCase()}${lastName.charAt(0).toLowerCase()}`
  ];
  
  // Utility to get random element from an array
  const getRandomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
  
  // Generate a random name
  const generateRandomName = (): { firstName: string; lastName: string } => {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    
    return { firstName, lastName };
  };
  
  // Generate a unique Instagram handle
  const generateInstagramHandle = (firstName: string, lastName: string, usedHandles: Set<string>): string => {
    let attempts = 0;
    let handle = '';
    
    while (attempts < 10) {
      const patternFn = getRandomElement(handlePatterns);
      handle = `@${patternFn(firstName, lastName)}`;
      
      // Check if handle is unique
      if (!usedHandles.has(handle)) {
        usedHandles.add(handle);
        return handle;
      }
      
      attempts++;
    }
    
    // If all attempts fail, use a more random approach
    handle = `@${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 10000)}`;
    usedHandles.add(handle);
    return handle;
  };
  
  // Generate mock data for API
  export const generateMockGuests = (count: number): Guest[] => {
    const statuses = ['attending', 'declined', 'pending', 'invited'];
    const tags = ['VIP', 'Friend', 'Family', 'Business', 'Press'];
    const usedHandles = new Set<string>();
    
    return Array.from({ length: count }, (_, i) => {
      const { firstName, lastName } = generateRandomName();
      const fullName = `${firstName} ${lastName}`;
      const instagramHandle = generateInstagramHandle(firstName, lastName, usedHandles);
      
      return {
        id: `guest-${i + 1}`,
        fullName,
        rsvpStatus: getRandomElement(statuses) as Guest['rsvpStatus'],
        instagramHandle,
        followerCount: Math.floor(Math.random() * 1000000),
        //Give them random tags, but don't give them the same tag twice
        tags: (() => {
            const tagCount = Math.floor(Math.random() * 3) + 1;
            const shuffledTags = [...tags].sort(() => Math.random() - 0.5);
            return shuffledTags.slice(0, tagCount);
          })(),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        invitedBefore: Math.random() > 0.5,
        notes: Math.random() > 0.7 ? `Note for ${firstName}` : undefined,
      };
    });
  };
  

