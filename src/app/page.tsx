import { MarketTicker } from '@/components/farmer/MarketTicker';
import { Navbar } from '@/components/layout/Navbar';
import { FarmerHeader } from '@/components/farmer/FarmerHeader';
import { FarmerStats } from '@/components/farmer/FarmerStats';
import { ProduceGrid } from '@/components/farmer/ProduceGrid';
import { MatchCard } from '@/components/farmer/MatchCard';
import { BulkOrderCard } from '@/components/farmer/BulkOrderCard';
import { BuyerRequirementCard } from '@/components/farmer/BuyerRequirementCard';
import { DeliveryCard } from '@/components/farmer/DeliveryCard';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <MarketTicker />
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <FarmerHeader />
        <FarmerStats />
        <ProduceGrid />
        <MatchCard />
        <BulkOrderCard />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BuyerRequirementCard />
          <DeliveryCard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
