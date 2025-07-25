export default function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center border-2 border-transparent hover:border-[#FFD24C] transition-all w-full sm:w-auto">
      <h3 className="text-base sm:text-lg font-medium text-[#333333]">
        {title}
      </h3>
      <p className="text-2xl sm:text-3xl font-bold mt-2" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
