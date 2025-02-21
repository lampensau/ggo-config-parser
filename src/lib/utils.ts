import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and merges Tailwind classes using tailwind-merge
 * @param inputs - Class names to combine
 * @returns Merged class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if a string is in the format "DD-M-YYYY HH:mm:ss"
 */
export const isValidConfigDateFormat = (dateString: string): boolean => {
  if (!dateString) return false;

  const pattern = /^\d{1,2}-\d{1,2}-\d{4} \d{2}:\d{2}:\d{2}$/;
  if (!pattern.test(dateString)) return false;

  const [datePart, timePart] = dateString.split(' ');
  const [day, month, year] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  // Validate ranges
  return (
    month >= 1 && month <= 12 &&
    day >= 1 && day <= 31 &&
    year >= 1970 &&
    hours >= 0 && hours <= 23 &&
    minutes >= 0 && minutes <= 59 &&
    seconds >= 0 && seconds <= 59
  );
}; 