// API Configuration
// Uses environment variable VITE_API_BASE_URL, defaults to localhost
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper function to construct full image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/default-project.png";
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // If it's a relative path, construct the full URL
  if (imagePath.startsWith("/uploads/")) {
    return `${API_BASE.replace("/api", "")}${imagePath}`;
  }
  
  // If it's just a filename, construct the full URL
  return `${API_BASE.replace("/api", "")}/uploads/${imagePath}`;
};
