export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_signature: boolean;
  is_popular: boolean;
  contains_egg: boolean;
  dietary: string[];
  type: string[];
  image_url?: string;
  created_at: string;
}

export interface Reservation {
  id?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  created_at?: string;
}
