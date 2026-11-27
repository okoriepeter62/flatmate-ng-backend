/**
 * Project: Flatmate NG
 * Developer: Person 1
 * Module: Mock API
 * File: mock-routes.js
 *
 * Purpose:
 * Provides temporary API endpoints for frontend integration.
 * Real authentication and database operations will be added later.
 *
 * Shared by all developers.
 */

import express from "express";

import {
  mockUsers,
  mockProfiles,
  mockPreferences,
  mockLifestylePreferences,
  mockSessions,
  mockOtps,
  mockEmailVerifications,
  mockPasswordResets,
  mockAccommodations,
  mockVerifications,
  mockMatches,
  mockInterests,
  mockBlocks,
  mockReports,
  mockNotifications,
} from "./mock-data.js";

import { sendSuccess } from "../utils/api-response.js";

const router = express.Router();

/**
 * Temporary authentication simulation.
 *
 * Frontend developers can send:
 * x-mock-user-id: user-001
 *
 * This will simulate the currently logged-in user.
 */
const getMockUser = (req) => {
  const userId = req.headers["x-mock-user-id"] || "user-001";

  return mockUsers.find((user) => user.id === userId);
};

/**
 * Get My Accommodations
 *
 * GET /api/accommodations/me
 *
 * Purpose:
 * Retrieves all accommodation listings belonging
 * to the currently selected mock user.
 *
 * Developer: Person 2
 * Temporary mock endpoint shared by all developers.
 */

router.get("/accommodations/me", (req, res) => {
  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Only Room Havers can manage accommodation listings.
  if (user.role !== "ROOM_HAVER") {
    return res.status(403).json({
      success: false,
      message: "Only Room Havers can access their accommodation listings.",
    });
  }

  // Retrieve the user's accommodation listings.
  const accommodations = mockAccommodations.filter(
    (item) => item.userId === user.id,
  );

  return sendSuccess(res, {
    statusCode: 200,
    message: "Your accommodation listings retrieved successfully.",
    data: {
      accommodations,
      total: accommodations.length,
    },
  });
});

/**
 * Create Accommodation
 *
 * POST /api/accommodations
 *
 * Purpose:
 * Allows a Room Haver to create a new accommodation listing.
 *
 * Developer: Person 2
 * Temporary mock endpoint shared by all developers.
 */

router.post("/accommodations", (req, res) => {
  const {
    title,
    description,
    city,
    location,
    accommodationType,
    totalRent,
    rentContribution,
    availableRooms,
    availableFrom,
  } = req.body;

  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Only Room Havers can create accommodation listings.
  if (user.role !== "ROOM_HAVER") {
    return res.status(403).json({
      success: false,
      message: "Only Room Havers can create accommodation listings.",
    });
  }

  // Validate required fields.
  if (
    !title ||
    !description ||
    !city ||
    !location ||
    !accommodationType ||
    totalRent === undefined ||
    rentContribution === undefined ||
    availableRooms === undefined ||
    !availableFrom
  ) {
    return res.status(400).json({
      success: false,
      message: "All accommodation fields are required.",
    });
  }

  // Validate accommodation type.
  const allowedTypes = ["FLAT", "SELF_CONTAINED", "SHARED_APARTMENT", "ROOM"];

  if (!allowedTypes.includes(accommodationType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid accommodation type.",
    });
  }

  // Validate rent and room values.
  if (
    !Number.isFinite(Number(totalRent)) ||
    !Number.isFinite(Number(rentContribution)) ||
    Number(totalRent) <= 0 ||
    Number(rentContribution) <= 0 ||
    Number(rentContribution) > Number(totalRent) ||
    !Number.isInteger(Number(availableRooms)) ||
    Number(availableRooms) < 1
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid rent amount or available rooms.",
    });
  }

  // Validate availability date.
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(availableFrom) ||
    Number.isNaN(Date.parse(`${availableFrom}T00:00:00Z`)) ||
    new Date(`${availableFrom}T00:00:00Z`).toISOString().slice(0, 10) !==
      availableFrom
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid availability date in YYYY-MM-DD format.",
    });
  }

  // Create the accommodation record.
  const newAccommodation = {
    id: `accommodation-${Date.now()}`,
    userId: user.id,
    title,
    description,
    accommodationType,
    city,
    state: null,
    area: location,
    location,
    totalRent: Number(totalRent),
    rentContribution: Number(rentContribution),
    availableRooms: Number(availableRooms),
    currency: "NGN",
    availableFrom,
    genderPreference: "ANY",
    images: [],
    status: "ACTIVE",
  };

  // Save the new accommodation.
  mockAccommodations.push(newAccommodation);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Accommodation created successfully.",
    data: newAccommodation,
  });
});

/**
 * Get Single Accommodation
 *
 * GET /api/accommodations/:id
 *
 * Purpose:
 * Retrieves details of a specific accommodation listing.
 *
 * Developer: Person 2
 * Temporary mock endpoint shared by all developers.
 */

router.get("/accommodations/:id", (req, res) => {
  const { id } = req.params;

  // Find the accommodation.
  const accommodation = mockAccommodations.find((item) => item.id === id);

  if (!accommodation) {
    return res.status(404).json({
      success: false,
      message: "Accommodation not found.",
    });
  }

  return sendSuccess(res, {
    statusCode: 200,
    message: "Accommodation retrieved successfully.",
    data: accommodation,
  });
});

/**
 * Update Accommodation
 *
 * PATCH /api/accommodations/:id
 *
 * Purpose:
 * Allows a Room Haver to update their own accommodation listing.
 *
 * Developer: Person 2
 * Temporary mock endpoint shared by all developers.
 */

router.patch("/accommodations/:id", (req, res) => {
  const { id } = req.params;

  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Only Room Havers can update accommodation listings.
  if (user.role !== "ROOM_HAVER") {
    return res.status(403).json({
      success: false,
      message: "Only Room Havers can update accommodation listings.",
    });
  }

  // Find the accommodation.
  const accommodation = mockAccommodations.find((item) => item.id === id);

  if (!accommodation) {
    return res.status(404).json({
      success: false,
      message: "Accommodation not found.",
    });
  }

  // Ensure the current user owns the accommodation.
  if (accommodation.userId !== user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this accommodation.",
    });
  }

  // Allowed fields for updating.
  const allowedFields = [
    "title",
    "description",
    "city",
    "location",
    "accommodationType",
    "totalRent",
    "rentContribution",
    "availableRooms",
    "availableFrom",
    "genderPreference",
  ];

  const updates = Object.keys(req.body);

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update.",
    });
  }

  // Reject fields that are not allowed.
  const invalidFields = updates.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `These fields cannot be updated: ${invalidFields.join(", ")}`,
    });
  }

  // Validate accommodation type.
  if (
    req.body.accommodationType &&
    !["FLAT", "SELF_CONTAINED", "SHARED_APARTMENT", "ROOM"].includes(
      req.body.accommodationType,
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid accommodation type.",
    });
  }

  // Apply permitted updates.
  Object.assign(accommodation, req.body);

  // Keep location and area fields consistent.
  if (req.body.location !== undefined) {
    accommodation.area = req.body.location;
  }

  // Keep numeric fields consistent.
  if (req.body.totalRent !== undefined) {
    accommodation.totalRent = Number(req.body.totalRent);
  }

  if (req.body.rentContribution !== undefined) {
    accommodation.rentContribution = Number(req.body.rentContribution);
  }

  if (req.body.availableRooms !== undefined) {
    accommodation.availableRooms = Number(req.body.availableRooms);
  }

  return sendSuccess(res, {
    statusCode: 200,
    message: "Accommodation updated successfully.",
    data: accommodation,
  });
});

/**
 * Delete Accommodation
 *
 * DELETE /api/accommodations/:id
 *
 * Purpose:
 * Allows a Room Haver to delete their own accommodation listing.
 *
 * Developer: Person 2
 * Temporary mock endpoint shared by all developers.
 */

router.delete("/accommodations/:id", (req, res) => {
  const { id } = req.params;

  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Only Room Havers can delete accommodation listings.
  if (user.role !== "ROOM_HAVER") {
    return res.status(403).json({
      success: false,
      message: "Only Room Havers can delete accommodation listings.",
    });
  }

  // Find the accommodation index.
  const accommodationIndex = mockAccommodations.findIndex(
    (item) => item.id === id,
  );

  if (accommodationIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Accommodation not found.",
    });
  }

  // Ensure the current user owns the accommodation.
  const accommodation = mockAccommodations[accommodationIndex];

  if (accommodation.userId !== user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to delete this accommodation.",
    });
  }

  // Delete the accommodation.
  mockAccommodations.splice(accommodationIndex, 1);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Accommodation deleted successfully.",
    data: null,
  });
});

/**
 * Add Accommodation Image
 *
 * POST /accommodations/:id/images
 *
 * Purpose:
 * Allows a Room Haver to add an image URL to their
 * own accommodation listing.
 *
 * Developer: Person 2
 * Temporary mock endpoint shared by all developers.
 * Actual image uploads will use Cloudinary later.
 */

router.post("/accommodations/:id/images", (req, res) => {
  const { id } = req.params;
  const { imageUrl, altText } = req.body;

  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Only Room Havers can add accommodation images.
  if (user.role !== "ROOM_HAVER") {
    return res.status(403).json({
      success: false,
      message: "Only Room Havers can add accommodation images.",
    });
  }

  // Find the accommodation.
  const accommodation = mockAccommodations.find((item) => item.id === id);

  if (!accommodation) {
    return res.status(404).json({
      success: false,
      message: "Accommodation not found.",
    });
  }

  // Ensure the current user owns the accommodation.
  if (accommodation.userId !== user.id) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to add images to this accommodation.",
    });
  }

  // Validate the image URL.
  if (!imageUrl || typeof imageUrl !== "string") {
    return res.status(400).json({
      success: false,
      message: "A valid imageUrl is required.",
    });
  }

  try {
    new URL(imageUrl);
  } catch {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid image URL.",
    });
  }

  // Create a mock image record.
  const newImage = {
    id: `image-${Date.now()}`,
    imageUrl,
    altText: altText || "",
    createdAt: new Date().toISOString(),
  };

  // Ensure the images property is an array.
  if (!Array.isArray(accommodation.images)) {
    accommodation.images = [];
  }

  accommodation.images.push(newImage);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Accommodation image added successfully.",
    data: newImage,
  });
});

