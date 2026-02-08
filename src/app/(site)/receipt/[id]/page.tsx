
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import ReceiptClient from "./ReceiptClient";
import { Metadata } from "next";

export const revalidate = 0; // Ensure fresh data

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Limba-Receipt-${id}`,
    description: "Your official order receipt from LIMBA.",
  };
}

import { Check, Clock, Package, Search, Truck } from "lucide-react";

// ... existing imports

const steps = [
  { id: 'paid', label: 'Paid', icon: Check },
  { id: 'queued', label: 'Queued', icon: Clock },
  { id: 'quality_check', label: 'Quality Check', icon: Search },
  { id: 'in_transit', label: 'In Transit', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Package },
];

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const reference = resolvedParams.id;

  const orderQuery = `*[_type == "order" && orderNumber == $reference][0]{
    ...,
    items[]{
      ...,
      "productImage": product->image
    }
  }`;
  const order = await client.fetch(orderQuery, { reference });

  if (!order) {
    return notFound();
  }

  const currentStatus = order.status || 'paid';
  const currentStepIndex = steps.findIndex(s => s.id === currentStatus);
  const isCancelled = currentStatus === 'cancelled';
  const CurrentIcon = steps[currentStepIndex]?.icon;

  const receiptSettings = await client.fetch(`*[_type == "receiptSettings"][0]{
      brandName,
      contactEmail,
      introText,
      footerText
    }`) || {};

  const brandName = receiptSettings.brandName || 'LIMBA';
  const introText = receiptSettings.introText || 'Thank you for your order. We are honored to craft this piece of heritage for you.';
  const footerText = receiptSettings.footerText || 'Thank you for choosing LIMBA. We are honoring the past while embracing the future.';

  return (
    <div className="min-h-screen bg-white text-black font-serif p-0 md:p-8 flex flex-col items-center print:p-0 print:min-h-0 print:block">
      <div id="receipt-container" className="w-full max-w-2xl p-6 md:p-8 shadow-none print:shadow-none print:p-0 print:w-full print:max-w-none" style={{ backgroundColor: '#ffffff' }}>
        
        {/* Header */}
        <div className="text-center border-b pb-8 mb-8" style={{ borderColor: '#e5e7eb' }}>
          <h1 className="text-4xl tracking-[0.2em] font-normal mb-2 text-black">{brandName.toUpperCase()}</h1>
          <p className="text-xs tracking-[0.2em]" style={{ color: '#6b7280' }}>ANCESTRAL ELEGANCE</p>
        </div>

        {/* Order Status Tracker */}
        {!isCancelled && (
           <div className="mb-12 w-full">
             {/* Desktop Horizontal Tracker */}
             <div className="hidden md:block">
               <div className="flex items-center justify-between relative">
                 {/* Progress Bar Background */}
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 -z-10" style={{ backgroundColor: '#f3f4f6' }} />
                 
                 {/* Active Progress Bar */}
                 <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-black -z-10 transition-all duration-500" 
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} 
                 />
                 
                 {steps.map((step, index) => {
                   const Icon = step.icon;
                   const isCompleted = index <= currentStepIndex;
                   const isCurrent = index === currentStepIndex;
                   
                   return (
                     <div key={step.id} className="flex flex-col items-center px-2" style={{ backgroundColor: '#ffffff' }}>
                       <div 
                         className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300`}
                         style={{ 
                           backgroundColor: isCompleted ? '#000000' : '#ffffff',
                           borderColor: isCompleted ? '#000000' : '#e5e7eb',
                           color: isCompleted ? '#ffffff' : '#d1d5db'
                         }}
                       >
                         <Icon size={14} />
                       </div>
                       <span 
                         className="text-[10px] uppercase tracking-wider mt-2 font-medium transition-colors duration-300"
                         style={{ color: isCurrent ? '#000000' : '#9ca3af' }}
                       >
                         {step.label}
                       </span>
                     </div>
                   );
                 })}
               </div>
             </div>

             {/* Mobile Vertical Tracker */}
             <div className="md:hidden flex flex-col space-y-0 pl-2">
               {steps.map((step, index) => {
                 const Icon = step.icon;
                 const isCompleted = index <= currentStepIndex;
                 const isCurrent = index === currentStepIndex;
                 const isLast = index === steps.length - 1;
                 
                 return (
                   <div key={step.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                     {/* Vertical Line */}
                     {!isLast && (
                       <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200" />
                     )}
                     {!isLast && index < currentStepIndex && (
                       <div className="absolute left-4 top-8 bottom-0 w-px bg-black" />
                     )}
                     
                     <div 
                       className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300 shrink-0`}
                       style={{ 
                         backgroundColor: isCompleted ? '#000000' : '#ffffff',
                         borderColor: isCompleted ? '#000000' : '#e5e7eb',
                         color: isCompleted ? '#ffffff' : '#d1d5db'
                       }}
                     >
                       <Icon size={14} />
                     </div>
                     
                     <div className="pt-1.5">
                        <span 
                          className="text-xs uppercase tracking-wider font-medium transition-colors duration-300 block"
                          style={{ color: isCurrent ? '#000000' : isCompleted ? '#374151' : '#9ca3af' }}
                        >
                          {step.label}
                        </span>
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        )}

        {/* Mobile Status (Simple View) */}
        {!isCancelled && (
            <div className="mb-8 md:hidden p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: '#f9fafb' }}>
                <span className="text-xs uppercase tracking-wider" style={{ color: '#6b7280' }}>Current Status</span>
                <span className="text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2">
                    {CurrentIcon && <CurrentIcon size={16} />}
                    {steps[currentStepIndex]?.label || currentStatus}
                </span>
            </div>
        )}
        
        {isCancelled && (
            <div className="mb-12 border p-4 rounded-lg text-center" style={{ backgroundColor: '#fef2f2', borderColor: '#fee2e2', color: '#dc2626' }}>
                <p className="font-medium">This order has been cancelled.</p>
            </div>
        )}

        {/* Customer Info */}
        <div className="mb-8">
          <p className="text-lg mb-1 text-black">Dear {order.customerName},</p>
          <p className="text-lg text-black">{introText}</p>
          
          <div className="my-6">
             <p className="text-sm uppercase tracking-wider" style={{ color: '#6b7280' }}>Order Reference: {reference}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse mb-8">
          <tbody>
            {order.items.map((item: any, index: number) => {
              const imageSrc = item.imageUrl || (item.productImage ? urlFor(item.productImage).url() : null);
              
              return (
              <tr key={index} className="border-b" style={{ borderColor: '#f3f4f6' }}>
                <td className="py-4 w-20">
                   {imageSrc && (
                     <div className="relative w-16 h-16 rounded-lg overflow-hidden print:visible">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img 
                         src={`${imageSrc}?w=128&auto=format`} 
                         alt={item.name} 
                         className="object-cover w-full h-full"
                         style={{ 
                           printColorAdjust: 'exact', 
                           WebkitPrintColorAdjust: 'exact' 
                         }}
                       />
                     </div>
                   )}
                </td>
                <td className="py-4 px-4 align-middle">
                    <div className="font-bold" style={{ color: '#111827' }}>{item.name}</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>Qty: {item.quantity}</div>
                </td>
                <td className="py-4 text-right font-bold align-middle" style={{ color: '#111827' }}>
                    ₵{item.price.toFixed(2)}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-between items-center border-t border-black pt-6 mt-6 mb-8">
            <span className="font-bold text-xl text-black">Total</span>
            <span className="font-bold text-2xl text-black">₵{order.totalAmount.toFixed(2)}</span>
        </div>

        {/* Shipping Details */}
        <div className="p-6 rounded-lg mb-8 print:bg-transparent print:p-0 print:border" style={{ backgroundColor: '#f9fafb' }}>
            <h3 className="text-sm uppercase tracking-wider mb-2 font-bold" style={{ color: '#111827' }}>Shipping Details</h3>
            <p style={{ color: '#374151' }}>{order.address}</p>
            <p style={{ color: '#374151' }}>{order.phone}</p>
        </div>

        {/* Footer */}
        <div className="text-center border-t pt-8 text-xs" style={{ borderColor: '#e5e7eb', color: '#9ca3af' }}>
          <p>{footerText}</p>
        </div>

      </div>

      <ReceiptClient reference={reference} customerName={order.customerName} />
    </div>
  );
}
