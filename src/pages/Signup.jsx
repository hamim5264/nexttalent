import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        createdAt: new Date(),
      });

      alert("Signup successful!");
      navigate(role === "employer" ? "/employer" : "/user");
    } catch (error) {
      alert(`Signup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-300 via-white to-yellow-200 text-black">
      <form
        onSubmit={handleSignup}
        className="bg-white p-10 rounded shadow-2xl w-full max-w-md space-y-4"
      >
        <h1 className="text-4xl font-bold text-center mb-6">Sign Up</h1>

        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            className="w-full p-3 border rounded bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-yellow-300 hover:border-yellow-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-yellow-300 hover:border-yellow-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Password{" "}
            <span className="text-sm text-gray-500">(Min 6 characters)</span>
          </label>
          <input
            type="password"
            className="w-full p-3 border rounded bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-yellow-300 hover:border-yellow-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Sign Up as</label>
          <select
            className="w-full p-3 border rounded bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-yellow-300 hover:border-yellow-300"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="employer">Employer</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-black p-3 rounded hover:bg-yellow-500 transition-all"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
