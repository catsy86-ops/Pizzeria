import type { Topping, Pizza } from '../types';

export const TOPPINGS: Topping[] = [
  { id: '1', name: 'Pepperoni', price: 8.0 },
  { id: '2', name: 'Pieczarki', price: 6.0 },
  { id: '3', name: 'Cebula', price: 4.0 },
  { id: '4', name: 'Salami', price: 8.0 },
  { id: '5', name: 'Boczek', price: 10.0 },
  { id: '6', name: 'Extra Ser', price: 8.0 },
  { id: '7', name: 'Czarne Oliwki', price: 4.0 },
  { id: '8', name: 'Zielona Papryka', price: 4.0 },
  { id: '9', name: 'Ananas', price: 6.0 },
  { id: '10', name: 'Szpinak', price: 6.0 },
];

export const MENU_PIZZAS: Pizza[] = [
  {
    id: 'm1',
    name: 'Margherita',
    description: 'Klasyczny sos pomidorowy, świeża mozzarella i bazylia.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=800&q=80',
    toppings: [],
  },
  {
    id: 'm2',
    name: 'Pepperoni Feast',
    description: 'Podwójne pepperoni i podwójna mozzarella.',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    toppings: [TOPPINGS[0]],
  },
  {
    id: 'm3',
    name: 'Veggie Supreme',
    description: 'Pieczarki, cebula, zielona papryka i czarne oliwki.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    toppings: [TOPPINGS[1], TOPPINGS[2], TOPPINGS[7], TOPPINGS[6]],
  },
  {
    id: 'm4',
    name: 'Mięsna Uczta',
    description: 'Pepperoni, salami i boczek.',
    price: 48.00,
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
    toppings: [TOPPINGS[0], TOPPINGS[3], TOPPINGS[4]],
  },
  {
    id: 'm5',
    name: 'Hawajska',
    description: 'Szynka i ananas.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    toppings: [TOPPINGS[8]],
  },
];
