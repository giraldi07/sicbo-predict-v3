import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DiceValue } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatIDR = (number: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

export const calculateSum = (d1: DiceValue, d2: DiceValue, d3: DiceValue) => d1 + d2 + d3;
export const isBig = (sum: number) => sum >= 11 && sum <= 17;
export const isSmall = (sum: number) => sum >= 4 && sum <= 10;
export const isOdd = (sum: number) => sum % 2 !== 0;
export const isEven = (sum: number) => sum % 2 === 0;
export const isLeopard = (d1: DiceValue, d2: DiceValue, d3: DiceValue) => d1 === d2 && d2 === d3;
