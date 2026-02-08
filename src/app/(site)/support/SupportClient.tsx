"use client";

import { useState, useRef } from "react";
import GlassCard from "@/components/GlassCard";
import { Mail, MessageCircle, Phone, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import emailjs from '@emailjs/browser';

interface SupportClientProps {
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  whatsappMessage: string;
}

export default function SupportClient({ 
  supportEmail, 
  supportPhone, 
  whatsappNumber, 
  whatsappMessage 
}: SupportClientProps) {
  
  const form = useRef<HTMLFormElement>(null);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const mailtoUrl = `mailto:${supportEmail}`;
  const telUrl = `tel:${supportPhone.replace(/\s+/g, '')}`;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      // 1. Save to Sanity (Database)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to save message');

      // 2. Send Email via EmailJS
      // Note: We need a Public Key. I've added a placeholder or we can use an environment variable.
      // Usually passed as the 3rd argument to sendForm, or 4th to send.
      // If you have a public key, replace 'YOUR_PUBLIC_KEY' or add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to .env.local
      if (form.current) {
        await emailjs.sendForm(
          'service_rdtfgkg', 
          'template_b6f9qtc', 
          form.current, 
          'B40D86GE6yfkhsHlF'
        );
      }

      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      // If Sanity worked but EmailJS failed, we might still want to show success or a partial warning?
      // For now, let's show error to ensure they know it might not have gone through fully.
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="font-serif text-5xl md:text-6xl mb-6">Concierge Support</h1>
        <p className="text-white/60 font-light text-lg">
          We are here to assist you with your inquiries, from sizing to shipping.
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-2 md:gap-6 w-full">
        <a href={mailtoUrl} className="contents">
          <GlassCard className="flex flex-col items-center text-center py-6 md:py-12 gap-2 md:gap-4 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-500 cursor-pointer px-1 md:px-6">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Mail className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="w-full overflow-hidden">
              <h3 className="font-serif text-xs md:text-xl mb-1">Email Us</h3>
              <p className="text-[9px] md:text-sm text-white/50 break-words leading-tight">{supportEmail}</p>
            </div>
          </GlassCard>
        </a>

        <a href={telUrl} className="contents">
          <GlassCard className="flex flex-col items-center text-center py-6 md:py-12 gap-2 md:gap-4 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-500 cursor-pointer px-1 md:px-6">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Phone className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="w-full">
              <h3 className="font-serif text-xs md:text-xl mb-1">Call Us</h3>
              <p className="text-[9px] md:text-sm text-white/50">{supportPhone}</p>
            </div>
          </GlassCard>
        </a>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contents">
          <GlassCard className="flex flex-col items-center text-center py-6 md:py-12 gap-2 md:gap-4 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:border-white/30 transition-all duration-500 cursor-pointer px-1 md:px-6">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <MessageCircle className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="w-full">
              <h3 className="font-serif text-xs md:text-xl mb-1">WhatsApp</h3>
              <p className="text-[9px] md:text-sm text-white/50 leading-tight">Chat with us</p>
            </div>
          </GlassCard>
        </a>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-16 w-full max-w-md"
      >
        <GlassCard className="p-8">
            <h3 className="font-serif text-2xl mb-6 text-center">Send a Message</h3>
            <form ref={form} onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Name</label>
                    <input name="name" type="text" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Email</label>
                    <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Message</label>
                    <textarea name="message" rows={4} required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                </div>
                
                {status === 'success' && (
                  <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 p-3 rounded-lg">
                    <CheckCircle size={16} />
                    <span>Message sent successfully! We'll be in touch soon.</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
                    <AlertCircle size={16} />
                    <span>Failed to send message. Please try again or email us directly.</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-white text-black font-sans font-medium uppercase tracking-widest text-xs hover:bg-white/90 transition-colors rounded-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? 'Sending...' : 'Send Inquiry'}
                </button>
            </form>
        </GlassCard>
      </motion.div>
    </main>
  );
}
