import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function EventTypes() {
  return (
    <section className="py-12 md:py-24 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="font-spartan text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6">Event Types</h2>
        <p className="text-center text-charcoal/70 mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">
          We design multiple formats to create the right environment for meaningful connection.
        </p>
        
        <Tabs defaultValue="retreats" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-10">
            <TabsTrigger className="px-1 md:px-4 py-1.5 md:py-2 text-xs md:text-sm" value="retreats">Private Retreats</TabsTrigger>
            <TabsTrigger className="px-1 md:px-4 py-1.5 md:py-2 text-xs md:text-sm" value="dinners">Deal-Maker Dinners</TabsTrigger>
            <TabsTrigger className="px-1 md:px-4 py-1.5 md:py-2 text-xs md:text-sm" value="global">Global Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="retreats" className="bg-taupe p-4 md:p-8 rounded-lg min-h-[300px] md:h-[420px] flex flex-col">
            <div className="flex-grow mb-4">
              <h3 className="font-spartan text-xl md:text-2xl font-bold mb-2 md:mb-4">Private Retreats</h3>
              <p className="mb-3 md:mb-4 text-sm md:text-base">
                Intimate 3-5 day experiences in exceptional locations. Limited to 12-15 participants, our retreats blend structured programming with ample space for serendipity.
              </p>
            </div>
            <div className="aspect-video bg-[url('/private_retreat.jpg')] bg-center bg-cover rounded-md"></div>
          </TabsContent>
          
          <TabsContent value="dinners" className="bg-taupe p-4 md:p-8 rounded-lg min-h-[300px] md:h-[420px] flex flex-col">
            <div className="flex-grow mb-4">
              <h3 className="font-spartan text-xl md:text-2xl font-bold mb-2 md:mb-4">Deal-Maker Dinners</h3>
              <p className="mb-3 md:mb-4 text-sm md:text-base">
                Carefully curated evening gatherings bringing together complementary founders, investors, and industry leaders. Limited to 8-10 participants per dinner.
              </p>
            </div>
            <div className="aspect-video bg-[url('/Dinner-Phuket.jpg')] bg-center bg-cover rounded-md"></div>
          </TabsContent>
          
          <TabsContent value="global" className="bg-taupe p-4 md:p-8 rounded-lg min-h-[300px] md:h-[420px] flex flex-col">
            <div className="flex-grow mb-4">
              <h3 className="font-spartan text-xl md:text-2xl font-bold mb-2 md:mb-4">Global Events</h3>
              <p className="mb-3 md:mb-4 text-sm md:text-base">
                Quarterly signature events in global cities featuring thought leadership, strategic networking, and exclusive experiences. Limited to 50-100 select participants.
              </p>
            </div>
            <div className="aspect-video bg-[url('/boat.jpg')] bg-center bg-cover rounded-md"></div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
} 