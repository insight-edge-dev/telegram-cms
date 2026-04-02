"use client";

export default function ChannelSelector({ channels, selected, setSelected }: any) {
  const toggleChannel = (username: string) => {
    if (selected.includes(username)) {
      setSelected(selected.filter((c: string) => c !== username));
    } else {
      setSelected([...selected, username]);
    }
  };

  return (
    <div className="space-y-2">
      {channels.map((ch: any) => (
        <div
          key={ch.id}
          onClick={() => toggleChannel(ch.username)}
          className={`p-3 rounded-lg cursor-pointer ${
            selected.includes(ch.username)
              ? "bg-green-600"
              : "bg-gray-800"
          }`}
        >
          <p>{ch.name}</p>
          <p className="text-sm text-gray-400">{ch.username}</p>
        </div>
      ))}
    </div>
  );
}