"use client";

export default function ButtonPreview({ keyboard }: any) {
  const colorMap: any = {
    green: "bg-green-600",
    blue: "bg-blue-600",
    red: "bg-red-600",
    default: "bg-gray-700",
  };

  return (
    <div className="space-y-2">
      {keyboard.map((row: any[], i: number) => (
        <div key={i} className="flex gap-2">
          {row.map((btn, j) => (
            <button
              key={j}
              className={`px-4 py-2 rounded-lg text-white text-sm ${
                colorMap[btn.style]
              }`}
            >
              {btn.text}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}