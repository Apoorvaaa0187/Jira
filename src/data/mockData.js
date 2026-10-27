// Initial Realistic Sample Data for Apex University Club Management System

export const INITIAL_CLUBS = [
  {
    id: "club-1",
    name: "Apex Coding & Open Source Society",
    shortName: "ACOS",
    category: "Technology",
    coordinator: "Dr. Sarah Jenkins (Faculty) & Rohan Sharma (Student Lead)",
    email: "coding.society@apex.edu",
    location: "Turing Lab, Block C, 3rd Floor",
    meetingSchedule: "Wednesdays & Fridays, 4:30 PM",
    memberCount: 142,
    established: 2018,
    description: "Dedicated to competitive programming, algorithm optimization, full-stack open source development, and hackathon training for national tier championships.",
    tags: ["DSA", "Hackathons", "WebDev", "OpenSource"],
    bannerColor: "from-blue-600 to-indigo-800"
  },
  {
    id: "club-2",
    name: "Robotics & Automation Society (RAS)",
    shortName: "RAS",
    category: "Technology",
    coordinator: "Prof. Vikram Nambiar & Tanya Sen",
    email: "robotics@apex.edu",
    location: "Mechatronics Lab 2, Tech Innovation Hub",
    meetingSchedule: "Tuesdays & Thursdays, 5:00 PM",
    memberCount: 88,
    established: 2019,
    description: "Designing combat bots, autonomous drones, smart IoT sensors, and computer vision systems. Represents the university at RoboSub and national tech expos.",
    tags: ["Robotics", "IoT", "Embedded", "ROS"],
    bannerColor: "from-cyan-600 to-teal-800"
  },
  {
    id: "club-3",
    name: "Literary & Debating Society",
    shortName: "LDS",
    category: "Oratory & Debate",
    coordinator: "Dr. Elena Rostova & Kevin Mathew",
    email: "debating@apex.edu",
    location: "Senate Hall, Humanities Wing",
    meetingSchedule: "Mondays, 4:00 PM",
    memberCount: 65,
    established: 2015,
    description: "Home of parliamentary debaters, Model UN delegates, creative writers, and orators. We organize mock trials, literary journals, and inter-university debates.",
    tags: ["Debate", "MUN", "Public Speaking", "Writing"],
    bannerColor: "from-amber-600 to-yellow-800"
  },
  {
    id: "club-4",
    name: "Symphony Cultural & Arts Guild",
    shortName: "SCAG",
    category: "Arts & Culture",
    coordinator: "Prof. Ananya Roy & Siddharth Joshi",
    email: "cultural.guild@apex.edu",
    location: "Amphitheatre & Music Studio A",
    meetingSchedule: "Fridays, 3:30 PM",
    memberCount: 110,
    established: 2016,
    description: "Nurturing student acoustic bands, theatrical productions, classical dance ensembles, fine arts exhibitions, and organizing the annual grand college fest 'Aura'.",
    tags: ["Music", "Drama", "Fine Arts", "Annual Fest"],
    bannerColor: "from-purple-600 to-pink-800"
  },
  {
    id: "club-5",
    name: "Shutterbug Media & Photography Club",
    shortName: "SMPC",
    category: "Media & Design",
    coordinator: "Prof. Arvind Menon & Priyansh Verma",
    email: "shutterbug@apex.edu",
    location: "Media Production Center, Central Library",
    meetingSchedule: "Saturdays, 11:00 AM",
    memberCount: 54,
    established: 2020,
    description: "Documenting campus life through visual storytelling, digital filmmaking, photojournalism, graphic design, and post-production masterclasses.",
    tags: ["Photography", "Cinematography", "Lightroom", "Media"],
    bannerColor: "from-rose-600 to-red-800"
  },
  {
    id: "club-6",
    name: "Apex Sports & Athletics Council",
    shortName: "ASAC",
    category: "Sports & Fitness",
    coordinator: "Coach Rajesh Pillai & Arjun Deshmukh",
    email: "sports.council@apex.edu",
    location: "Indoor Sports Complex & Pavilion",
    meetingSchedule: "Daily Sessions: 6:00 AM & 5:30 PM",
    memberCount: 175,
    established: 2014,
    description: "Managing inter-collegiate sports meets, marathon runs, fitness conditioning camps, basketball, badminton, football, and athletic training.",
    tags: ["Athletics", "Football", "Badminton", "Fitness"],
    bannerColor: "from-emerald-600 to-green-800"
  }
];

