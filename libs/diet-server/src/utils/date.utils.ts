
export function getISODate() {
  return new Date().toISOString();
}

export function displayISODate(dateString: string): string {
  const date = new Date(dateString);

  // Get the individual components of the date
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Define month names
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Format the date as desired
  const formattedDate = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} - ${day} ${monthNames[monthIndex]}, ${year}`;

  return formattedDate;
}
