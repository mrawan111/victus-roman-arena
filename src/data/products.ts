import boxingGloves from "@/assets/boxing-gloves.jpg";
import mmaGear from "@/assets/mma-gear.jpg";
import muayThai from "@/assets/muay-thai.jpg";
import kickboxing from "@/assets/kickboxing.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "Boxing" | "MMA" | "Muay Thai" | "Kickboxing";
  description: string;
  features: string[];
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Victus Pro Boxing Gloves",
    price: 129.99,
    image: boxingGloves,
    category: "Boxing",
    description: "Professional-grade boxing gloves with superior hand protection and comfort. Inspired by the strength of Roman gladiators.",
    features: [
      "Premium leather construction",
      "Multi-layer foam padding",
      "Secure wrist support",
      "Available in multiple sizes"
    ],
    inStock: true
  },
  {
    id: "2",
    name: "Centurion MMA Gloves",
    price: 89.99,
    image: mmaGear,
    category: "MMA",
    description: "Versatile MMA training gloves designed for grappling and striking. Built for champions.",
    features: [
      "Flexible fingerless design",
      "Reinforced knuckle protection",
      "Breathable materials",
      "Competition-approved"
    ],
    inStock: true
  },
  {
    id: "3",
    name: "Gladiator Muay Thai Shorts",
    price: 59.99,
    image: muayThai,
    category: "Muay Thai",
    description: "Traditional Muay Thai shorts with modern performance fabric. Designed for maximum mobility.",
    features: [
      "Lightweight polyester",
      "Elastic waistband",
      "Traditional design",
      "Quick-dry technology"
    ],
    inStock: true
  },
  {
    id: "4",
    name: "Legion Kickboxing Shin Guards",
    price: 74.99,
    image: kickboxing,
    category: "Kickboxing",
    description: "Premium shin guards offering maximum protection without sacrificing mobility.",
    features: [
      "Contoured fit",
      "High-density foam",
      "Secure straps",
      "Reinforced instep"
    ],
    inStock: true
  },
  {
    id: "5",
    name: "Elite Boxing Hand Wraps",
    price: 24.99,
    image: boxingGloves,
    category: "Boxing",
    description: "Essential hand protection for training and competition. Professional quality.",
    features: [
      "180-inch length",
      "Elastic cotton blend",
      "Thumb loop and hook-and-loop closure",
      "Machine washable"
    ],
    inStock: true
  },
  {
    id: "6",
    name: "Warrior MMA Training Shorts",
    price: 54.99,
    image: mmaGear,
    category: "MMA",
    description: "High-performance training shorts designed for intense MMA workouts.",
    features: [
      "4-way stretch fabric",
      "Reinforced stitching",
      "Internal drawstring",
      "Side splits for mobility"
    ],
    inStock: true
  },
  {
    id: "7",
    name: "Champion Muay Thai Pads",
    price: 119.99,
    image: muayThai,
    category: "Muay Thai",
    description: "Professional training pads for precision striking practice.",
    features: [
      "Curved design",
      "Shock-absorbing padding",
      "Secure grip handles",
      "Durable construction"
    ],
    inStock: false
  },
  {
    id: "8",
    name: "Imperial Kickboxing Headgear",
    price: 94.99,
    image: kickboxing,
    category: "Kickboxing",
    description: "Premium head protection for training and sparring sessions.",
    features: [
      "Full-coverage protection",
      "Adjustable fit",
      "Clear visibility",
      "Moisture-wicking lining"
    ],
    inStock: true
  }
];
