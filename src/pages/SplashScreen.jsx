import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import supabase from "../supabaseClient";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setTimeout(async () => {
        if (user) {
          let storedRole = localStorage.getItem("userRole");

          if (!storedRole) {
            const { data, error } = await supabase
              .from("user_profiles")
              .select("role")
              .eq("firebase_uid", user.uid)
              .single();

            if (!error && data) {
              storedRole = data.role;
              localStorage.setItem("userRole", storedRole);
            }
          }

          if (storedRole === "admin") navigate("/admin");
          else if (storedRole === "employer") navigate("/employer");
          else if (storedRole === "user") navigate("/user");
          else navigate("/landing");
        } else {
          navigate("/landing");
        }
      }, 3000);
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#FFE9B5] to-[#FFD966]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center text-[#333333]"
      >
        <h1 className="text-6xl font-extrabold tracking-wide mb-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            NextTalent
          </motion.span>
        </h1>

        <motion.p
          className="text-xl italic text-[#555555]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Discover. Develop. Deliver.
        </motion.p>
      </motion.div>
    </div>
  );
}
