export default function dateFormatter(date: any) {
  if (date && date.$isDayjsObject) {
    // Convert Day.js object to Date object
    date = date.toDate();
  }

  if (!(date instanceof Date)) {
    return "";
  }

  // Format the date as mm/dd/yyyy
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return formattedDate;
}
