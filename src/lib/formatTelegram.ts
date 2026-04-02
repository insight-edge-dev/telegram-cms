export function formatTelegram(keyboard: any[][]) {
  const styleMap: any = {
    green: "🟢",
    blue: "🔵",
    red: "🔴",
  };

  return keyboard.map(row =>
    row.map(btn => ({
      text: `${styleMap[btn.style] || ""} ${btn.text}`.trim(),
      url: btn.url,
    }))
  );
}