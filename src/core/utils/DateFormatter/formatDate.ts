export default function formatDate(date: any) {
  // Check if the date parameter is a string
  if (typeof date !== "string") {
    console.error("Invalid date parameter:", date);
    return null;
  }

  const newdate = new Date(date);

  // Check if the Date object is valid
  if (isNaN(newdate.getTime())) {
    console.error("Invalid date:", date);
    return null;
  }

  // Define options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  // Format the date using toLocaleDateString
  const formattedDate = newdate.toLocaleDateString("en-US", options);
  return formattedDate;
}
