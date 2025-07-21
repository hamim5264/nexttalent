import React from "react";

export default function MaintenanceMode() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300">
      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-yellow-400 max-w-md text-justify">
        <h1 className="text-3xl font-bold mb-4 text-yellow-500 text-center">
          Maintenance Mode Active
        </h1>
        <p className="text-gray-700 mb-3">
          Our platform is currently undergoing scheduled maintenance to bring
          you a better experience. We are working hard to improve our services.
        </p>
        <p className="text-gray-700 mb-4">
          Please check back later. We apologize for any inconvenience.
        </p>
        <p className="text-sm text-gray-600">
          Thank you for your patience and support. <br />
          <span className="font-semibold">— NextTalent Team</span>
        </p>
      </div>
    </div>
  );
}
