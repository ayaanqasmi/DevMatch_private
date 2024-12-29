'use client'

import useUserData from "../hooks/useUserData"; // Adjust the path as necessary
import UserItems from "@/components/UserItems";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

const UserProfile = () => {
  const { userData, loading, error } = useUserData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/cookie", {
        method: "DELETE",
      });
      if (response.ok) {
        window.location.href = "/login"; // Redirect to login or landing page
      } else {
        alert("Failed to log out. Please try again.");
      }
    } catch (err) {
      alert("An error occurred during logout.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Welcome, {userData?.user.user.username}!
          </h1>
          <p className="text-gray-600 mt-2">Here's an overview of your account.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-700">Actions</h2>
            <ul className="text-sm text-gray-600 mt-2 space-y-2">
              <li>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-blue-500 hover:underline">Log Out</button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
                    <p className="text-gray-600 mt-2">
                      Are you sure you want to log out? You will need to log in again to access your account.
                    </p>
                    <div className="mt-4 flex justify-end space-x-4">
                      <AlertDialogCancel asChild>
                        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                          Cancel
                        </button>
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <button
                          onClick={handleLogout}
                          className={`px-4 py-2 text-white rounded ${
                            isLoggingOut ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                          }`}
                          disabled={isLoggingOut}
                        >
                          {isLoggingOut ? "Logging out..." : "Log Out"}
                        </button>
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
              <li>
                <a href="/dashboard/profile" className="text-blue-500 hover:underline">
                  View Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <UserItems />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
