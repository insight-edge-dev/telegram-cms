export function parseButtons(input: string) {
  if (!input) return [];

  const rows = input
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);

  return rows.map((row) =>
    row.split("|").map((btn) => {
      const parts = btn
        .split("-")
        .map((p) => p.trim())
        .filter(Boolean);

      let text = parts[0] || "";
      let url = parts[1] || "";
      let style = "default";

      // 🔥 AUTO FIX: only URL diya ho
      if (!url && text.startsWith("http")) {
        url = text;
        text = "Open Link";
      }

      // 🔥 STYLE EXTRACT (safe)
      const stylePart = parts.find((p) =>
        p.toLowerCase().startsWith("style:")
      );

      if (stylePart) {
        style = stylePart.replace("style:", "").trim().toLowerCase();
      }

      // 🔥 FINAL SAFETY (Telegram crash prevent)
      if (!text) text = "Button";
      if (!url) url = "#";

      return { text, url, style };
    })
  );
}