export const INITIAL_EVENTS = [
  {
    id: "evt-1",
    title: "CodeSparks 24-Hour Hackathon 2026",
    clubId: "club-1",
    clubName: "Apex Coding & Open Source Society",
    category: "Technology",
    date: "2026-11-12",
    time: "09:00 AM - 09:00 AM (Next Day)",
    location: "Main Auditorium & Innovation Lab",
    totalCapacity: 150,
    availableSeats: 8,
    registeredCount: 142,
    description: "University's flagship hackathon! Build real-world applications in Healthcare, Climate Tech, and FinTech with mentorship from tech alumni.",
    eligibility: "Open to all departments and all years",
    bannerIcon: "Code",
    badge: "Flagship Event"
  },
  {
    id: "evt-2",
    title: "Hands-on Deep Learning & Edge AI Masterclass",
    clubId: "club-1",
    clubName: "Apex Coding & Open Source Society",
    category: "Technology",
    date: "2026-11-05",
    time: "02:00 PM - 05:00 PM",
    location: "Computer Lab 4, Block B",
    totalCapacity: 40,
    availableSeats: 2, // Ideal for testing seat decrement & becoming full!
    registeredCount: 38,
    description: "Intensive 3-hour practical session on neural architectures, PyTorch pipelines, and deploying computer vision models onto edge microcontrollers.",
    eligibility: "Basic Python knowledge recommended",
    bannerIcon: "Cpu",
    badge: "Limited Seats"
  },
  {
    id: "evt-3",
    title: "Autonomous Bot Sprint & RoboWars Arena",
    clubId: "club-2",
    clubName: "Robotics & Automation Society (RAS)",
    category: "Technology",
    date: "2026-11-20",
    time: "10:30 AM - 04:30 PM",
    location: "Robotics Testing Arena, West Campus Ground",
    totalCapacity: 60,
    availableSeats: 0, // Demonstrates Full Event handling immediately!
    registeredCount: 60,
    description: "High-octane obstacle race and combat bot clash. Autonomous path-tracking algorithms battle for the coveted Chancellor's Trophy.",
    eligibility: "All engineering students",
    bannerIcon: "Bot",
    badge: "House Full"
  },
  {
    id: "evt-4",
    title: "National Parliamentary Debate Championship",
    clubId: "club-3",
    clubName: "Literary & Debating Society",
    category: "Oratory & Debate",
    date: "2026-11-15",
    time: "11:00 AM - 05:00 PM",
    location: "Senate Conference Hall, Admin Block",
    totalCapacity: 80,
    availableSeats: 32,
    registeredCount: 48,
    description: "A 3-tier British Parliamentary tournament debating current geopolitics, ethics of generative artificial intelligence, and digital privacy rights.",
    eligibility: "Open to all undergraduate & postgraduate students",
    bannerIcon: "MessageSquare",
    badge: "Prizes Worth $1,500"
  },
  {
    id: "evt-5",
    title: "Aura 2026: Acoustic Night & Classical Fusion",
    clubId: "club-4",
    clubName: "Symphony Cultural & Arts Guild",
    category: "Arts & Culture",
    date: "2026-11-25",
    time: "06:00 PM - 09:30 PM",
    location: "University Open-Air Amphitheatre",
    totalCapacity: 250,
    availableSeats: 60,
    registeredCount: 190,
    description: "An open-sky musical evening featuring acoustic bands, Hindustani & Western classical fusion, and live student dance troupes.",
    eligibility: "Apex University ID card required for entry",
    bannerIcon: "Music",
    badge: "Cultural Night"
  },
  {
    id: "evt-6",
    title: "Campus Frames: Street & Architecture Photo-Walk",
    clubId: "club-5",
    clubName: "Shutterbug Media & Photography Club",
    category: "Media & Design",
    date: "2026-11-08",
    time: "08:00 AM - 12:00 PM",
    location: "Heritage Quadrangle & Botanical Reserve",
    totalCapacity: 30,
    availableSeats: 12,
    registeredCount: 18,
    description: "Outdoor workshop exploring natural lighting, candid framing, aperture techniques, and post-processing in Adobe Lightroom.",
    eligibility: "Bring any DSLR, mirrorless, or smartphone camera",
    bannerIcon: "Camera",
    badge: "Outdoor Session"
  }
];

