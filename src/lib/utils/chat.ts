export function generateChatId(prefix = "C") {
  const now = new Date();

  const year = String(now.getFullYear()).slice(-2); // 26
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "P" : "A";

  const hour12 = String(hours % 12 || 12).padStart(2, "0");

  const datetimeString = `${year}${month}${day}-${hour12}${minutes}${seconds}`;

  return `${prefix}${datetimeString}${ampm}`;
}