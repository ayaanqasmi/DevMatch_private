'use client'
import useUserData from "../hooks/useUserData"; // Adjust the path as necessary

const UserProfile = () => {
  const { userData, loading, error } = useUserData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
};

export default UserProfile;
