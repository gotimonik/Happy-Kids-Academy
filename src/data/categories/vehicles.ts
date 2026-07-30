import type { LearningCategory } from "@/types/category";
import { namedItems } from "./_helpers";

const NAMES = [
  "Car", "Bus", "Bicycle", "Motorcycle", "Train", "Aeroplane", "Ship", "Truck", "Taxi",
  "Ambulance", "Fire engine", "Police car", "Tractor", "Scooter", "Helicopter", "Rocket",
  "Boat", "Submarine", "Metro", "Auto rickshaw",
] as const;

const ICONS = [
  "🚗", "🚌", "🚲", "🏍️", "🚆", "✈️", "🚢", "🚚", "🚕", "🚑",
  "🚒", "🚓", "🚜", "🛵", "🚁", "🚀", "⛵", "🛥️", "🚇", "🛺",
] as const;

export const vehiclesCategory: LearningCategory = {
  slug: "vehicles",
  icon: "🚗",
  title: "Vehicles",
  subtitle: "Road • rail • air • water",
  color: "#2D3436",
  trace: false,
  items: namedItems("vehicles", NAMES, ICONS, "Vehicle"),
};
