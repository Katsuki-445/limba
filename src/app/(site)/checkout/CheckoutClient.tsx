"use client";

import { useCart } from "@/context/CartContext";
import GlassCard from "@/components/GlassCard";
import Image from "next/image";
import sanityLoader from "@/lib/sanityLoader";
import Link from "next/link";
import { ArrowLeft, Lock, Minus, Plus, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";

export default function CheckoutClient() {
  const { cartItems, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stable reference for this session
  const reference = useMemo(() => {
    const random13 = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
    const random3 = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
    return `LB-${random13}-${random3}`;
  }, []);

  const [shippingDetails, setShippingDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const isFormValid = useMemo(() => {
    const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'phone'];
    return requiredFields.every(field => shippingDetails[field as keyof typeof shippingDetails].trim() !== "");
  }, [shippingDetails]);

  const config = {
    reference: reference,
    email: shippingDetails.email,
    amount: Math.round(totalPrice * 100), // Amount is in kobo (or lowest currency unit)
    currency: "GHS",
    channels: ['mobile_money', 'card'],
    publicKey: "pk_test_0c07199a2fc0577f34d8ee850728aa7ffd592fdd",
    firstname: shippingDetails.firstName,
    lastname: shippingDetails.lastName,
    phone: shippingDetails.phone,
    metadata: {
        custom_fields: [
            {
                display_name: "Shipping Address",
                variable_name: "shipping_address",
                value: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.zip}`
            },
            {
                display_name: "Ordered Items",
                variable_name: "items",
                value: cartItems.map(i => `${i.name} (Qty: ${i.quantity})`).join(' | ')
            }
        ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (paystackRef: any) => {
    try {
      // Verify payment and update order status to 'Paid'
      // Also triggers email alert
      await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: paystackRef.reference,
        }),
      });
    } catch (error) {
      console.error('Payment verification failed:', error);
      // We still redirect because payment was successful on Paystack side
    }
    
    clearCart();
    router.push(`/checkout/success?reference=${paystackRef.reference}`);
  };

  const onClose = () => {
    console.log("Payment closed");
    setIsSubmitting(false);
  };

  const handlePayment = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);

    try {
        // 1. Create Order as 'Pending' immediately
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                email: shippingDetails.email,
                phone: shippingDetails.phone,
                address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state}, ${shippingDetails.zip}`,
                items: cartItems,
                totalAmount: totalPrice,
                reference: reference,
                status: 'pending'
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        // 2. Initialize Paystack Payment
        initializePayment({onSuccess, onClose});
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to process checkout. Please try again.');
        setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl">Your Cart is Empty</h1>
          <p className="text-white/60 text-lg max-w-md mx-auto">
            It looks like you haven't added any pieces of heritage to your collection yet.
          </p>
          <Link 
            href="/collections" 
            className="inline-block bg-white text-black font-medium py-4 px-8 rounded-full hover:bg-white/90 transition-colors uppercase tracking-wide text-sm"
          >
            Explore Collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Link href="/collections" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} className="mr-2" />
        Continue Shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="space-y-8">
          <h1 className="font-serif text-4xl mb-8">Order Summary</h1>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <GlassCard key={item._id} className="p-4 flex gap-4 items-center">
                <div className="relative w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    loader={sanityLoader}
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder={item.lqip ? "blur" : "empty"}
                    blurDataURL={item.lqip}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center bg-white/5 rounded-full p-1">
                        <button 
                            onClick={() => updateQuantity(item._id, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item._id, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Plus size={12} />
                        </button>
                    </div>
                    <button 
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                        title="Remove Item"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-yellow-400">₵{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between text-white/60">
              <span>Subtotal</span>
              <span>₵{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <span className="uppercase tracking-widest text-sm">Total</span>
              <span className="font-serif text-3xl text-yellow-400">₵{totalPrice.toFixed(2)}</span>
            </div>
          </GlassCard>
        </div>

        {/* Checkout Form */}
        <div>
          <h2 className="font-serif text-4xl mb-8">Shipping & Payment</h2>
          <GlassCard className="p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-4">Contact Information</h3>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={shippingDetails.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={shippingDetails.firstName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={shippingDetails.lastName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleChange}
                  placeholder="+233 ..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                />
              </div>

              <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-4 mt-6">Shipping Address</h3>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleChange}
                  placeholder="123 Heritage St"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">City</label>
                  <input 
                    type="text" 
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">State/Region</label>
                  <input 
                    type="text" 
                    name="state"
                    value={shippingDetails.state}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Zip/Postal Code (Optional)</label>
                <input 
                  type="text" 
                  name="zip"
                  value={shippingDetails.zip}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                />
              </div>
            </div>

            <button 
                onClick={handlePayment}
                disabled={!isFormValid || isSubmitting}
                className={`w-full font-medium py-4 rounded-full transition-all uppercase tracking-wide text-sm mt-6 flex items-center justify-center gap-2 group ${
                    isFormValid && !isSubmitting
                    ? "bg-white text-black hover:bg-white/90" 
                    : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
            >
              <Lock size={16} className={`${isFormValid && !isSubmitting ? "text-black/50 group-hover:text-black" : "text-white/30"} transition-colors`} />
              {isSubmitting ? "Processing..." : (isFormValid ? `Pay ₵${totalPrice.toFixed(2)}` : "Enter Details to Pay")}
            </button>
            
            <p className="text-center text-xs text-white/30 flex items-center justify-center gap-1">
              <Lock size={12} />
              Secured by Paystack
            </p>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