/**
 * Delete Accommodation Image
 *
 * DELETE /accommodations/:id/images/:imageId
 *
 * Purpose:
 * Allows a Room Haver to remove an image from
 * their own accommodation listing.
 *
 * Developer: Person 2
 * Temporary mock endpoint shared by all developers.
 */

router.delete("/accommodations/:id/images/:imageId", (req, res) => {
  const { id, imageId } = req.params;

  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Only Room Havers can delete accommodation images.
  if (user.role !== "ROOM_HAVER") {
    return res.status(403).json({
      success: false,
      message: "Only Room Havers can delete accommodation images.",
    });
  }

  // Find the accommodation.
  const accommodation = mockAccommodations.find((item) => item.id === id);

  if (!accommodation) {
    return res.status(404).json({
      success: false,
      message: "Accommodation not found.",
    });
  }

  // Ensure the current user owns the accommodation.
  if (accommodation.userId !== user.id) {
    return res.status(403).json({
      success: false,
      message:
        "You are not authorized to delete images from this accommodation.",
    });
  }

  // Find the image.
  const imageIndex = accommodation.images.findIndex(
    (image) => image.id === imageId,
  );

  if (imageIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Accommodation image not found.",
    });
  }

  // Remove the image.
  accommodation.images.splice(imageIndex, 1);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Accommodation image deleted successfully.",
    data: null,
  });
});

/**
 * GET /profiles/me
 *
 * Gets the current user's profile.
 */
router.get("/profiles/me", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const profile = mockProfiles.find((item) => item.userId === user.id);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Profile not found.",
    });
  }

  return sendSuccess(res, {
    message: "Profile retrieved successfully.",
    data: profile,
  });
});

/**
 * PATCH /profiles/me
 *
 * Updates the current user's profile.
 *
 * Developer: Person 1
 * Temporary mock implementation for frontend integration.
 */
router.patch("/profiles/me", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const profile = mockProfiles.find((item) => item.userId === user.id);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Profile not found.",
    });
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "city",
    "state",
    "religion",
    "occupation",
    "bio",
  ];

  const updates = Object.keys(req.body);

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update.",
    });
  }

  const invalidFields = updates.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Some fields cannot be updated.",
      errors: invalidFields,
    });
  }

  if (req.body.bio !== undefined && req.body.bio.length > 300) {
    return res.status(400).json({
      success: false,
      message: "Bio cannot exceed 300 characters.",
    });
  }

  Object.assign(profile, req.body);

  return sendSuccess(res, {
    message: "Profile updated successfully.",
    data: profile,
  });
});

/**
 * POST /profiles/me/photos
 *
 * Simulates uploading profile photos.
 *
 * Developer: Person 1
 * Temporary mock implementation.
 */
router.post("/profiles/me/photos", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const profile = mockProfiles.find((item) => item.userId === user.id);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Profile not found.",
    });
  }

  const { photos } = req.body;

  if (!Array.isArray(photos) || photos.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one photo.",
    });
  }

  if (profile.profilePhotos.length + photos.length > 4) {
    return res.status(400).json({
      success: false,
      message: "You can upload a maximum of 4 profile photos.",
    });
  }

  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  for (const photo of photos) {
    if (
      !photo.name ||
      !allowedExtensions.includes(photo.name.split(".").pop().toLowerCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Only JPG, JPEG, PNG and WebP images are allowed.",
      });
    }
  }

  const uploadedPhotos = photos.map((photo) => ({
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url: `https://example.com/mock-uploads/${photo.name}`,
    publicId: `mock/${user.id}/${photo.name}`,
  }));

  profile.profilePhotos.push(...uploadedPhotos);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Profile photos uploaded successfully.",
    data: {
      profilePhotos: profile.profilePhotos,
    },
  });
});

/**
 * DELETE /profiles/me/photos/:photoId
 *
 * Deletes a profile photo belonging to the current user.
 *
 * Developer: Person 1
 * Temporary mock implementation.
 */
router.delete("/profiles/me/photos/:photoId", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const profile = mockProfiles.find((item) => item.userId === user.id);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Profile not found.",
    });
  }

  const photoIndex = profile.profilePhotos.findIndex(
    (photo) => photo.id === req.params.photoId,
  );

  if (photoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Profile photo not found.",
    });
  }

  profile.profilePhotos.splice(photoIndex, 1);

  return sendSuccess(res, {
    message: "Profile photo deleted successfully.",
    data: {
      profilePhotos: profile.profilePhotos,
    },
  });
});

/**
 * GET /profiles/:userId
 *
 * Gets another user's public profile.
 */
router.get("/profiles/:userId", (req, res) => {
  const profile = mockProfiles.find(
    (item) => item.userId === req.params.userId,
  );

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "User profile not found.",
    });
  }

  return sendSuccess(res, {
    message: "User profile retrieved successfully.",
    data: profile,
  });
});

/**
 * GET /api/preferences/me
 *
 * Purpose:
 * Returns the accommodation preferences
 * of the currently selected mock user.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.get("/preferences/me", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const preferences = mockPreferences.find((item) => item.userId === user.id);

  if (!preferences) {
    return res.status(404).json({
      success: false,
      message: "Preferences not found for this user.",
    });
  }

  return sendSuccess(res, {
    message: "Preferences retrieved successfully.",
    data: preferences,
  });
});

/**
 * POST /api/preferences
 *
 * Purpose:
 * Creates accommodation preferences
 * for the currently selected mock user.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.post("/preferences", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const existingPreferences = mockPreferences.find(
    (item) => item.userId === user.id,
  );

  if (existingPreferences) {
    return res.status(409).json({
      success: false,
      message: "Preferences already exist for this user.",
    });
  }

  const {
    preferredCity,
    preferredLocations,
    minBudget,
    maxBudget,
    accommodationType,
    moveInDate,
    moveInFlexibilityDays,
    preferredGender,
    minAge,
    maxAge,
    preferredReligion,
  } = req.body;

  if (
    !preferredCity ||
    !Array.isArray(preferredLocations) ||
    typeof minBudget !== "number" ||
    typeof maxBudget !== "number" ||
    !accommodationType ||
    !moveInDate
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required preference fields.",
    });
  }

  if (minBudget < 0 || maxBudget < minBudget) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid budget range.",
    });
  }

  const allowedAccommodationTypes = [
    "FLAT",
    "SELF_CONTAINED",
    "SHARED_APARTMENT",
    "ROOM",
  ];

  if (!allowedAccommodationTypes.includes(accommodationType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid accommodation type.",
    });
  }

  const newPreferences = {
    id: `preference-${Date.now()}`,
    userId: user.id,
    preferredCity,
    preferredLocations,
    minBudget,
    maxBudget,
    accommodationType,
    moveInDate,
    moveInFlexibilityDays: moveInFlexibilityDays ?? 0,
    preferredGender: preferredGender ?? "ANY",
    minAge: minAge ?? null,
    maxAge: maxAge ?? null,
    preferredReligion: preferredReligion ?? null,
  };

  mockPreferences.push(newPreferences);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Preferences created successfully.",
    data: newPreferences,
  });
});

/**
 * PATCH /api/preferences/me
 *
 * Purpose:
 * Updates the accommodation preferences
 * of the currently selected mock user.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.patch("/preferences/me", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const preferences = mockPreferences.find((item) => item.userId === user.id);

  if (!preferences) {
    return res.status(404).json({
      success: false,
      message: "Preferences not found for this user.",
    });
  }

  const allowedFields = [
    "preferredCity",
    "preferredLocations",
    "minBudget",
    "maxBudget",
    "accommodationType",
    "moveInDate",
    "moveInFlexibilityDays",
    "preferredGender",
    "minAge",
    "maxAge",
    "preferredReligion",
  ];

  const updates = Object.keys(req.body);

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update.",
    });
  }

  const invalidFields = updates.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid fields provided.",
      errors: invalidFields,
    });
  }

  const updatedPreferences = {
    ...preferences,
    ...req.body,
  };

  if (
    typeof updatedPreferences.minBudget !== "number" ||
    typeof updatedPreferences.maxBudget !== "number" ||
    updatedPreferences.minBudget < 0 ||
    updatedPreferences.maxBudget < updatedPreferences.minBudget
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid budget range.",
    });
  }

  if (!Array.isArray(updatedPreferences.preferredLocations)) {
    return res.status(400).json({
      success: false,
      message: "Preferred locations must be an array.",
    });
  }

  const allowedAccommodationTypes = [
    "FLAT",
    "SELF_CONTAINED",
    "SHARED_APARTMENT",
    "ROOM",
  ];

  if (
    !allowedAccommodationTypes.includes(updatedPreferences.accommodationType)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid accommodation type.",
    });
  }

  Object.assign(preferences, req.body);

  return sendSuccess(res, {
    message: "Preferences updated successfully.",
    data: preferences,
  });
});

/**
 * GET /api/lifestyle-preferences/me
 *
 * Purpose:
 * Returns the lifestyle preferences of the
 * currently selected mock user.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.get("/lifestyle-preferences/me", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const lifestylePreferences = mockLifestylePreferences.find(
    (item) => item.userId === user.id,
  );

  if (!lifestylePreferences) {
    return res.status(404).json({
      success: false,
      message: "Lifestyle preferences not found for this user.",
    });
  }

  return sendSuccess(res, {
    message: "Lifestyle preferences retrieved successfully.",
    data: lifestylePreferences,
  });
});

/**
 * POST /api/lifestyle-preferences
 *
 * Purpose:
 * Creates lifestyle preferences for the
 * currently selected mock user.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.post("/lifestyle-preferences", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const existingPreferences = mockLifestylePreferences.find(
    (item) => item.userId === user.id,
  );

  if (existingPreferences) {
    return res.status(409).json({
      success: false,
      message: "Lifestyle preferences already exist for this user.",
    });
  }

  const {
    cleanliness,
    noiseTolerance,
    visitors,
    smoking,
    pets,
    paysBillsOnTime,
    privacyPreference,
    cookingHabits,
    kitchenHabits,
    workSchedule,
    sleepTime,
  } = req.body;

  const requiredFields = {
    cleanliness,
    noiseTolerance,
    visitors,
    smoking,
    pets,
    paysBillsOnTime,
    privacyPreference,
    cookingHabits,
    kitchenHabits,
    workSchedule,
    sleepTime,
  };

  const missingFields = Object.entries(requiredFields)
    .filter(
      ([, value]) => value === undefined || value === null || value === "",
    )
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide all lifestyle preference fields.",
      errors: missingFields,
    });
  }

  if (typeof paysBillsOnTime !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "paysBillsOnTime must be a boolean.",
    });
  }

  const newLifestylePreferences = {
    id: `lifestyle-${Date.now()}`,
    userId: user.id,
    cleanliness,
    noiseTolerance,
    visitors,
    smoking,
    pets,
    paysBillsOnTime,
    privacyPreference,
    cookingHabits,
    kitchenHabits,
    workSchedule,
    sleepTime,
  };

  mockLifestylePreferences.push(newLifestylePreferences);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Lifestyle preferences created successfully.",
    data: newLifestylePreferences,
  });
});

/**
 * PATCH /api/lifestyle-preferences/me
 *
 * Purpose:
 * Updates the lifestyle preferences of the
 * currently selected mock user.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.patch("/lifestyle-preferences/me", (req, res) => {
  const user = getMockUser(req);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Mock user not found.",
    });
  }

  const lifestylePreferences = mockLifestylePreferences.find(
    (item) => item.userId === user.id,
  );

  if (!lifestylePreferences) {
    return res.status(404).json({
      success: false,
      message: "Lifestyle preferences not found for this user.",
    });
  }

  const allowedFields = [
    "cleanliness",
    "noiseTolerance",
    "visitors",
    "smoking",
    "pets",
    "paysBillsOnTime",
    "privacyPreference",
    "cookingHabits",
    "kitchenHabits",
    "workSchedule",
    "sleepTime",
  ];

  const updates = Object.keys(req.body);

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update.",
    });
  }

  const invalidFields = updates.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid fields provided.",
      errors: invalidFields,
    });
  }

  if (
    req.body.paysBillsOnTime !== undefined &&
    typeof req.body.paysBillsOnTime !== "boolean"
  ) {
    return res.status(400).json({
      success: false,
      message: "paysBillsOnTime must be a boolean.",
    });
  }

  Object.assign(lifestylePreferences, req.body);

  return sendSuccess(res, {
    message: "Lifestyle preferences updated successfully.",
    data: lifestylePreferences,
  });
});

/**
 * Request Phone Verification OTP
 *
 * POST /api/auth/phone/otp/request
 *
 * Purpose:
 * Generates a temporary six-digit OTP for phone verification.
 *
 * Developer: Person 1
 * Temporary mock endpoint shared by all developers.
 */

