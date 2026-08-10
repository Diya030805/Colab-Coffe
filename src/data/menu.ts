export interface MenuItem {
  name: string;
  isPopular?: boolean;
  containsEgg?: boolean;
  isSignature?: boolean;
  dietary?: string[];
  type?: string[];
}

export interface MenuCategory {
  title: string;
  image: string;
  items: MenuItem[];
}

export const foodVegItems: MenuItem[] = [
  { name: "Nachos with Avocado Mousse", dietary: ['Vegetarian', 'Gluten-Free'], type: ['Savory Snacks'] },
  { name: "House Fries (Salted)", dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'], type: ['Savory Snacks'] },
  { name: "Creamy Avocado Bruschetta with Devil Egg", containsEgg: true, dietary: ['Vegetarian'], type: ['Savory Snacks'] },
  { name: "Spanish Omelette", containsEgg: true, dietary: ['Vegetarian'], type: ['Savory Snacks'] },
  { name: "Mushroom & Cheese Omelette", containsEgg: true, dietary: ['Vegetarian'], type: ['Savory Snacks'] },
  { name: "Wild Mushroom and Cheese Sandwich", dietary: ['Vegetarian'], type: ['Savory Snacks'] },
  { name: "Polo Pesto Pizza", dietary: ['Vegetarian'], type: [] },
  { name: "Ravioli", dietary: ['Vegetarian'], type: [] },
  { name: "Pizza Rustica", dietary: ['Vegetarian'], type: [] },
];

export const foodNonVegItems: MenuItem[] = [
  { name: "Diavolo Chicken Pizza", isPopular: true, isSignature: true, dietary: [], type: [] },
  { name: "BBQ Chicken Panuozzo", dietary: [], type: ['Savory Snacks'] },
  { name: "Pepperoni Pizza", dietary: [], type: [] },
  { name: "Bacon & Cheese Omelette", dietary: [], type: ['Savory Snacks'] },
  { name: "Chicken Strips", dietary: [], type: ['Savory Snacks'] },
  { name: "Grilled Chicken", dietary: ['Gluten-Free'], type: ['Savory Snacks'] },
  { name: "Fish Fingers", dietary: [], type: ['Savory Snacks'] },
  { name: "Fish Fry", dietary: [], type: ['Savory Snacks'] },
  { name: "BBQ Chicken Sandwich", dietary: [], type: ['Savory Snacks'] },
  { name: "Spicy Chicken Wrap", dietary: [], type: ['Savory Snacks'] },
  { name: "Stuffed Buns", dietary: [], type: ['Savory Snacks'] },
];

export const beverageItems: MenuItem[] = [
  { name: "Turmeric Latte", isPopular: true, isSignature: true, dietary: ['Vegetarian', 'Gluten-Free'], type: ['Coffee'] },
  { name: "Biscoff Latte", dietary: ['Vegetarian'], type: ['Coffee'] },
  { name: "Classic Cold Coffee", dietary: ['Vegetarian', 'Gluten-Free'], type: ['Coffee'] },
  { name: "Hazelnut Cold Coffee", dietary: ['Vegetarian', 'Gluten-Free'], type: ['Coffee'] },
  { name: "Biscoff Cold Coffee", dietary: ['Vegetarian'], type: ['Coffee'] },
  { name: "Biscoff Milkshake", dietary: ['Vegetarian'], type: [] },
  { name: "Classic Mojito", dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'], type: [] },
  { name: "Ginger Tulsi Tea", dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'], type: ['Tea'] },
  { name: "Hazelnut Hot Chocolate", dietary: ['Vegetarian', 'Gluten-Free'], type: [] },
  { name: "Moccachino", dietary: ['Vegetarian', 'Gluten-Free'], type: ['Coffee'] },
  { name: "Dark Coffee (Espresso-based)", dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'], type: ['Coffee'] },
];

export const dessertItems: MenuItem[] = [
  { name: "Chocolate Cheesecake", dietary: ['Vegetarian'], type: ['Pastries'] },
  { name: "Blueberry Cheesecake", dietary: ['Vegetarian'], type: ['Pastries'] },
  { name: "Biscoff Cheesecake", dietary: ['Vegetarian'], type: ['Pastries'] },
  { name: "Tiramisu", dietary: ['Vegetarian'], type: ['Pastries'] },
  { name: "Crepes", dietary: ['Vegetarian'], type: ['Pastries'] },
  { name: "Cake of the Day", dietary: ['Vegetarian'], type: ['Pastries'] },
];
