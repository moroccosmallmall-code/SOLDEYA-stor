import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, User, StoreSettings, OrderItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialProducts';
import { calculateComparePrice, calculateWholesalePrice } from '../utils/pricing';

interface StoreContextType {
  products: Product[];
  categories: typeof INITIAL_CATEGORIES;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  orders: Order[];
  orderCounter: number;
  currentUser: User | null;
  storeSettings: StoreSettings;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
  
  // Auth methods
  loginOwnerDirect: (password: string) => boolean;
  loginCustomer: (email: string) => { success: boolean; message?: string };
  registerCustomer: (data: { email: string; fullName: string; phone?: string; city?: string; address?: string }) => { success: boolean; message?: string };
  updateCustomerProfile: (data: Partial<User>) => void;
  logout: () => void;
  
  // Product methods
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  
  // Order methods
  createOrder: (orderData: {
    customerName: string;
    phone: string;
    city: string;
    address: string;
    items: OrderItem[];
    notes?: string;
  }) => { success: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  retrySyncOrder: (orderId: string) => Promise<boolean>;

  // UI State Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCustomerAccountModalOpen: boolean;
  setIsCustomerAccountModalOpen: (open: boolean) => void;
  isOwnerDashboardOpen: boolean;
  setIsOwnerDashboardOpen: (open: boolean) => void;
  activeProductForOrder: Product | null;
  setActiveProductForOrder: (prod: Product | null) => void;
  activeProductForDetails: Product | null;
  setActiveProductForDetails: (prod: Product | null) => void;
  activeMediaViewer: { product: Product; initialIndex: number } | null;
  setActiveMediaViewer: (data: { product: Product; initialIndex: number } | null) => void;
  activeLandingPageProduct: Product | null;
  setActiveLandingPageProduct: (prod: Product | null) => void;
  wholesaleHighlightActive: boolean;
  setWholesaleHighlightActive: (active: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'soldeya_products_v2',
  ORDERS: 'soldeya_orders_v2',
  USER: 'soldeya_current_user_v2',
  SETTINGS: 'soldeya_settings_v2',
  CUSTOMERS: 'soldeya_registered_customers_v2',
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'صولديا - SOLDEYA',
  phone: '0632336160',
  currency: 'درهم',
  googleSheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  googleSheetSyncEnabled: true,
  theme: 'light',
  language: 'darija',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from storage or fallback to INITIAL_PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Load orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Load registered customers list
  const [registeredCustomers, setRegisteredCustomers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Load current user (no sensitive passwords stored in storage)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Load settings
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Search & Category filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wholesaleHighlightActive, setWholesaleHighlightActive] = useState<boolean>(false);

  // UI Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCustomerAccountModalOpen, setIsCustomerAccountModalOpen] = useState(false);
  const [isOwnerDashboardOpen, setIsOwnerDashboardOpen] = useState(false);
  const [activeProductForOrder, setActiveProductForOrder] = useState<Product | null>(null);
  const [activeProductForDetails, setActiveProductForDetails] = useState<Product | null>(null);
  const [activeMediaViewer, setActiveMediaViewer] = useState<{ product: Product; initialIndex: number } | null>(null);
  const [activeLandingPageProduct, setActiveLandingPageProduct] = useState<Product | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(registeredCustomers));
  }, [registeredCustomers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Order counter is dynamic based on orders
  const orderCounter = orders.length;

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...newSettings }));
  };

  /**
   * Direct Owner Authentication
   * hocinbourchim5@gmail.com with password omil4aliya
   */
  const loginOwnerDirect = (password: string): boolean => {
    if (password === 'omil4aliya') {
      const ownerUser: User = {
        id: 'owner-hocin',
        email: 'hocinbourchim5@gmail.com',
        fullName: 'الحسين بورشيم (مالك صولديا)',
        role: 'owner',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(ownerUser);
      setIsAuthModalOpen(false);
      setIsOwnerDashboardOpen(true);
      return true;
    }
    return false;
  };

  /**
   * Customer Login
   */
  const loginCustomer = (email: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredCustomers.find(c => c.email.toLowerCase() === cleanEmail);
    if (existing) {
      setCurrentUser(existing);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    // If not found in registered, auto-register as customer if valid
    const newUser: User = {
      id: 'cust-' + Date.now(),
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0],
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setRegisteredCustomers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  /**
   * Customer Registration
   */
  const registerCustomer = (data: {
    email: string;
    fullName: string;
    phone?: string;
    city?: string;
    address?: string;
  }): { success: boolean; message?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    const newUser: User = {
      id: 'cust-' + Date.now(),
      email: cleanEmail,
      fullName: data.fullName.trim(),
      role: 'customer',
      phone: data.phone?.trim(),
      city: data.city?.trim(),
      address: data.address?.trim(),
      createdAt: new Date().toISOString(),
    };
    setRegisteredCustomers(prev => [...prev.filter(c => c.email.toLowerCase() !== cleanEmail), newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const updateCustomerProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setRegisteredCustomers(prev => prev.map(c => c.id === currentUser.id ? updated : c));
  };

  const logout = () => {
    setCurrentUser(null);
    setIsOwnerDashboardOpen(false);
    setIsCustomerAccountModalOpen(false);
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      comparePrice: calculateComparePrice(productData.principalPrice),
      wholesalePrice: calculateWholesalePrice(productData.principalPrice),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const principalPrice = updatedFields.principalPrice ?? p.principalPrice;
      return {
        ...p,
        ...updatedFields,
        principalPrice,
        comparePrice: calculateComparePrice(principalPrice),
        wholesalePrice: calculateWholesalePrice(principalPrice),
      };
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        inventory: newStock,
        inStock: newStock > 0,
      };
    }));
  };

  /**
   * Order creation with Atomic inventory decrement & wholesale logic
   */
  const createOrder = (orderData: {
    customerName: string;
    phone: string;
    city: string;
    address: string;
    items: OrderItem[];
    notes?: string;
  }): { success: boolean; order?: Order; error?: string } => {
    // 1. Validation
    if (!orderData.customerName || !orderData.phone || !orderData.city || !orderData.address) {
      return { success: false, error: 'المرجو ملء جميع المعلومات المطلوبة لإتمام الطلب' };
    }
    if (!orderData.items || orderData.items.length === 0) {
      return { success: false, error: 'السلة فارغة، المرجو اختيار منتج' };
    }

    // 2. Validate Inventory and compute server-side pricing
    let totalCalculatedAmount = 0;
    let anyWholesaleApplied = false;

    // Check inventory for each item
    for (const item of orderData.items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) {
        return { success: false, error: `المنتج ${item.productName} لم يعد متوفراً` };
      }
      if (prod.inventory < item.quantity) {
        return { success: false, error: `الكمية المتوفرة في المخزون للمنتج ${prod.name} هي ${prod.inventory} فقط` };
      }
      const isWholesale = item.quantity >= 3;
      if (isWholesale) anyWholesaleApplied = true;
      const unit = isWholesale ? calculateWholesalePrice(prod.principalPrice) : prod.principalPrice;
      totalCalculatedAmount += unit * item.quantity;
    }

    // 3. Decrement Inventory atomically
    setProducts(prev => prev.map(p => {
      const item = orderData.items.find(it => it.productId === p.id);
      if (!item) return p;
      const newStock = Math.max(0, p.inventory - item.quantity);
      return {
        ...p,
        inventory: newStock,
        inStock: newStock > 0,
      };
    }));

    // 4. Generate unique Moroccan order reference
    const orderRef = `SLD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderReference: orderRef,
      customerName: orderData.customerName.trim(),
      phone: orderData.phone.trim(),
      city: orderData.city.trim(),
      address: orderData.address.trim(),
      items: orderData.items,
      totalAmount: totalCalculatedAmount,
      isWholesale: anyWholesaleApplied,
      notes: orderData.notes,
      status: 'جديد',
      createdAt: new Date().toISOString(),
      syncStatus: storeSettings.googleSheetSyncEnabled ? 'synced' : 'pending',
      syncedAt: storeSettings.googleSheetSyncEnabled ? new Date().toISOString() : undefined,
    };

    setOrders(prev => [newOrder, ...prev]);

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const retrySyncOrder = async (orderId: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600));
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, syncStatus: 'synced', syncedAt: new Date().toISOString() };
      }
      return o;
    }));
    return true;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories: INITIAL_CATEGORIES,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        orders,
        orderCounter,
        currentUser,
        storeSettings,
        updateStoreSettings,
        loginOwnerDirect,
        loginCustomer,
        registerCustomer,
        updateCustomerProfile,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        createOrder,
        updateOrderStatus,
        retrySyncOrder,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCustomerAccountModalOpen,
        setIsCustomerAccountModalOpen,
        isOwnerDashboardOpen,
        setIsOwnerDashboardOpen,
        activeProductForOrder,
        setActiveProductForOrder,
        activeProductForDetails,
        setActiveProductForDetails,
        activeMediaViewer,
        setActiveMediaViewer,
        activeLandingPageProduct,
        setActiveLandingPageProduct,
        wholesaleHighlightActive,
        setWholesaleHighlightActive,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
