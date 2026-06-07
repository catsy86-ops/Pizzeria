import { 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
}

export default function StripeCheckoutForm({ amount, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    // Symulacja opóźnienia serwera dla realizmu UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message || 'Wystąpił błąd płatności');
      setProcessing(false);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // W realnej aplikacji tutaj wysyłamy paymentMethod.id na backend
      setProcessing(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Lock size={10} />
            Dane Karty (SSL Secure)
          </label>
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4 opacity-50" />
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#111827',
                  '::placeholder': { color: '#9ca3af' },
                  fontFamily: 'Inter, system-ui, sans-serif',
                },
                invalid: { color: '#ef4444' },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-3"
        >
          <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
          {error}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-red-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-950/50 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        {processing ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Przetwarzanie...
          </>
        ) : (
          <>
            Zapłać {amount.toFixed(2)} zł
            <ShieldCheck className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </>
        )}
      </button>
      
      <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
        Twoje dane są szyfrowane i bezpieczne. <br /> Nie przechowujemy numerów kart na naszych serwerach.
      </p>
    </form>
  );
}