router.post("/auth/phone/otp/request", (req, res) => {
  const { phone } = req.body;

  // Check whether phone number was provided.
  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required.",
    });
  }

  // Find the user associated with the phone number.
  const user = mockUsers.find((item) => item.phone === phone);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No account found with this phone number.",
    });
  }

  // Generate a six-digit OTP.
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Remove any previous unused OTP for this phone number.
  const existingOtpIndex = mockOtps.findIndex((item) => item.phone === phone);

  if (existingOtpIndex !== -1) {
    mockOtps.splice(existingOtpIndex, 1);
  }

  // Store the new OTP with a five-minute expiry.
  mockOtps.push({
    userId: user.id,
    phone,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    verified: false,
  });

  return res.status(200).json({
    success: true,
    message: "Phone verification OTP generated successfully.",
    data: {
      phone,
      expiresIn: 300,
      developmentOtp: otp,
    },
  });
});

/**
 * Verify Phone Number OTP
 *
 * POST /api/auth/phone/otp/verify
 *
 * Purpose:
 * Validates the submitted OTP and marks the user's
 * phone number as verified.
 *
 * Developer: Person 1
 * Temporary mock endpoint shared by all developers.
 */

router.post("/auth/phone/otp/verify", (req, res) => {
  const { phone, otp } = req.body;

  // Check required fields.
  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: "Phone number and OTP are required.",
    });
  }

  // Find the OTP associated with the phone number.
  const otpRecord = mockOtps.find((item) => item.phone === phone);

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP or OTP not found.",
    });
  }

  // Check whether the OTP has expired.
  if (Date.now() > otpRecord.expiresAt) {
    const index = mockOtps.indexOf(otpRecord);
    mockOtps.splice(index, 1);

    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please request a new one.",
    });
  }

  // Check whether the submitted OTP is correct.
  if (otpRecord.otp !== String(otp)) {
    return res.status(400).json({
      success: false,
      message: "Incorrect OTP.",
    });
  }

  // Find the user.
  const user = mockUsers.find((item) => item.id === otpRecord.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Mark phone number as verified.
  user.isPhoneVerified = true;

  // Remove OTP after successful verification.
  const index = mockOtps.indexOf(otpRecord);
  mockOtps.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: "Phone number verified successfully.",
    data: {
      phone: user.phone,
      isPhoneVerified: user.isPhoneVerified,
    },
  });
});

/**
 * Resend Email Verification Token
 *
 * POST /api/auth/email/resend
 *
 * Purpose:
 * Generates a new temporary email verification token.
 *
 * Developer: Person 1
 * Temporary mock endpoint shared by all developers.
 */

router.post("/auth/email/resend", (req, res) => {
  const { email } = req.body;

  // Check whether email was provided.
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email address is required.",
    });
  }

  // Find the user.
  const user = mockUsers.find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No account found with this email address.",
    });
  }

  // Check whether email is already verified.
  if (user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: "Email address is already verified.",
    });
  }

  // Generate a temporary verification token.
  const token = Math.random().toString(36).substring(2, 12);

  // Remove any previous verification token for this email.
  const existingIndex = mockEmailVerifications.findIndex(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (existingIndex !== -1) {
    mockEmailVerifications.splice(existingIndex, 1);
  }

  // Store the new token with a 30-minute expiry.
  mockEmailVerifications.push({
    userId: user.id,
    email: user.email,
    token,
    expiresAt: Date.now() + 30 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Email verification token generated successfully.",
    data: {
      email: user.email,
      expiresIn: 1800,
      developmentToken: token,
    },
  });
});

/**
 * Verify Email Address
 *
 * POST /api/auth/email/verify
 *
 * Purpose:
 * Validates an email verification token and marks
 * the user's email address as verified.
 *
 * Developer: Person 1
 * Temporary mock endpoint shared by all developers.
 */

router.post("/auth/email/verify", (req, res) => {
  const { email, token } = req.body;

  // Check required fields.
  if (!email || !token) {
    return res.status(400).json({
      success: false,
      message: "Email and verification token are required.",
    });
  }

  // Find the verification record.
  const verification = mockEmailVerifications.find(
    (item) => item.email === email,
  );

  if (!verification) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification token or token not found.",
    });
  }

  // Check token expiry.
  if (Date.now() > verification.expiresAt) {
    const index = mockEmailVerifications.indexOf(verification);
    mockEmailVerifications.splice(index, 1);

    return res.status(400).json({
      success: false,
      message: "Verification token has expired. Please request a new one.",
    });
  }

  // Validate submitted token.
  if (verification.token !== String(token)) {
    return res.status(400).json({
      success: false,
      message: "Incorrect verification token.",
    });
  }

  // Find the user.
  const user = mockUsers.find((item) => item.id === verification.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Mark email as verified.
  user.isEmailVerified = true;

  // Remove token after successful verification.
  const index = mockEmailVerifications.indexOf(verification);
  mockEmailVerifications.splice(index, 1);

  return res.status(200).json({
    success: true,
    message: "Email address verified successfully.",
    data: {
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
  });
});

/**
 * Forgot Password
 *
 * POST /api/auth/forgot-password
 *
 * Purpose:
 * Generates a temporary password reset token.
 *
 * Developer: Person 1
 * Temporary mock endpoint shared by all developers.
 */

router.post("/auth/forgot-password", (req, res) => {
  const { email } = req.body;

  // Check whether email was provided.
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email address is required.",
    });
  }

  // Find the user.
  const user = mockUsers.find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No account found with this email address.",
    });
  }

  // Generate a temporary reset token.
  const token = Math.random().toString(36).substring(2, 12);

  // Remove any previous reset token for this user.
  const existingIndex = mockPasswordResets.findIndex(
    (item) => item.userId === user.id,
  );

  if (existingIndex !== -1) {
    mockPasswordResets.splice(existingIndex, 1);
  }

  // Store the token with a 15-minute expiry.
  mockPasswordResets.push({
    userId: user.id,
    email: user.email,
    token,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Password reset token generated successfully.",
    data: {
      email: user.email,
      expiresIn: 900,
      developmentToken: token,
    },
  });
});

