export class DateConverter {
  static convertToHumanReadable(isoString: string): string {
    const date = new Date(isoString);

    // Define options for date formatting
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    // Format date and time separately to achieve the desired format
    const formattedDate = date.toLocaleDateString(undefined, options);
    const formattedTime = date.toLocaleTimeString(undefined, options);
    console.log(`${formattedDate}, ${formattedTime}`);
    // Combine the formatted date and time
    return `${formattedDate}, ${formattedTime}`;
  }
}
