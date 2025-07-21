import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForget, setShowForget] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        alert(`Logged in as ${role}`);

        // Store in BOTH sessionStorage and localStorage
        sessionStorage.setItem("role", role);
        localStorage.setItem("userRole", role);

        navigate(
          role === "admin"
            ? "/admin"
            : role === "employer"
            ? "/employer"
            : "/user"
        );
      } else {
        alert("No user data found!");
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async () => {
    if (!forgetEmail) return alert("Please enter your email address");

    try {
      await sendPasswordResetEmail(auth, forgetEmail);
      alert("Password reset email sent! Please check your inbox.");
      setShowForget(false);
    } catch (err) {
      alert(`Failed to send reset email: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-300 via-white to-yellow-200 text-black">
      <div className="bg-white p-10 rounded shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6">Login</h1>

        {!showForget ? (
          <form onSubmit={handleLogin} className="space-y-4">
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
              <label className="block mb-1">Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-yellow-300 hover:border-yellow-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black p-3 rounded hover:bg-yellow-500 transition-all"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Enter Your Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-yellow-300 hover:border-yellow-300"
                value={forgetEmail}
                onChange={(e) => setForgetEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleForgetPassword}
              className="w-full bg-yellow-400 text-black p-3 rounded hover:bg-yellow-500 transition-all"
            >
              Send Reset Email
            </button>
          </div>
        )}

        <div className="text-center mt-4">
          <button
            className="text-yellow-500 underline"
            onClick={() => setShowForget(!showForget)}
          >
            {showForget ? "Back to Login" : "Forgot Password?"}
          </button>
        </div>
      </div>
    </div>
  );
}
