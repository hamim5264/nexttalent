import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenance = async () => {
    if (!settings) return;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from("settings")
        .update({ maintenance_mode: !settings.maintenance_mode })
        .eq("id", settings.id)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error("Error updating maintenance mode:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="text-center text-[#555555]">Loading settings...</p>;
  }

  return (
    <div className="p-6 bg-[#FFFAEC] min-h-screen">
      <div className="flex justify-center mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#333333] border-2 border-[#FFD24C] rounded-full px-5 py-1 shadow-[0_0_10px_#FFD24C]">
          Admin Settings
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl border-2 border-[#FFD24C] shadow-[0_0_12px_#FFD24C] space-y-6 max-w-xl mx-auto">
        <SettingItem label="Platform Name" value={settings.platform_name} />
        <SettingItem label="Support Email" value={settings.support_email} />

        <div>
          <h3 className="text-lg font-medium text-[#333333]">
            Maintenance Mode
          </h3>
          <p className="text-[#555555] mb-3">
            {settings.maintenance_mode ? "Enabled" : "Disabled"}
          </p>
          <button
            className="px-5 py-2 border-2 border-[#FFD24C] rounded-full text-[#333333] font-semibold hover:bg-[#FFE9B5] shadow-[0_0_8px_#FFD24C] transition"
            onClick={toggleMaintenance}
            disabled={updating}
          >
            {updating
              ? "Updating..."
              : settings.maintenance_mode
              ? "Disable Maintenance Mode"
              : "Enable Maintenance Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ label, value }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#333333]">{label}</h3>
      <p className="text-[#555555]">{value}</p>
    </div>
  );
}