/**
 * Reset Password
 *
 * POST /api/auth/reset-password
 *
 * Purpose:
 * Validates a password reset token and updates
 * the user's password.
 *
 * Developer: Person 1
 * Temporary mock endpoint shared by all developers.
 */

router.post("/auth/reset-password", (req, res) => {
  const { email, token, newPassword } = req.body;

  // Check required fields.
  if (!email || !token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, reset token, and new password are required.",
    });
  }

  // Check minimum password length.
  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 8 characters.",
    });
  }

  // Find the reset record.
  const resetRecord = mockPasswordResets.find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!resetRecord) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired password reset token.",
    });
  }

  // Check token expiry.
  if (Date.now() > resetRecord.expiresAt) {
    const index = mockPasswordResets.indexOf(resetRecord);
    mockPasswordResets.splice(index, 1);

    return res.status(400).json({
      success: false,
      message: "Password reset token has expired.",
    });
  }

  // Validate token.
  if (resetRecord.token !== String(token)) {
    return res.status(400).json({
      success: false,
      message: "Invalid password reset token.",
    });
  }

  // Find the user.
  const user = mockUsers.find((item) => item.id === resetRecord.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Update password (temporary mock implementation).
  user.password = newPassword;

  // Remove token after successful password reset.
  const index = mockPasswordResets.indexOf(resetRecord);
  mockPasswordResets.splice(index, 1);

  // Invalidate all existing login sessions.
  for (let i = mockSessions.length - 1; i >= 0; i--) {
    if (mockSessions[i].userId === user.id) {
      mockSessions.splice(i, 1);
    }
  }

  return res.status(200).json({
    success: true,
    message:
      "Password reset successfully. Please log in with your new password.",
  });
});

/**
 * POST /api/auth/register
 *
 * Purpose:
 * Registers a new mock user for frontend integration.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.post("/auth/register", (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    userType,
    acceptTerms,
    acceptPrivacyPolicy,
  } = req.body;

  // Check required fields.
  if (
    !fullName ||
    !email ||
    !phone ||
    !password ||
    !userType ||
    acceptTerms === undefined ||
    acceptPrivacyPolicy === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required registration fields.",
    });
  }

  // Check terms and privacy policy acceptance.
  if (acceptTerms !== true || acceptPrivacyPolicy !== true) {
    return res.status(400).json({
      success: false,
      message: "You must accept the Terms and Privacy Policy.",
    });
  }

  // Validate user type.
  const allowedUserTypes = ["ROOM_SEEKER", "ROOM_HAVER"];

  if (!allowedUserTypes.includes(userType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user type.",
    });
  }

  // Check for duplicate email or phone.
  const existingUser = mockUsers.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() || user.phone === phone,
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email or phone already exists.",
    });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    fullName,
    email: email.toLowerCase(),
    phone,
    password,
    role: userType,
    isEmailVerified: false,
    isVerified: false,
  };

  mockUsers.push(newUser);

  // Never return the password in the response.
  const { password: userPassword, ...safeUser } = newUser;

  return sendSuccess(res, {
    statusCode: 201,
    message: "Registration successful.",
    data: safeUser,
  });
});

/**
 * POST /api/auth/login
 *
 * Purpose:
 * Authenticates an existing mock user and creates
 * a temporary authentication session.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const user = mockUsers.find(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  // Generate temporary mock tokens.
  const accessToken = `mock-access-${user.id}-${Date.now()}`;
  const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;

  const currentTime = Date.now();

  // Store the authentication session.
  const newSession = {
    id: `session-${currentTime}`,
    userId: user.id,
    accessToken,
    refreshToken,
    accessTokenExpiresAt: currentTime + 15 * 60 * 1000,
    refreshTokenExpiresAt: currentTime + 7 * 24 * 60 * 60 * 1000,
    createdAt: new Date(currentTime).toISOString(),
  };

  mockSessions.push(newSession);

  // Remove password from the response.
  const { password: userPassword, ...safeUser } = user;

  return sendSuccess(res, {
    message: "Login successful.",
    data: {
      user: safeUser,
      tokens: {
        accessToken,
        refreshToken,
        tokenType: "Bearer",
        expiresIn: 900,
      },
    },
  });
});

/**
 * POST /api/auth/refresh
 *
 * Purpose:
 * Generates a new access token using a valid refresh token.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.post("/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required.",
    });
  }

  // Find the session using the supplied refresh token.
  const session = mockSessions.find(
    (item) => item.refreshToken === refreshToken,
  );

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token.",
    });
  }

  // Check whether the refresh token has expired.
  if (Date.now() > session.refreshTokenExpiresAt) {
    const sessionIndex = mockSessions.indexOf(session);
    mockSessions.splice(sessionIndex, 1);

    return res.status(401).json({
      success: false,
      message: "Refresh token has expired. Please log in again.",
    });
  }

  const user = mockUsers.find((item) => item.id === session.userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User account not found.",
    });
  }

  const currentTime = Date.now();

  // Generate new tokens.
  const newAccessToken = `mock-access-${user.id}-${currentTime}`;
  const newRefreshToken = `mock-refresh-${user.id}-${currentTime}`;

  // Rotate the existing session tokens.
  session.accessToken = newAccessToken;
  session.refreshToken = newRefreshToken;

  session.accessTokenExpiresAt = currentTime + 15 * 60 * 1000;
  session.refreshTokenExpiresAt = currentTime + 7 * 24 * 60 * 60 * 1000;

  const { password: userPassword, ...safeUser } = user;

  return sendSuccess(res, {
    message: "Tokens refreshed successfully.",
    data: {
      user: safeUser,
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenType: "Bearer",
        expiresIn: 900,
      },
    },
  });
});

/**
 * POST /api/auth/logout
 *
 * Purpose:
 * Logs out the currently authenticated mock user
 * by removing their session.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.post("/auth/logout", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token is required.",
    });
  }

  const sessionIndex = mockSessions.findIndex(
    (item) => item.refreshToken === refreshToken,
  );

  if (sessionIndex === -1) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session.",
    });
  }

  // Remove the session to invalidate both tokens.
  mockSessions.splice(sessionIndex, 1);

  return sendSuccess(res, {
    message: "Logout successful.",
  });
});

/**
 * GET /api/auth/me
 *
 * Purpose:
 * Returns the details of the currently authenticated mock user.
 *
 * Developer: Person 1
 * Shared by all developers.
 */
router.get("/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  const accessToken = authHeader.split(" ")[1];

  const session = mockSessions.find((item) => item.accessToken === accessToken);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token.",
    });
  }

  if (Date.now() > session.accessTokenExpiresAt) {
    return res.status(401).json({
      success: false,
      message: "Access token has expired. Please refresh your token.",
    });
  }

  const user = mockUsers.find((item) => item.id === session.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User account not found.",
    });
  }

  const { password: userPassword, ...safeUser } = user;

  return sendSuccess(res, {
    message: "User details retrieved successfully.",
    data: safeUser,
  });
});

/**
 * Submit Verification
 *
 * POST /verifications
 *
 * Purpose:
 * Allows a user to submit identity or workplace
 * verification information for admin review.
 *
 * Developer: Person 2
 * Temporary mock endpoint shared by all developers.
 * Actual document uploads will use private storage later.
 */

router.post("/verifications", (req, res) => {
  const { verificationType, documentType, documentUrl } = req.body;

  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Validate verification type.
  const allowedTypes = ["IDENTITY", "WORKPLACE"];

  if (!allowedTypes.includes(verificationType)) {
    return res.status(400).json({
      success: false,
      message: "Verification type must be IDENTITY or WORKPLACE.",
    });
  }

  // Validate required document information.
  if (!documentType || typeof documentType !== "string" || !documentUrl) {
    return res.status(400).json({
      success: false,
      message: "Document type and document URL are required.",
    });
  }

  // Check whether the user already has a pending
  // submission of this verification type.
  const existingVerification = mockVerifications.find(
    (item) =>
      item.userId === user.id &&
      item.verificationType === verificationType &&
      item.status === "PENDING",
  );

  if (existingVerification) {
    return res.status(409).json({
      success: false,
      message:
        "You already have a pending submission for this verification type.",
    });
  }

  // Create a temporary verification record.
  const newVerification = {
    id: `verification-${Date.now()}`,
    userId: user.id,
    verificationType,
    documentType,
    documentUrl,
    status: "PENDING",
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  };

  mockVerifications.push(newVerification);

  return sendSuccess(res, {
    statusCode: 201,
    message: "Verification submitted successfully. Awaiting admin review.",
    data: newVerification,
  });
});

/**
 * Get My Verifications
 *
 * GET /verifications/me
 *
 * Purpose:
 * Allows users to view their verification submissions
 * and check their verification status.
 *
 * Developer: Person 2
 * Temporary mock endpoint shared by all developers.
 */

router.get("/verifications/me", (req, res) => {
  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Get only verification records belonging to this user.
  const userVerifications = mockVerifications.filter(
    (item) => item.userId === user.id,
  );

  return sendSuccess(res, {
    statusCode: 200,
    message: "Your verification records retrieved successfully.",
    data: {
      verifications: userVerifications,
      total: userVerifications.length,
    },
  });
});


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Admin Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /admin/dashboard
 *
 * Provides summary statistics for the admin dashboard.
 */
