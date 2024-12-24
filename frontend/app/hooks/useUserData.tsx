'use client'
import { useState, useEffect } from "react";

// Define the types for the user data
interface User {
  // Define the user properties you expect from the API
  id: string;
  name: string;
  email: string;
}

interface UserData {
  user: User;
  jwt: string;
}

const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/cookie", {
          method: "GET",
          credentials: "same-origin", // Ensure cookies are sent with the request
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "An error occurred");
        }
      } catch (err) {
        setError("Something went wrong while fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Run the effect only once on mount

  return { userData, loading, error };
};

export default useUserData;