export const INITIAL_USERS = [
  {
    id: "usr-1",
    name: "Aarav Sharma",
    email: "student@apex.edu",
    password: "password123",
    role: "student",
    rollNo: "2024CS104",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    avatarInitials: "AS"
  },
  {
    id: "usr-2",
    name: "Prof. Vikram Nambiar",
    email: "coordinator@apex.edu",
    password: "password123",
    role: "coordinator",
    rollNo: "FAC-ROB-042",
    department: "Mechatronics & Robotics",
    assignedClubId: "club-2",
    assignedClubName: "Robotics & Automation Society (RAS)",
    year: "Faculty Coordinator",
    avatarInitials: "VN"
  },
  {
    id: "usr-3",
    name: "Dr. Elena Rostova",
    email: "president@apex.edu",
    password: "password123",
    role: "president",
    rollNo: "PRES-2026-01",
    department: "Student Affairs & Executive Council",
    year: "Council President",
    avatarInitials: "ER"
  }
];

export const INITIAL_USER = INITIAL_USERS[0];

// Realistic initial requests demonstrating Pending, Approved, and Rejected states!
export const INITIAL_MEMBERSHIP_REQUESTS = [
  {
    id: "req-101",
    clubId: "club-1",
    clubName: "Apex Coding & Open Source Society",
    studentName: "Aarav Sharma",
    rollNo: "2024CS104",
    email: "aarav.sharma@apex.edu",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    reason: "Passionate about competitive programming and contributing to open-source software libraries.",
    status: "Approved",
    appliedDate: "2026-10-12",
    reviewNotes: "Welcome to the team! Verified past GitHub activity and coursework."
  },
  {
    id: "req-102",
    clubId: "club-3",
    clubName: "Literary & Debating Society",
    studentName: "Aarav Sharma",
    rollNo: "2024CS104",
    email: "aarav.sharma@apex.edu",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    reason: "Eager to refine British Parliamentary debating skills and participate in inter-university debate invitationals.",
    status: "Pending",
    appliedDate: "2026-10-22",
    reviewNotes: "Application is under faculty coordinator review for the Autumn debate roster."
  },
  {
    id: "req-103",
    clubId: "club-6",
    clubName: "Apex Sports & Athletics Council",
    studentName: "Aarav Sharma",
    rollNo: "2024CS104",
    email: "aarav.sharma@apex.edu",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    reason: "Interested in competing in inter-branch badminton and weekend athletics conditioning.",
    status: "Rejected",
    appliedDate: "2026-09-28",
    reviewNotes: "Trial attendance minimum hours were not fulfilled for this semester roster. You may reapply next term."
  }
];

export const INITIAL_EVENT_REGISTRATIONS = [
  {
    id: "reg-501",
    eventId: "evt-1",
    eventTitle: "CodeSparks 24-Hour Hackathon 2026",
    clubName: "Apex Coding & Open Source Society",
    studentName: "Aarav Sharma",
    rollNo: "2024CS104",
    email: "aarav.sharma@apex.edu",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    registeredDate: "2026-10-21 14:15",
    ticketCode: "APX-HACK-8419",
    status: "Confirmed",
    eventDate: "2026-11-12",
    location: "Main Auditorium & Innovation Lab"
  }
];
