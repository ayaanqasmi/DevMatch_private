'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Ensures cookies like JWT are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || "Login failed");
        return;
      }

      const data = await response.json();
      console.log("Login successful, token:", data.token);

      // Navigate to dashboard or homepage
      router.push("/dashboard");
    } catch (err) {
      console.error("Network error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {error && (
        <div
          role="alert"
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
        noValidate
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          aria-label="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          aria-label="Password"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className={`w-full py-2 rounded ${
            isLoading
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
