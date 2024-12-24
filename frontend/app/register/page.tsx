'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || "Failed to register");
        return;
      }

      console.log("User registered successfully:", formData);
      try {
        router.push("/login");
      } catch (routerError) {
        console.error("Router navigation failed:", routerError);
        setError("Redirection failed. Please try manually navigating to /login.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Failed to register");
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
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          aria-label="Username"
          className="w-full p-2 border rounded"
          required
        />
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
