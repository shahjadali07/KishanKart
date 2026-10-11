import React from 'react';
import { ProduceCard } from './ProduceCard';

const mockProduce = [
  {
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
    name: 'Red Hybrid Tomatoes',
    grade: 'Grade A',
    location: 'Bakshi Ka Talab',
    farmer: 'Rajesh Kumar',
    verified: true,
    quantity: '500 kg',
    price: '₹28/kg',
    distance: '12 km'
  },
  {
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
    name: 'Chipsona Potatoes',
    grade: 'Grade A',
    location: 'Malihabad',
    farmer: 'Amit Patel',
    verified: true,
    quantity: '1,200 kg',
    price: '₹19/kg',
    distance: '18 km'
  },
  {
    image: '/fresh_green_peas.jpg',
    name: 'Fresh Green Peas',
    grade: 'Grade A',
    location: 'Kakori',
    farmer: 'Ram Charan',
    verified: true,
    quantity: '300 kg',
    price: '₹42/kg',
    distance: '14 km'
  },
  {
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
    name: 'Sharbati Golden Wheat',
    grade: 'Grade A+',
    location: 'Mohanlalganj',
    farmer: 'Sunita Devi',
    verified: true,
    quantity: '800 kg',
    price: '₹24/kg',
    distance: '22 km'
  },
  {
    image: '/green_cabbage.jpg',
    name: 'Green Cabbage',
    grade: 'Grade B',
    location: 'Gosainganj',
    farmer: 'Ramesh Yadav',
    verified: true,
    quantity: '600 kg',
    price: '₹12/kg',
    distance: '8 km'
  },
  {
    image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&q=80',
    name: 'Red Onions',
    grade: 'Grade A',
    location: 'Itaunja',
    farmer: 'Kavita Singh',
    verified: false,
    quantity: '900 kg',
    price: '₹45/kg',
    distance: '20 km'
  },
  {
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&q=80',
    name: 'Cauliflower',
    grade: 'Grade A',
    location: 'BKT',
    farmer: 'Surendra Nath',
    verified: true,
    quantity: '400 kg',
    price: '₹18/kg',
    distance: '11 km'
  },
  {
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=800&q=80',
    name: 'Carrots',
    grade: 'Grade A+',
    location: 'Malihabad',
    farmer: 'Anita Verma',
    verified: true,
    quantity: '750 kg',
    price: '₹30/kg',
    distance: '16 km'
  },
  {
    image: '/fresh_green_peas.jpg',
    name: 'Sweet Peas',
    grade: 'Grade B+',
    location: 'Kakori',
    farmer: 'Mohammad Ali',
    verified: false,
    quantity: '200 kg',
    price: '₹38/kg',
    distance: '15 km'
  },
  {
    image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=800&q=80',
    name: 'Garlic Bulbs',
    grade: 'Grade A',
    location: 'Mohanlalganj',
    farmer: 'Sanjay Kumar',
    verified: true,
    quantity: '150 kg',
    price: '₹120/kg',
    distance: '24 km'
  },
  {
    image: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=800&q=80',
    name: 'Eggplants (Brinjal)',
    grade: 'Grade B',
    location: 'Gosainganj',
    farmer: 'Vikas Sharma',
    verified: true,
    quantity: '450 kg',
    price: '₹22/kg',
    distance: '9 km'
  },
  {
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&q=80',
    name: 'Bananas (Raw)',
    grade: 'Grade A',
    location: 'Itaunja',
    farmer: 'Kamla Devi',
    verified: true,
    quantity: '500 dozen',
    price: '₹40/dz',
    distance: '19 km'
  }
];

export function ProduceGrid() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Explore Fresh Farm Produce</h2>
        <p className="text-sm text-gray-500 mt-0.5">Fresh harvest lots directly from certified farmers near you with farm-gate quality guarantee.</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-3 py-1 rounded-full bg-[#114232] text-white text-[11px] font-semibold whitespace-nowrap tracking-wide">All Crops (42)</button>
        <button className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-[11px] font-semibold whitespace-nowrap tracking-wide shadow-sm">Tomatoes (14)</button>
        <button className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-[11px] font-semibold whitespace-nowrap tracking-wide shadow-sm">Potatoes (12)</button>
        <button className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-[11px] font-semibold whitespace-nowrap tracking-wide shadow-sm">Onions (8)</button>
        <button className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-[11px] font-semibold whitespace-nowrap tracking-wide shadow-sm">Green Peas (5)</button>
        
        <div className="w-px h-4 bg-gray-200 mx-2 self-center"></div>
        
        <button className="px-3 py-1 rounded-full bg-emerald-50/50 text-emerald-800 border border-emerald-100/50 text-[11px] font-semibold whitespace-nowrap tracking-wide">{'<'} 25 km</button>
        <button className="px-3 py-1 rounded-full bg-emerald-50/50 text-emerald-800 border border-emerald-100/50 text-[11px] font-semibold whitespace-nowrap tracking-wide">Grade A</button>

        <div className="flex-1 min-w-4"></div>
        <button className="px-3 py-1 text-gray-500 text-[11px] font-medium whitespace-nowrap border border-transparent hover:border-gray-200 rounded-full">Sort: <span className="text-gray-900 font-semibold">Nearest Distance</span></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockProduce.map((produce, i) => (
          <ProduceCard key={i} {...produce} />
        ))}
      </div>
    </div>
  );
}
