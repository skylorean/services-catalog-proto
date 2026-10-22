import { useEffect, useState } from 'react';
import { AddedToast } from './AddedToast.tsx';
import { CartSheet } from './CartSheet.tsx';
import { Catalog } from './Catalog.tsx';
import { CompletePage } from './CompletePage.tsx';
import { CustomerForm } from './CustomerForm.tsx';
import { PendingPage } from './PendingPage.tsx';
import { ServiceSheet } from './ServiceSheet.tsx';
import type { CartItem } from './cart.ts';
import type { Customer, Service } from './data.ts';

const PAYMENT_CHECK_MS = 2500;

type Screen = 'catalog' | 'pending' | 'complete';

export function App() {
  const [screen, setScreen] = useState<Screen>('catalog');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [openService, setOpenService] = useState<Service | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [toast, setToast] = useState<CartItem | null>(null);

  useEffect(() => {
    if (screen !== 'pending') return;
    const timer = setTimeout(() => setScreen('complete'), PAYMENT_CHECK_MS);
    return () => clearTimeout(timer);
  }, [screen]);

  const addToCart = (item: CartItem) => {
    setCart((items) => [...items, item]);
    setOpenService(null);
    setToast(item);
  };
  const removeFromCart = (id: number) => setCart((items) => items.filter((item) => item.id !== id));
  const openCart = () => {
    setToast(null);
    setCartOpen(true);
  };
  const saveCustomer = (next: Customer) => {
    setCustomer(next);
    setCustomerFormOpen(false);
  };
  const checkout = () => {
    setCartOpen(false);
    setScreen('pending');
  };
  const backToCatalog = () => {
    setCart([]);
    setCustomer(null);
    setScreen('catalog');
  };

  if (screen === 'pending' && customer) return <PendingPage cart={cart} customer={customer} />;
  if (screen === 'complete' && customer) return <CompletePage cart={cart} customer={customer} onBack={backToCatalog} />;

  return (
    <>
      <Catalog
        cart={cart}
        toast={toast && <AddedToast item={toast} onClose={() => setToast(null)} onOpenCart={openCart} />}
        onOpenService={setOpenService}
        onOpenCart={openCart}
      />
      {openService && <ServiceSheet service={openService} onClose={() => setOpenService(null)} onAdd={addToCart} />}
      {cartOpen && !customerFormOpen && (
        <CartSheet
          cart={cart}
          customer={customer}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onEditCustomer={() => setCustomerFormOpen(true)}
          onCheckout={checkout}
        />
      )}
      {customerFormOpen && <CustomerForm customer={customer} onClose={() => setCustomerFormOpen(false)} onSave={saveCustomer} />}
    </>
  );
}
