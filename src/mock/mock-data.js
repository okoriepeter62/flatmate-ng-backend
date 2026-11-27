/**
 * Project: Flatmate NG
 * Developer: Person 1
 * Module: Mock Authentication
 * File: mock-data.js
 *
 * Purpose:
 * Stores temporary user records for mock
 * registration and login testing.
 *
 * IMPORTANT:
 * Passwords here are demo-only mock credentials.
 * Real authentication will use bcrypt password hashing.
 *
 * Shared by all developers.
 */

export const mockUsers = [
  {
    id: "user-001",
    fullName: "Peter Okorie",
    email: "peter@example.com",
    phone: "08011111111",
    password: "PeterDemo123!",
    status: "ACTIVE",
    role: "ROOM_SEEKER",
    isEmailVerified: true,
    isVerified: true,
  },
  {
    id: "user-002",
    fullName: "James Williams",
    email: "james@example.com",
    phone: "08022222222",
    password: "JamesDemo123!",
    status: "ACTIVE",
    role: "ROOM_HAVER",
    isEmailVerified: true,
    isVerified: true,
  },
  {
    id: "user-003",
    fullName: "Grace Johnson",
    email: "grace@example.com",
    phone: "08033333333",
    password: "GraceDemo123!",
    status: "ACTIVE",
    role: "ROOM_SEEKER",
    isEmailVerified: true,
    isVerified: false,
  },
  {
    id: "user-admin-001",
    fullName: "Flatmate NG Admin",
    email: "admin@flatmateng.com",
    phone: "08099999999",
    password: "AdminDemo123!",
    status: "ACTIVE",
    role: "ADMIN",
    isEmailVerified: true,
    isPhoneVerified: true,
    isVerified: true,
  },
];

// Temporary mock profiles
export const mockProfiles = [
  {
    id: "profile-001",
    userId: "user-001",
    firstName: "Peter",
    lastName: "Okorie",
    gender: "MALE",
    age: 27,
    city: "Lagos",
    state: "Lagos",
    religion: "Christianity",
    occupation: "Web Developer",
    bio: "A responsible and friendly person looking for a comfortable shared apartment.",
    profilePhotos: [],
    isComplete: true,
  },
  {
    id: "profile-002",
    userId: "user-002",
    firstName: "James",
    lastName: "Williams",
    gender: "MALE",
    age: 29,
    city: "Lagos",
    state: "Lagos",
    religion: "Christianity",
    occupation: "Software Engineer",
    bio: "I have a spacious apartment and would like a responsible flatmate.",
    profilePhotos: [],
    isComplete: true,
  },
  {
    id: "profile-003",
    userId: "user-003",
    firstName: "Grace",
    lastName: "Johnson",
    gender: "FEMALE",
    age: 25,
    city: "Lagos",
    state: "Lagos",
    religion: "Christianity",
    occupation: "Nurse",
    bio: "Looking for a peaceful and clean environment.",
    profilePhotos: [],
    isComplete: true,
  },
];

// Temporary mock accommodations
export const mockAccommodations = [
  {
    id: "accommodation-001",
    userId: "user-002",
    title: "Spacious Shared Apartment",
    description:
      "A comfortable apartment with a spacious bedroom and shared facilities.",
    accommodationType: "SHARED_APARTMENT",
    city: "Lagos",
    state: "Lagos",
    area: "Yaba",
    rentContribution: 450000,
    currency: "NGN",
    availableFrom: "2027-01-01",
    genderPreference: "ANY",
    images: [],
    status: "ACTIVE",
  },
  {
    id: "accommodation-002",
    userId: "user-002",
    title: "Self-Contained Apartment",
    description: "A clean and secure self-contained apartment.",
    accommodationType: "SELF_CONTAINED",
    city: "Lagos",
    state: "Lagos",
    area: "Surulere",
    rentContribution: 650000,
    currency: "NGN",
    availableFrom: "2027-02-01",
    genderPreference: "ANY",
    images: [],
    status: "ACTIVE",
  },
];

// Temporary mock matching results
export const mockMatches = [
  {
    id: "match-001",
    userId: "user-001",
    matchedUserId: "user-002",
    compatibilityScore: 87,
    status: "PENDING",
    matchedProfile: {
      firstName: "James",
      lastName: "Williams",
      city: "Lagos",
      occupation: "Software Engineer",
      bio: "I have a spacious apartment and would like a responsible flatmate.",
    },
  },
  {
    id: "match-002",
    userId: "user-001",
    matchedUserId: "user-003",
    compatibilityScore: 79,
    status: "PENDING",
    matchedProfile: {
      firstName: "Grace",
      lastName: "Johnson",
      city: "Lagos",
      occupation: "Nurse",
      bio: "Looking for a peaceful and clean environment.",
    },
  },
];

// Temporary mock interests
export const mockInterests = [
  {
    id: "interest-001",
    senderId: "user-001",
    receiverId: "user-002",
    accommodationId: "accommodation-001",
    status: "PENDING",
    createdAt: "2026-11-25T10:00:00.000Z",
  },
];