router.get("/admin/dashboard", (req, res) => {
    const userId = req.headers["x-mock-user-id"] || "user-001";

    // Find the current user.
    const user = mockUsers.find((item) => item.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Only administrators can access the dashboard.
    if (user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    // Calculate user statistics.
    const totalUsers = mockUsers.filter(
        (item) => item.role !== "ADMIN"
    ).length;

    const totalRoomSeekers = mockUsers.filter(
        (item) => item.role === "ROOM_SEEKER"
    ).length;

    const totalRoomHavers = mockUsers.filter(
        (item) => item.role === "ROOM_HAVER"
    ).length;

    // Calculate report statistics.
    const pendingReports = mockReports.filter(
        (report) => report.status === "PENDING"
    ).length;

    // Calculate verification statistics.
    const pendingVerifications = mockVerifications.filter(
        (item) => item.status === "PENDING"
    ).length;

    const approvedVerifications = mockVerifications.filter(
        (item) => item.status === "APPROVED"
    ).length;

    const rejectedVerifications = mockVerifications.filter(
        (item) => item.status === "REJECTED"
    ).length;

    return sendSuccess(res, {
        statusCode: 200,
        message: "Admin dashboard statistics retrieved successfully.",
        data: {
            users: {
                total: totalUsers,
                roomSeekers: totalRoomSeekers,
                roomHavers: totalRoomHavers
            },
            reports: {
                pending: pendingReports
            },
            verifications: {
                pending: pendingVerifications,
                approved: approvedVerifications,
                rejected: rejectedVerifications
            }
        }
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Admin Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /admin/users
 *
 * Retrieves registered users with filtering and pagination.
 */
router.get("/admin/users", (req, res) => {
    const userId = req.headers["x-mock-user-id"] || "user-001";

    // Verify the current user.
    const admin = mockUsers.find((user) => user.id === userId);

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Restrict access to administrators.
    if (admin.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    const { role, status, search } = req.query;

    // Get pagination values.
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
        100,
        Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    // Exclude administrator accounts from the general user list.
    let users = mockUsers.filter((user) => user.role !== "ADMIN");

    // Filter by role.
    if (role) {
        const allowedRoles = ["ROOM_SEEKER", "ROOM_HAVER"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role filter."
            });
        }

        users = users.filter((user) => user.role === role);
    }

    // Filter by account status.
    if (status) {
        const allowedStatuses = ["ACTIVE", "SUSPENDED"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account status filter."
            });
        }

        users = users.filter((user) => user.status === status);
    }

    // Search by name, email, or phone.
    if (search) {
        const searchTerm = search.toLowerCase();

        users = users.filter((user) =>
            user.fullName.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.phone.includes(searchTerm)
        );
    }

    // Calculate pagination.
    const total = users.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    const paginatedUsers = users.slice(
        startIndex,
        startIndex + limit
    );

    // Never expose passwords in admin user listings.
    const safeUsers = paginatedUsers.map(
        ({ password, ...user }) => user
    );

    return sendSuccess(res, {
        statusCode: 200,
        message: "Users retrieved successfully.",
        data: {
            users: safeUsers,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Admin Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /admin/users/:userId
 *
 * Retrieves an individual user's details.
 */
router.get("/admin/users/:userId", (req, res) => {
    const adminId = req.headers["x-mock-user-id"] || "user-001";
    const { userId } = req.params;

    // Verify the current user.
    const admin = mockUsers.find((user) => user.id === adminId);

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Restrict access to administrators.
    if (admin.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    // Find the requested user.
    const requestedUser = mockUsers.find(
        (user) => user.id === userId && user.role !== "ADMIN"
    );

    if (!requestedUser) {
        return res.status(404).json({
            success: false,
            message: "Requested user not found."
        });
    }

    // Remove sensitive password information.
    const { password, ...safeUser } = requestedUser;

    // Retrieve the user's profile.
    const profile = mockProfiles.find(
        (item) => item.userId === userId
    );

    // Retrieve the user's verification records.
    const verifications = mockVerifications.filter(
        (item) => item.userId === userId
    );

    return sendSuccess(res, {
        statusCode: 200,
        message: "User details retrieved successfully.",
        data: {
            user: {
                ...safeUser,
                profile: profile || null,
                verifications
            }
        }
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Admin Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * PATCH /admin/users/:userId/status
 *
 * Allows administrators to activate or suspend user accounts.
 */
router.patch("/admin/users/:userId/status", (req, res) => {
    const adminId = req.headers["x-mock-user-id"] || "user-001";
    const { userId } = req.params;
    const { status } = req.body;

    // Verify the current user.
    const admin = mockUsers.find((user) => user.id === adminId);

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Restrict access to administrators.
    if (admin.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    // Find the target user.
    const targetUser = mockUsers.find(
        (user) => user.id === userId && user.role !== "ADMIN"
    );

    if (!targetUser) {
        return res.status(404).json({
            success: false,
            message: "Target user not found."
        });
    }

    // Validate the requested status.
    const allowedStatuses = ["ACTIVE", "SUSPENDED"];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Status must be ACTIVE or SUSPENDED."
        });
    }

    // Update the account status.
    targetUser.status = status;
    targetUser.updatedAt = new Date().toISOString();

    // Return safe user details.
    const { password, ...safeUser } = targetUser;

    return sendSuccess(res, {
        statusCode: 200,
        message: `User account ${status.toLowerCase()} successfully.`,
        data: {
            user: safeUser
        }
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Admin Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /admin/reports
 *
 * Retrieves user reports for administrative review.
 */
router.get("/admin/reports", (req, res) => {
    const adminId = req.headers["x-mock-user-id"] || "user-001";

    // Verify the current user.
    const admin = mockUsers.find((user) => user.id === adminId);

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Restrict access to administrators.
    if (admin.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    const { status } = req.query;

    // Get pagination values.
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
        100,
        Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    // Copy reports before applying filters.
    let reports = [...mockReports];

    // Filter reports by status.
    if (status) {
        const allowedStatuses = ["PENDING", "REVIEWED", "RESOLVED", "DISMISSED"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report status."
            });
        }

        reports = reports.filter(
            (report) => report.status === status
        );
    }

    // Attach reporter and reported-user information.
    const enrichedReports = reports.map((report) => {
        const reporter = mockUsers.find(
            (user) => user.id === report.reporterId
        );

        const reportedUser = mockUsers.find(
            (user) => user.id === report.reportedUserId
        );

        return {
            ...report,
            reporter: reporter
                ? {
                    id: reporter.id,
                    fullName: reporter.fullName
                }
                : null,
            reportedUser: reportedUser
                ? {
                    id: reportedUser.id,
                    fullName: reportedUser.fullName
                }
                : null
        };
    });

    // Calculate pagination.
    const total = enrichedReports.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    const paginatedReports = enrichedReports.slice(
        startIndex,
        startIndex + limit
    );

    return sendSuccess(res, {
        statusCode: 200,
        message: "Reports retrieved successfully.",
        data: {
            reports: paginatedReports,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Admin Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /admin/reports/:reportId
 *
 * Retrieves an individual user report.
 */
router.get("/admin/reports/:reportId", (req, res) => {
    const adminId = req.headers["x-mock-user-id"] || "user-001";
    const { reportId } = req.params;

    // Verify the current user.
    const admin = mockUsers.find((user) => user.id === adminId);

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Restrict access to administrators.
    if (admin.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    // Find the requested report.
    const report = mockReports.find(
        (item) => item.id === reportId
    );

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Report not found."
        });
    }

    // Find reporter and reported user.
    const reporter = mockUsers.find(
        (user) => user.id === report.reporterId
    );

    const reportedUser = mockUsers.find(
        (user) => user.id === report.reportedUserId
    );

    const enrichedReport = {
        ...report,
        reporter: reporter
            ? {
                id: reporter.id,
                fullName: reporter.fullName,
                email: reporter.email
            }
            : null,
        reportedUser: reportedUser
            ? {
                id: reportedUser.id,
                fullName: reportedUser.fullName,
                email: reportedUser.email,
                status: reportedUser.status
            }
            : null
    };

    return sendSuccess(res, {
        statusCode: 200,
        message: "Report details retrieved successfully.",
        data: {
            report: enrichedReport
        }
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Admin Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * PATCH /admin/reports/:reportId
 *
 * Allows administrators to review and update reports.
 */
router.patch("/admin/reports/:reportId", (req, res) => {
    const adminId = req.headers["x-mock-user-id"] || "user-001";
    const { reportId } = req.params;
    const { status, adminNote } = req.body;

    // Verify the current user.
    const admin = mockUsers.find((user) => user.id === adminId);

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Restrict access to administrators.
    if (admin.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    // Find the report.
    const report = mockReports.find(
        (item) => item.id === reportId
    );

    if (!report) {
        return res.status(404).json({
            success: false,
            message: "Report not found."
        });
    }

    // Validate the requested status.
    const allowedStatuses = [
        "PENDING",
        "REVIEWED",
        "RESOLVED",
        "DISMISSED"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid report status."
        });
    }

    // Validate the administrator's note if provided.
    if (
        adminNote !== undefined &&
        (typeof adminNote !== "string" || adminNote.length > 1000)
    ) {
        return res.status(400).json({
            success: false,
            message: "Admin note must be a string of up to 1000 characters."
        });
    }

    // Update the report.
    report.status = status;
    report.adminNote = adminNote?.trim() || null;
    report.reviewedBy = adminId;
    report.reviewedAt = new Date().toISOString();

    return sendSuccess(res, {
        statusCode: 200,
        message: "Report updated successfully.",
        data: {
            report
        }
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 1
 * Module: Admin Analytics
 * Endpoint: GET /api/admin/analytics
 *
 * Purpose:
 * Provides platform-wide statistics for the admin dashboard.
 *
 * Temporary mock implementation.
 */

router.get("/admin/analytics", (req, res) => {
  // 1. Check admin authorization
  const userId = req.headers["x-mock-user-id"] || "user-001";

  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  if (user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  // 2. Exclude admin accounts from user statistics
  const regularUsers = mockUsers.filter(
    (item) => item.role !== "ADMIN"
  );

  // 3. Helper function for counting records by status
  const countByStatus = (items) => {
    return items.reduce((result, item) => {
      const status = item.status || "UNKNOWN";

      result[status] = (result[status] || 0) + 1;

      return result;
    }, {});
  };

  // 4. Calculate platform analytics
  const analytics = {
    users: {
      total: regularUsers.length,

      roomSeekers: regularUsers.filter(
        (item) => item.role === "ROOM_SEEKER"
      ).length,

      roomHavers: regularUsers.filter(
        (item) => item.role === "ROOM_HAVER"
      ).length,

      byStatus: countByStatus(regularUsers),
    },

    profiles: {
      total: mockProfiles.length,
    },

    accommodations: {
      total: mockAccommodations.length,
      byStatus: countByStatus(mockAccommodations),
    },

    matches: {
      total: mockMatches.length,
      byStatus: countByStatus(mockMatches),
    },

    interests: {
      total: mockInterests.length,
      byStatus: countByStatus(mockInterests),
    },

    reports: {
      total: mockReports.length,
      byStatus: countByStatus(mockReports),
    },

    verifications: {
      total: mockVerifications.length,
      byStatus: countByStatus(mockVerifications),
    },

    notifications: {
      total: mockNotifications.length,

      unread: mockNotifications.filter(
        (item) => item.isRead === false
      ).length,

      read: mockNotifications.filter(
        (item) => item.isRead === true
      ).length,
    },
  };

  // 5. Return analytics
  return sendSuccess(res, {
    message: "Platform analytics retrieved successfully.",
    data: analytics,
  });
});


/**
 * Get All Verification Submissions
 *
 * GET /admin/verifications
 *
 * Purpose:
 * Allows administrators to view all users' verification
 * submissions for review.
 *
 * Developer: Person 4
 * Temporary mock endpoint shared by all developers.
 */

router.get("/admin/verifications", (req, res) => {
  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Only administrators can view all verification submissions.
  if (user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  // Return all verification submissions.
  return sendSuccess(res, {
    statusCode: 200,
    message: "Verification submissions retrieved successfully.",
    data: {
      verifications: mockVerifications,
      total: mockVerifications.length,
    },
  });
});

/**
 * Review Verification Submission
 *
 * PATCH /admin/verifications/:verificationId
 *
 * Purpose:
 * Allows administrators to approve or reject
 * submitted verification documents.
 *
 * Developer: Person 4
 * Temporary mock endpoint shared by all developers.
 */

router.patch("/admin/verifications/:verificationId", (req, res) => {
  const { verificationId } = req.params;
  const { status, rejectionReason } = req.body;

  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current mock user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Only administrators can review verification submissions.
  if (user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  // Find the verification submission.
  const verification = mockVerifications.find(
    (item) => item.id === verificationId,
  );

  if (!verification) {
    return res.status(404).json({
      success: false,
      message: "Verification submission not found.",
    });
  }

  // Validate the review status.
  const allowedStatuses = ["APPROVED", "REJECTED"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be APPROVED or REJECTED.",
    });
  }

  // A rejection must include a reason.
  if (
    status === "REJECTED" &&
    (!rejectionReason ||
      typeof rejectionReason !== "string" ||
      !rejectionReason.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "A rejection reason is required.",
    });
  }

  // Update the verification record.
  verification.status = status;
  verification.reviewedAt = new Date().toISOString();
  verification.reviewedBy = user.id;
  verification.rejectionReason =
    status === "REJECTED" ? rejectionReason.trim() : null;

  return sendSuccess(res, {
    statusCode: 200,
    message: `Verification ${status.toLowerCase()} successfully.`,
    data: verification,
  });
});

/**
 * Get Matching Recommendations
 *
 * GET /matches/recommendations
 *
 * Purpose:
 * Recommends eligible accommodation listings based on
 * the current user's profile and preferences.
 *
 * Developer: Person 3
 * Temporary mock endpoint shared by all developers.
 */

// Lifestyle compatibility weights.
const lifestyleWeights = {
  cleanliness: 9,
  noiseTolerance: 7,
  visitors: 6,
  smoking: 5,
  pets: 4,
  workSchedule: 2,
  cookingHabits: 2,
};

/**
 * Calculate lifestyle compatibility.
 *
 * Compares two users' lifestyle preferences and
 * normalizes the weighted score to 100.
 */
const calculateLifestyleScore = (firstUserId, secondUserId) => {
  const firstLifestyle = mockLifestylePreferences.find(
    (item) => item.userId === firstUserId,
  );

  const secondLifestyle = mockLifestylePreferences.find(
    (item) => item.userId === secondUserId,
  );

  if (!firstLifestyle || !secondLifestyle) {
    return null;
  }

  let earnedScore = 0;
  let totalWeight = 0;

  for (const [field, weight] of Object.entries(lifestyleWeights)) {
    totalWeight += weight;

    if (firstLifestyle[field] === secondLifestyle[field]) {
      earnedScore += weight;
    }
  }

  return Math.round((earnedScore / totalWeight) * 100);
};

/**
 * Check whether a move-in date is within the
 * user's preferred flexibility period.
 */
const isMoveInDateCompatible = (
  preferredDate,
  availableDate,
  flexibilityDays = 0,
) => {
  const preferred = new Date(`${preferredDate}T00:00:00Z`);
  const available = new Date(`${availableDate}T00:00:00Z`);

  if (Number.isNaN(preferred.getTime()) || Number.isNaN(available.getTime())) {
    return false;
  }

  const difference = Math.abs(preferred - available);
  const differenceDays = difference / (1000 * 60 * 60 * 24);

  return differenceDays <= flexibilityDays;
};

/**
 * GET /matches/recommendations
 */
router.get("/matches/recommendations", (req, res) => {
  const userId = req.headers["x-mock-user-id"] || "user-001";

  // Find the current user.
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Find the user's profile.
  const profile = mockProfiles.find((item) => item.userId === user.id);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "User profile not found.",
    });
  }

  // Find the user's accommodation preferences.
  const preferences = mockPreferences.find((item) => item.userId === user.id);

  if (!preferences) {
    return res.status(404).json({
      success: false,
      message: "Please create your accommodation preferences first.",
    });
  }

  // Only Room Seekers receive accommodation recommendations.
  if (user.role !== "ROOM_SEEKER") {
    return res.status(403).json({
      success: false,
      message: "Only Room Seekers can receive accommodation recommendations.",
    });
  }

  // Filter eligible accommodation listings.
  const recommendations = mockAccommodations
    .filter((accommodation) => {
      // Only active listings are eligible.
      if (accommodation.status !== "ACTIVE") {
        return false;
      }

      // Exclude the current user's own listings.
      if (accommodation.userId === user.id) {
        return false;
      }

      // Check city.
      if (
        accommodation.city?.toLowerCase() !==
        preferences.preferredCity?.toLowerCase()
      ) {
        return false;
      }

      // Check preferred locations when supplied.
      if (
        preferences.preferredLocations?.length > 0 &&
        !preferences.preferredLocations.some(
          (location) =>
            location.toLowerCase() === (accommodation.area || "").toLowerCase(),
        )
      ) {
        return false;
      }

      // Check budget against rent contribution.
      if (
        accommodation.rentContribution < preferences.minBudget ||
        accommodation.rentContribution > preferences.maxBudget
      ) {
        return false;
      }

      // Check accommodation type.
      if (accommodation.accommodationType !== preferences.accommodationType) {
        return false;
      }

      // Check move-in date and flexibility.
      if (
        !isMoveInDateCompatible(
          preferences.moveInDate,
          accommodation.availableFrom,
          preferences.moveInFlexibilityDays,
        )
      ) {
        return false;
      }

      // Check accommodation gender restrictions.
      if (
        accommodation.genderPreference &&
        accommodation.genderPreference !== "ANY" &&
        accommodation.genderPreference !== profile.gender
      ) {
        return false;
      }

      // Get the accommodation owner's profile.
      const ownerProfile = mockProfiles.find(
        (item) => item.userId === accommodation.userId,
      );

      if (!ownerProfile) {
        return false;
      }

      // Apply optional preferred gender.
      if (
        preferences.preferredGender &&
        preferences.preferredGender !== "ANY" &&
        preferences.preferredGender !== ownerProfile.gender
      ) {
        return false;
      }

      // Apply optional age preference.
      if (
        preferences.minAge !== null &&
        preferences.minAge !== undefined &&
        ownerProfile.age < preferences.minAge
      ) {
        return false;
      }

      if (
        preferences.maxAge !== null &&
        preferences.maxAge !== undefined &&
        ownerProfile.age > preferences.maxAge
      ) {
        return false;
      }

      // Apply optional religion preference.
      if (
        preferences.preferredReligion &&
        preferences.preferredReligion !== ownerProfile.religion
      ) {
        return false;
      }

      return true;
    })
    .map((accommodation) => ({
      ...accommodation,
      compatibilityScore: calculateLifestyleScore(
        user.id,
        accommodation.userId,
      ),
    }))
    .sort(
      (first, second) =>
        (second.compatibilityScore ?? 0) - (first.compatibilityScore ?? 0),
    );

  // Find compatible potential flatmates.
  const flatmateRecommendations = mockProfiles
    .filter((candidateProfile) => {
      // A user cannot match with themselves.
      if (candidateProfile.userId === user.id) {
        return false;
      }

      // Find the candidate's user account.
      const candidateUser = mockUsers.find(
        (item) => item.id === candidateProfile.userId,
      );

      if (!candidateUser || candidateUser.status === "SUSPENDED") {
        return false;
      }

      // Find the candidate's accommodation preferences.
      const candidatePreferences = mockPreferences.find(
        (item) => item.userId === candidateUser.id,
      );

      if (!candidatePreferences) {
        return false;
      }

      // Both users must prefer the same city.
      if (
        preferences.preferredCity?.toLowerCase() !==
        candidatePreferences.preferredCity?.toLowerCase()
      ) {
        return false;
      }

      // Their preferred budget ranges must overlap.
      if (
        preferences.minBudget > candidatePreferences.maxBudget ||
        candidatePreferences.minBudget > preferences.maxBudget
      ) {
        return false;
      }

      // Both users must prefer the same accommodation type.
      if (
        preferences.accommodationType !== candidatePreferences.accommodationType
      ) {
        return false;
      }

      // Their preferred move-in dates must be compatible.
      const firstDate = new Date(`${preferences.moveInDate}T00:00:00Z`);
      const secondDate = new Date(
        `${candidatePreferences.moveInDate}T00:00:00Z`,
      );

      if (
        Number.isNaN(firstDate.getTime()) ||
        Number.isNaN(secondDate.getTime())
      ) {
        return false;
      }

      const dateDifference = Math.abs(firstDate - secondDate);
      const differenceDays = dateDifference / (1000 * 60 * 60 * 24);

      const combinedFlexibility =
        Number(preferences.moveInFlexibilityDays || 0) +
        Number(candidatePreferences.moveInFlexibilityDays || 0);

      if (differenceDays > combinedFlexibility) {
        return false;
      }

      // Check the current user's gender preference.
      if (
        preferences.preferredGender &&
        preferences.preferredGender !== "ANY" &&
        preferences.preferredGender !== candidateProfile.gender
      ) {
        return false;
      }

      // Check the candidate's gender preference.
      if (
        candidatePreferences.preferredGender &&
        candidatePreferences.preferredGender !== "ANY" &&
        candidatePreferences.preferredGender !== profile.gender
      ) {
        return false;
      }

      // Check the current user's age preference.
      if (
        preferences.minAge !== null &&
        preferences.minAge !== undefined &&
        candidateProfile.age < preferences.minAge
      ) {
        return false;
      }

      if (
        preferences.maxAge !== null &&
        preferences.maxAge !== undefined &&
        candidateProfile.age > preferences.maxAge
      ) {
        return false;
      }

      // Check the candidate's age preference.
      if (
        candidatePreferences.minAge !== null &&
        candidatePreferences.minAge !== undefined &&
        profile.age < candidatePreferences.minAge
      ) {
        return false;
      }

      if (
        candidatePreferences.maxAge !== null &&
        candidatePreferences.maxAge !== undefined &&
        profile.age > candidatePreferences.maxAge
      ) {
        return false;
      }

      // Check the current user's religion preference.
      if (
        preferences.preferredReligion &&
        preferences.preferredReligion !== candidateProfile.religion
      ) {
        return false;
      }

      // Check the candidate's religion preference.
      if (
        candidatePreferences.preferredReligion &&
        candidatePreferences.preferredReligion !== profile.religion
      ) {
        return false;
      }

      return true;
    })
    .map((candidateProfile) => ({
      userId: candidateProfile.userId,
      profile: candidateProfile,
      compatibilityScore: calculateLifestyleScore(
        user.id,
        candidateProfile.userId,
      ),
    }))
    .sort(
      (first, second) =>
        (second.compatibilityScore ?? 0) - (first.compatibilityScore ?? 0),
    );

  return sendSuccess(res, {
    statusCode: 200,
    message: "Matching recommendations retrieved successfully.",
    data: {
      accommodations: recommendations,
      flatmates: flatmateRecommendations,
      totals: {
        accommodations: recommendations.length,
        flatmates: flatmateRecommendations.length,
      },
    },
  });
});

/**
 * Person 3: Matching Module
 *
 * GET /matches/:userId/compatibility
 *
 * Retrieves the lifestyle compatibility score
 * between the current user and another user.
 */
router.get("/matches/:userId/compatibility", (req, res) => {
  const currentUserId = req.headers["x-mock-user-id"] || "user-001";
  const targetUserId = req.params.userId;

  // Prevent users from checking compatibility with themselves.
  if (currentUserId === targetUserId) {
    return res.status(400).json({
      success: false,
      message: "You cannot check compatibility with yourself.",
    });
  }

  // Find the current user.
  const currentUser = mockUsers.find((user) => user.id === currentUserId);

  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: "Current user not found.",
    });
  }

  // Find the target user.
  const targetUser = mockUsers.find((user) => user.id === targetUserId);

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: "Target user not found.",
    });
  }

  // Find both users' lifestyle preferences.
  const currentLifestyle = mockLifestylePreferences.find(
    (item) => item.userId === currentUserId,
  );

  const targetLifestyle = mockLifestylePreferences.find(
    (item) => item.userId === targetUserId,
  );

  if (!currentLifestyle || !targetLifestyle) {
    return res.status(404).json({
      success: false,
      message: "Lifestyle preferences are not available for both users.",
    });
  }

  // Calculate their lifestyle compatibility.
  const compatibilityScore = calculateLifestyleScore(
    currentUserId,
    targetUserId,
  );

  return sendSuccess(res, {
    statusCode: 200,
    message: "Compatibility score retrieved successfully.",
    data: {
      userId: currentUserId,
      targetUserId,
      compatibilityScore,
      matchingCriteria: {
        cleanliness:
          currentLifestyle.cleanliness === targetLifestyle.cleanliness,
        noiseTolerance:
          currentLifestyle.noiseTolerance === targetLifestyle.noiseTolerance,
        visitors: currentLifestyle.visitors === targetLifestyle.visitors,
        smoking: currentLifestyle.smoking === targetLifestyle.smoking,
        pets: currentLifestyle.pets === targetLifestyle.pets,
        workSchedule:
          currentLifestyle.workSchedule === targetLifestyle.workSchedule,
        cookingHabits:
          currentLifestyle.cookingHabits === targetLifestyle.cookingHabits,
      },
    },
  });
});


/**
 * Project: Flatmate NG
 * Developer: Person 3 (Matching Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /matches/:matchId
 *
 * Retrieves details of a specific match.
 */
router.get("/matches/:matchId", (req, res) => {
    const currentUserId = req.headers["x-mock-user-id"] || "user-001";
    const { matchId } = req.params;

    // Check that the current user exists.
    const currentUser = mockUsers.find(
        (user) => user.id === currentUserId
    );

    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Find the requested match.
    const match = mockMatches.find(
        (item) => item.id === matchId
    );

    if (!match) {
        return res.status(404).json({
            success: false,
            message: "Match not found."
        });
    }

    // Ensure the current user belongs to this match.
    if (
        match.userId !== currentUserId &&
        match.matchedUserId !== currentUserId
    ) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to view this match."
        });
    }

    // Identify the other participant.
    const otherUserId =
        match.userId === currentUserId
            ? match.matchedUserId
            : match.userId;

    return sendSuccess(res, {
        statusCode: 200,
        message: "Match details retrieved successfully.",
        data: {
            id: match.id,
            userId: currentUserId,
            matchedUserId: otherUserId,
            compatibilityScore: match.compatibilityScore,
            status: match.status,
            matchedProfile: match.matchedProfile
        }
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 3 (Matching Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /matches/:matchId/contact
 *
 * Retrieves another user's contact details only
 * after both users have mutually matched.
 */
router.get("/matches/:matchId/contact", (req, res) => {
    const currentUserId = req.headers["x-mock-user-id"] || "user-001";
    const { matchId } = req.params;

    // Check that the current user exists.
    const currentUser = mockUsers.find(
        (user) => user.id === currentUserId
    );

    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Find the requested match.
    const match = mockMatches.find(
        (item) => item.id === matchId
    );

    if (!match) {
        return res.status(404).json({
            success: false,
            message: "Match not found."
        });
    }

    // Ensure the current user belongs to this match.
    if (
        match.userId !== currentUserId &&
        match.matchedUserId !== currentUserId
    ) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to access this match."
        });
    }

    // Contact details are available only after a mutual match.
    if (match.status !== "MATCHED") {
        return res.status(403).json({
            success: false,
            message: "Contact details are only available after a mutual match."
        });
    }

    // Identify the other participant.
    const otherUserId =
        match.userId === currentUserId
            ? match.matchedUserId
            : match.userId;

    const matchedUser = mockUsers.find(
        (user) => user.id === otherUserId
    );

    if (!matchedUser) {
        return res.status(404).json({
            success: false,
            message: "Matched user not found."
        });
    }

    return sendSuccess(res, {
        statusCode: 200,
        message: "Contact details retrieved successfully.",
        data: {
            userId: matchedUser.id,
            fullName: matchedUser.fullName,
            email: matchedUser.email,
            phone: matchedUser.phone
        }
    });
});


/**
Project: Flatmate NG
Developer: Person 3 (Matching Module)
Shared mock endpoint maintained by Person 1.
GET /matches
Retrieves all matches belonging to the current user.
*/
router.get("/matches", (req, res) => {
  const currentUserId = req.headers["x-mock-user-id"] || "user-001";

  // Check that the current user exists.
  const currentUser = mockUsers.find((user) => user.id === currentUserId);

  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Get pagination values.
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
  );

  // Retrieve matches where the current user is either participant.
  const userMatches = mockMatches
    .filter(
      (match) =>
        match.userId === currentUserId || match.matchedUserId === currentUserId,
    )
    .map((match) => {
      // Determine the other participant.
      const otherUserId =
        match.userId === currentUserId ? match.matchedUserId : match.userId;

      return {
        id: match.id,
        userId: currentUserId,
        matchedUserId: otherUserId,
        compatibilityScore: match.compatibilityScore,
        status: match.status,
        matchedProfile: match.matchedProfile,
      };
    });

  // Calculate pagination.
  const total = userMatches.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const paginatedMatches = userMatches.slice(startIndex, startIndex + limit);

  return sendSuccess(res, {
    statusCode: 200,
    message: "Matches retrieved successfully.",
    data: {
      matches: paginatedMatches,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
  });
});

/**
 * Project: Flatmate NG
 * Developer: Person 3 (Interests Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * POST /interests/:userId
 *
 * Allows a user to express interest in another user.
 */
router.post("/interests/:userId", (req, res) => {
    const currentUserId = req.headers["x-mock-user-id"] || "user-001";
    const targetUserId = req.params.userId;

    // Check that the current user exists.
    const currentUser = mockUsers.find(
        (user) => user.id === currentUserId
    );

    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "Current user not found."
        });
    }

    // Prevent users from expressing interest in themselves.
    if (currentUserId === targetUserId) {
        return res.status(400).json({
            success: false,
            message: "You cannot express interest in yourself."
        });
    }

    // Check that the target user exists.
    const targetUser = mockUsers.find(
        (user) => user.id === targetUserId
    );

    if (!targetUser) {
        return res.status(404).json({
            success: false,
            message: "Target user not found."
        });
    }

    // Prevent duplicate pending interests.
    const existingInterest = mockInterests.find(
        (interest) =>
            interest.senderId === currentUserId &&
            interest.receiverId === targetUserId &&
            interest.status === "PENDING"
    );

    if (existingInterest) {
        return res.status(409).json({
            success: false,
            message: "You have already expressed interest in this user."
        });
    }

    // Create the new interest.
    const newInterest = {
        id: `interest-${Date.now()}`,
        senderId: currentUserId,
        receiverId: targetUserId,
        accommodationId: req.body?.accommodationId || null,
        status: "PENDING",
        createdAt: new Date().toISOString()
    };

    mockInterests.push(newInterest);

    return sendSuccess(res, {
        statusCode: 201,
        message: "Interest expressed successfully.",
        data: newInterest
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 3 (Interests Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * POST /interests/:userId/pass
 *
 * Allows a user to pass on a potential flatmate.
 */
router.post("/interests/:userId/pass", (req, res) => {
    const currentUserId = req.headers["x-mock-user-id"] || "user-001";
    const targetUserId = req.params.userId;

    // Check that the current user exists.
    const currentUser = mockUsers.find(
        (user) => user.id === currentUserId
    );

    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "Current user not found."
        });
    }

    // Prevent users from passing on themselves.
    if (currentUserId === targetUserId) {
        return res.status(400).json({
            success: false,
            message: "You cannot pass on yourself."
        });
    }

    // Check that the target user exists.
    const targetUser = mockUsers.find(
        (user) => user.id === targetUserId
    );

    if (!targetUser) {
        return res.status(404).json({
            success: false,
            message: "Target user not found."
        });
    }

    // Check whether an action already exists for this user pair.
    const existingInterest = mockInterests.find(
        (interest) =>
            interest.senderId === currentUserId &&
            interest.receiverId === targetUserId
    );

    if (existingInterest) {
        return res.status(409).json({
            success: false,
            message: "You have already taken an action on this user."
        });
    }

    // Record the pass action.
    const passAction = {
        id: `interest-${Date.now()}`,
        senderId: currentUserId,
        receiverId: targetUserId,
        accommodationId: null,
        status: "PASSED",
        createdAt: new Date().toISOString()
    };

    mockInterests.push(passAction);

    return sendSuccess(res, {
        statusCode: 201,
        message: "User passed successfully.",
        data: passAction
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 3 (Interests Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /interests/sent
 *
 * Retrieves all interests sent by the current user.
 */
router.get("/interests/sent", (req, res) => {
    const currentUserId = req.headers["x-mock-user-id"] || "user-001";

    // Check that the current user exists.
    const currentUser = mockUsers.find(
        (user) => user.id === currentUserId
    );

    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "Current user not found."
        });
    }

    // Get pagination values.
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
        100,
        Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    // Retrieve interests sent by the current user.
    const sentInterests = mockInterests
        .filter((interest) => interest.senderId === currentUserId)
        .map((interest) => {
            const recipient = mockUsers.find(
                (user) => user.id === interest.receiverId
            );

            const recipientProfile = mockProfiles.find(
                (profile) => profile.userId === interest.receiverId
            );

            return {
                ...interest,
                recipient: recipient
                    ? {
                        id: recipient.id,
                        fullName: recipient.fullName,
                        email: recipient.email,
                        profile: recipientProfile || null
                    }
                    : null
            };
        });

    // Calculate pagination.
    const total = sentInterests.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    const paginatedInterests = sentInterests.slice(
        startIndex,
        startIndex + limit
    );

    return sendSuccess(res, {
        statusCode: 200,
        message: "Sent interests retrieved successfully.",
        data: {
            interests: paginatedInterests,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 3 (Interests Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /interests/received
 *
 * Retrieves all interests received by the current user.
 */
router.get("/interests/received", (req, res) => {
    const currentUserId = req.headers["x-mock-user-id"] || "user-001";

    // Check that the current user exists.
    const currentUser = mockUsers.find(
        (user) => user.id === currentUserId
    );

    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "Current user not found."
        });
    }

    // Get pagination values.
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
        100,
        Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    // Retrieve interests received by the current user.
    const receivedInterests = mockInterests
        .filter((interest) => interest.receiverId === currentUserId)
        .map((interest) => {
            const sender = mockUsers.find(
                (user) => user.id === interest.senderId
            );

            const senderProfile = mockProfiles.find(
                (profile) => profile.userId === interest.senderId
            );

            return {
                ...interest,
                sender: sender
                    ? {
                        id: sender.id,
                        fullName: sender.fullName,
                        profile: senderProfile || null
                    }
                    : null
            };
        });

    // Calculate pagination.
    const total = receivedInterests.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    const paginatedInterests = receivedInterests.slice(
        startIndex,
        startIndex + limit
    );

    return sendSuccess(res, {
        statusCode: 200,
        message: "Received interests retrieved successfully.",
        data: {
            interests: paginatedInterests,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }
    });
});



/**
 * Project: Flatmate NG
 * Developer: Person 4 (Blocks Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * POST /blocks/:userId
 *
 * Allows the current user to block another user.
 */
router.post("/blocks/:userId", (req, res) => {
    const currentUserId = req.headers["x-mock-user-id"] || "user-001";
    const { userId } = req.params;

    // Check whether the current user exists.
    const currentUser = mockUsers.find(
        (user) => user.id === currentUserId
    );

    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "Current user not found."
        });
    }

    // Prevent users from blocking themselves.
    if (currentUserId === userId) {
        return res.status(400).json({
            success: false,
            message: "You cannot block yourself."
        });
    }

    // Check whether the target user exists.
    const targetUser = mockUsers.find(
        (user) => user.id === userId
    );

    if (!targetUser) {
        return res.status(404).json({
            success: false,
            message: "User to block not found."
        });
    }

    // Prevent duplicate block records.
    const existingBlock = mockBlocks.find(
        (block) =>
            block.blockerId === currentUserId &&
            block.blockedUserId === userId
    );

    if (existingBlock) {
        return res.status(409).json({
            success: false,
            message: "You have already blocked this user."
        });
    }

    // Create the block record.
    const newBlock = {
        id: `block-${Date.now()}`,
        blockerId: currentUserId,
        blockedUserId: userId,
        createdAt: new Date().toISOString()
    };

    mockBlocks.push(newBlock);

    return sendSuccess(res, {
        statusCode: 201,
        message: "User blocked successfully.",
        data: newBlock
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Blocks Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * DELETE /blocks/:userId
 *
 * Allows the current user to unblock another user.
 */
router.delete("/blocks/:userId", (req, res) => {
    const currentUserId = req.headers["x-mock-user-id"] || "user-001";
    const { userId } = req.params;

    // Check whether the current user exists.
    const currentUser = mockUsers.find(
        (user) => user.id === currentUserId
    );

    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "Current user not found."
        });
    }

    // Check whether the target user exists.
    const targetUser = mockUsers.find(
        (user) => user.id === userId
    );

    if (!targetUser) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Find the existing block record.
    const blockIndex = mockBlocks.findIndex(
        (block) =>
            block.blockerId === currentUserId &&
            block.blockedUserId === userId
    );

    if (blockIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "You have not blocked this user."
        });
    }

    // Remove the block record.
    mockBlocks.splice(blockIndex, 1);

    return sendSuccess(res, {
        statusCode: 200,
        message: "User unblocked successfully.",
        data: null
    });
});


/**
 * Project: Flatmate NG
 * Developer: Person 4 (Blocks Module)
 * Shared mock endpoint maintained by Person 1.
 *
 * GET /blocks/me
 *
 * Retrieves all users blocked by the current user.
 */
router.get("/blocks/me", (req, res) => {
    const currentUserId = req.headers["x-mock-user-id"] || "user-001";

    // Check whether the current user exists.
    const currentUser = mockUsers.find(
        (user) => user.id === currentUserId
    );

    if (!currentUser) {
        return res.status(404).json({
            success: false,
            message: "Current user not found."
        });
    }

    // Get pagination values.
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
        100,
        Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );

    // Retrieve blocked users.
    const blockedUsers = mockBlocks
        .filter((block) => block.blockerId === currentUserId)
        .map((block) => {
            const blockedUser = mockUsers.find(
                (user) => user.id === block.blockedUserId
            );

            const blockedProfile = mockProfiles.find(
                (profile) => profile.userId === block.blockedUserId
            );

            return {
                id: block.id,
                blockedUserId: block.blockedUserId,
                createdAt: block.createdAt,
                user: blockedUser
                    ? {
                        id: blockedUser.id,
                        fullName: blockedUser.fullName,
                        profile: blockedProfile || null
                    }
                    : null
            };
        });

    // Calculate pagination.
    const total = blockedUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;

    const paginatedBlocks = blockedUsers.slice(
        startIndex,
        startIndex + limit
    );

    return sendSuccess(res, {
        statusCode: 200,
        message: "Blocked users retrieved successfully.",
        data: {
            blocks: paginatedBlocks,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        }
    });
});


export default router;