// Temporary mock notifications
export const mockNotifications = [
  {
    id: "notification-001",
    userId: "user-001",
    title: "New Match Found",
    message: "You have a new potential flatmate match.",
    type: "NEW_MATCH",
    isRead: false,
    createdAt: "2026-11-25T10:30:00.000Z",
  },
  {
    id: "notification-002",
    userId: "user-001",
    title: "Interest Received",
    message: "Someone has shown interest in sharing accommodation with you.",
    type: "NEW_INTEREST",
    isRead: false,
    createdAt: "2026-11-25T11:00:00.000Z",
  },
];

// Temporary mock reports
export const mockReports = [
  {
    id: "report-001",
    reporterId: "user-001",
    reportedUserId: "user-003",
    reason: "INAPPROPRIATE_BEHAVIOUR",
    description: "Sample report for frontend testing.",
    status: "PENDING",
    createdAt: "2026-11-25T12:00:00.000Z",
  },
];

// Temporary mock verifications
export const mockVerifications = [
  {
    id: "verification-001",
    userId: "user-001",
    verificationType: "IDENTITY",
    status: "APPROVED",
    submittedAt: "2026-11-20T09:00:00.000Z",
    reviewedAt: "2026-11-21T09:00:00.000Z",
  },
  {
    id: "verification-002",
    userId: "user-003",
    verificationType: "IDENTITY",
    status: "PENDING",
    submittedAt: "2026-11-25T09:00:00.000Z",
    reviewedAt: null,
  },
];

/**
 * Project: Flatmate NG
 * Developer: Person 1
 * Module: Mock API
 * File: mock-data.js
 *
 * Purpose:
 * Provides temporary accommodation preference data
 * for frontend integration.
 *
 * Shared by all developers.
 */

export const mockPreferences = [
  {
    id: "preference-001",
    userId: "user-001",
    preferredCity: "Lagos",
    preferredLocations: ["Ikeja", "Yaba", "Surulere"],
    minBudget: 300000,
    maxBudget: 700000,
    accommodationType: "SHARED_APARTMENT",
    moveInDate: "2027-01-15",
    moveInFlexibilityDays: 14,
    preferredGender: "ANY",
    minAge: 22,
    maxAge: 35,
    preferredReligion: null,
  },
  {
    id: "preference-002",
    userId: "user-002",
    preferredCity: "Lagos",
    preferredLocations: ["Lekki", "Yaba"],
    minBudget: 400000,
    maxBudget: 800000,
    accommodationType: "SHARED_APARTMENT",
    moveInDate: "2027-02-01",
    moveInFlexibilityDays: 14,
    preferredGender: "ANY",
    minAge: null,
    maxAge: null,
    preferredReligion: null,
  },
];

/**
 * Project: Flatmate NG
 * Developer: Person 1
 * Module: Mock API - Lifestyle Preferences
 * File: mock-data.js
 *
 * Purpose:
 * Provides temporary lifestyle preference data
 * for frontend integration.
 *
 * Shared by all developers.
 */

export const mockLifestylePreferences = [
  {
    id: "lifestyle-001",
    userId: "user-001",
    cleanliness: "VERY_CLEAN",
    noiseTolerance: "MODERATE",
    visitors: "OCCASIONAL",
    smoking: "NO",
    pets: "NO",
    paysBillsOnTime: true,
    privacyPreference: "MODERATE",
    cookingHabits: "OCCASIONAL",
    kitchenHabits: "CLEAN_AS_YOU_GO",
    workSchedule: "DAY",
    sleepTime: "10:00 PM",
  },
  {
    id: "lifestyle-002",
    userId: "user-002",
    cleanliness: "MODERATE",
    noiseTolerance: "HIGH",
    visitors: "FREQUENT",
    smoking: "NO",
    pets: "YES",
    paysBillsOnTime: true,
    privacyPreference: "HIGH",
    cookingHabits: "FREQUENT",
    kitchenHabits: "CLEAN_AFTER_COOKING",
    workSchedule: "FLEXIBLE",
    sleepTime: "11:00 PM",
  },
];

/**
 * Project: Flatmate NG
 * Developer: Person 1
 * Module: Mock Authentication
 *
 * Purpose:
 * Stores temporary authentication sessions
 * for mock token validation and refresh.
 *
 * Shared by all developers.
 */

export const mockSessions = [];

/**
 * Mock OTP Storage
 *
 * Purpose:
 * Temporarily stores generated phone verification codes
 * for frontend integration testing.
 *
 * Developer: Person 1
 * Shared by all developers.
 */

export const mockOtps = [];

/**
 * Mock Email Verification Storage
 *
 * Purpose:
 * Temporarily stores email verification tokens
 * for frontend integration testing.
 *
 * Developer: Person 1
 * Shared by all developers.
 */

export const mockEmailVerifications = [];

/**
 * Mock Password Reset Storage
 *
 * Purpose:
 * Temporarily stores password reset tokens
 * for frontend integration testing.
 *
 * Developer: Person 1
 * Shared by all developers.
 */

export const mockPasswordResets = [];


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Blocks Module)
 * Shared mock data maintained by Person 1.
 *
 * Purpose:
 * Stores temporary blocked-user relationships for frontend integration.
 */
export const mockBlocks = [];
