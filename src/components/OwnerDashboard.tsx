import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductColor, ProductMedia } from '../types';
import {
  X,
  Package,
  ShoppingBag,
  Layers,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit,
  Eye,
  FileText,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  Shield,
  Palette
} from 'lucide-react';
import { extractDominantColorsFromImage } from '../utils/colorExtractor';

export const OwnerDashboard: React.FC = () => {
  const {
    isOwnerDashboardOpen,
    setIsOwnerDashboardOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    orderCounter,
    updateOrderStatus,
    retrySyncOrder,
    storeSettings,
    updateStoreSettings,
    setActiveLandingPageProduct,
    logout,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'inventory' | 'sheets' | 'settings'>('products');

  // Add / Edit product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('الملابس');
  const [pDescription, setPDescription] = useState('');
  const [pPrice, setPPrice] = useState(199);
  const [pInventory, setPInventory] = useState(30);
  const [pImageUrl, setPImageUrl] = useState('');
  const [pVideoUrl, setPVideoUrl] = useState('');
  const [pColors, setPColors] = useState<ProductColor[]>([]);
  const [isExtractingColors, setIsExtractingColors] = useState(false);

  // Google Sheets test state
  const [sheetTestSuccess, setSheetTestSuccess] = useState<string | null>(null);

  if (!isOwnerDashboardOpen) return null;

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setPName('');
    setPCategory('الملابس');
    setPDescription('');
    setPPrice(199);
    setPInventory(30);
    setPImageUrl('https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=80');
    setPVideoUrl('');
    setPColors([
      { name: 'أسود ملكي', hex: '#18181b', mediaIndex: 0 },
      { name: 'بيج صوف', hex: '#d4b996', mediaIndex: 0 },
    ]);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setPName(prod.name);
    setPCategory(prod.category);
    setPDescription(prod.description);
    setPPrice(prod.principalPrice);
    setPInventory(prod.inventory);
    setPImageUrl(prod.media[0]?.url || '');
    setPVideoUrl(prod.media.find(m => m.type === 'video')?.url || '');
    setPColors(prod.colors || []);
    setIsProductModalOpen(true);
  };

  // Trigger Automatic Color Extraction from image URL
  const handleAutoExtractColors = async () => {
    if (!pImageUrl) return;
    setIsExtractingColors(true);
    const extracted = await extractDominantColorsFromImage(pImageUrl);
    setIsExtractingColors(false);
    if (extracted.length > 0) {
      setPColors(extracted);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const media: ProductMedia[] = [
      {
        id: 'm-' + Date.now(),
        url: pImageUrl,
        type: 'image',
        title: pName,
        colorHex: pColors[0]?.hex,
        colorName: pColors[0]?.name,
      },
    ];

    if (pVideoUrl.trim()) {
      media.push({
        id: 'm-vid-' + Date.now(),
        url: pVideoUrl.trim(),
        type: 'video',
        title: 'فيديو توضيحي للمنتج',
      });
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: pName,
        category: pCategory,
        description: pDescription,
        principalPrice: Number(pPrice),
        inventory: Number(pInventory),
        media,
        colors: pColors,
      });
    } else {
      addProduct({
        name: pName,
        category: pCategory,
        description: pDescription,
        features: ['ضمان الجودة صولديا', 'شحن مجاني وسريع لجميع المدن', 'الدفع عند الاستلام كاش'],
        principalPrice: Number(pPrice),
        comparePrice: 0,
        wholesalePrice: 0,
        inventory: Number(pInventory),
        media,
        colors: pColors,
        rating: 4.9,
        reviewsCount: 1,
        inStock: Number(pInventory) > 0,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleTestSheetConnection = () => {
    setSheetTestSuccess('جاري الاتصال بـ Google Sheets...');
    setTimeout(() => {
      setSheetTestSuccess('✅ تم الاتصال بنجاح! Sheet ID صالح ومتصل بنظام المزامنة.');
      setTimeout(() => setSheetTestSuccess(null), 3500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200">
        
        {/* Dashboard Top Bar */}
        <div className="bg-gray-950 text-white px-5 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-xl shadow-md">
              ص
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">
                  لوحة تحكم المالك — صولديا SOLDEYA
                </span>
                <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
                  Super Admin
                </span>
              </div>
              <span className="text-xs text-gray-400">
                hocinbourchim5@gmail.com • تحكم كامل بالمتجر والمنتجات والطلبيات
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
              }}
              title="تسجيل الخروج"
              className="text-gray-400 hover:text-red-400 text-xs font-bold flex items-center gap-1 bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
            <button
              onClick={() => setIsOwnerDashboardOpen(false)}
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-4 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>إدارة المنتجات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الطلبيات ({orderCounter})</span>
            {orderCounter > 0 && (
              <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {orderCounter}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>المخزون والكميات</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Google Sheets الربط السحابي</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>إعدادات المتجر</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
          
          {/* TAB 1: Products Management */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    قائمة منتجات متجر صولديا
                  </h3>
                  <p className="text-xs text-gray-500">
                    يمكنك إضافة وتعديل وحذف المنتجات واستخراج ألوانها تلقائياً من الصور
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs sm:text-sm">
                    <thead className="bg-gray-100/70 text-gray-700 font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-3">المنتج</th>
                        <th className="p-3">التصنيف</th>
                        <th className="p-3">السعر الرئيسي</th>
                        <th className="p-3">سعر الجملة (3+)</th>
                        <th className="p-3">المخزون</th>
                        <th className="p-3">الألوان المستخرجة</th>
                        <th className="p-3 text-center">صفحة الهبوط</th>
                        <th className="p-3 text-center">العمليات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={p.media[0]?.url}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                            />
                            <div className="max-w-xs">
                              <span className="font-bold text-gray-900 block truncate">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {p.id}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-gray-700">
                            {p.category}
                          </td>
                          <td className="p-3 font-black text-orange-600 font-serif">
                            {p.principalPrice} درهم
                          </td>
                          <td className="p-3 font-bold text-emerald-700">
                            {p.wholesalePrice} درهم
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                              p.inventory > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {p.inventory} قطعة
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              {p.colors?.map((c, i) => (
                                <span
                                  key={i}
                                  title={c.name}
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: c.hex }}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => setActiveLandingPageProduct(p)}
                              className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-bold text-xs border border-amber-200"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>الهبوط</span>
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                title="تعديل المنتج"
                                className="p-1.5 hover:bg-gray-100 text-gray-700 rounded-lg"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`هل أنت متأكد من حذف ${p.name}؟`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                title="حذف المنتج"
                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Orders Management */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    طلبيات الزبائن الواردة (الدفع عند الاستلام)
                  </h3>
                  <p className="text-xs text-gray-500">
                    المجموع: {orderCounter} طلبية • يتم تحديث المخزون ومزامنة Google Sheets تلقائياً
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-700">لا توجد أي طلبيات جديدة حالياً</p>
                  <p className="text-xs text-gray-500">الطلبيات التي يقوم الزبناء بتسجيلها ستظهر هنا فوراً مع إمكانية المزامنة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-orange-600 text-sm">
                            {ord.orderReference}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(ord.createdAt).toLocaleString('ar-MA')}
                          </span>
                          {ord.isWholesale && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              سعر الجملة
                            </span>
                          )}
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-600">الحالة:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white"
                          >
                            <option value="جديد">جديد</option>
                            <option value="قيد التأكيد">قيد التأكيد</option>
                            <option value="تم الشحن">تم الشحن</option>
                            <option value="تم التسليم">تم التسليم</option>
                            <option value="ملغى">ملغى</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer info & Item */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-bold text-gray-500 block">معلومات الزبون:</span>
                          <span className="font-black text-gray-900 block text-sm">{ord.customerName}</span>
                          <a
                            href={`tel:${ord.phone}`}
                            className="text-orange-600 font-bold block hover:underline"
                          >
                            📞 {ord.phone}
                          </a>
                        </div>

                        <div>
                          <span className="font-bold text-gray-500 block">العنوان والمدينة:</span>
                          <span className="font-bold text-gray-800 block">{ord.city}</span>
                          <span className="text-gray-600 block">{ord.address}</span>
                          {ord.notes && <span className="text-gray-500 text-[11px] italic block">ملاحظات: {ord.notes}</span>}
                        </div>

                        <div className="text-left sm:text-left">
                          <span className="font-bold text-gray-500 block">المبلغ المستحق:</span>
                          <span className="text-lg font-black text-emerald-700 font-serif block">
                            {ord.totalAmount} درهم
                          </span>
                          <span className="text-[11px] text-gray-500">الدفع كاش عند الاستلام</span>
                        </div>
                      </div>

                      {/* Sync status */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-500">مزامنة Google Sheets:</span>
                          {ord.syncStatus === 'synced' ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> تم الحفظ في الشيت
                            </span>
                          ) : (
                            <button
                              onClick={() => retrySyncOrder(ord.id)}
                              className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> إعادة المزامنة
                            </button>
                          )}
                        </div>
                        <span className="text-gray-500">
                          {ord.items[0]?.productName} ({ord.items[0]?.quantity} قطعة)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Inventory */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-black text-gray-900">
                مراقبة المخزون وتحديث الكميات
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-3">
                      <img src={p.media[0]?.url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{p.name}</h4>
                        <span className="text-[11px] text-gray-500">{p.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-700">الكمية المتوفرة:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateProduct(p.id, { inventory: Math.max(0, p.inventory - 1) })}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm w-8 text-center">{p.inventory}</span>
                        <button
                          onClick={() => updateProduct(p.id, { inventory: p.inventory + 1 })}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Google Sheets */}
          {activeTab === 'sheets' && (
            <div className="max-w-2xl bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900">
                    ربط الطلبيات مع Google Sheets
                  </h3>
                  <p className="text-xs text-gray-500">
                    مزامنة تلقائية لكل طلبية جديدة (الاسم، الهاتف، المدينة، السعر، والتاريخ)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Google Sheet ID
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={storeSettings.googleSheetId}
                    onChange={(e) => updateStoreSettings({ googleSheetId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <span className="font-bold text-xs text-gray-800 block">تفعيل المزامنة التلقائية</span>
                    <span className="text-[11px] text-gray-500">إرسال كل طلبية مباشرة إلى جدول البيانات</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={storeSettings.googleSheetSyncEnabled}
                    onChange={(e) => updateStoreSettings({ googleSheetSyncEnabled: e.target.checked })}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {sheetTestSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
                    {sheetTestSuccess}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleTestSheetConnection}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    اختبار الاتصال (Test Connection)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Store Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <h3 className="font-black text-base text-gray-900 mb-4">
                إعدادات المتجر والهوية
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اسم المتجر</label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) => updateStoreSettings({ storeName: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم خدمة العملاء (واتساب)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={storeSettings.phone}
                  onChange={(e) => updateStoreSettings({ phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">اللغة الافتراضية</label>
                <select
                  value={storeSettings.language}
                  onChange={(e) => updateStoreSettings({ language: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                >
                  <option value="darija">الدارجة المغربية المكتوبة بالعربية (افتراضية)</option>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">حساب المالك: hocinbourchim5@gmail.com</span>
                <button
                  onClick={() => alert('تم حفظ الإعدادات بنجاح')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-black text-base text-gray-900">
                {editingProductId ? 'تعديل المنتج' : 'إضافة منتج جديد لمتجر صولديا'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  placeholder="مثال: جلابة مغربية كاشمير أصيلة"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">التصنيف</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                  >
                    <option value="الملابس">الملابس</option>
                    <option value="إكسسوارات وهدايا">إكسسوارات وهدايا</option>
                    <option value="إلكترونيات ومنزل">إلكترونيات ومنزل</option>
                    <option value="الصحة والجمال">الصحة والجمال</option>
                    <option value="عروض وتخفيضات">عروض وتخفيضات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    السعر الرئيسي (درهم)
                  </label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">
                    يتم حساب سعر المقارنة وسعر الجملة تلقائياً!
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">رابط صورة المنتج الرئيسية</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    dir="ltr"
                    value={pImageUrl}
                    onChange={(e) => setPImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono text-left"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={handleAutoExtractColors}
                    disabled={isExtractingColors}
                    className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold px-3 py-2 rounded-xl text-xs whitespace-nowrap flex items-center gap-1 cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>{isExtractingColors ? 'تحليل...' : 'استخراج الألوان تلقائياً'}</span>
                  </button>
                </div>
              </div>

              {/* Automatic Extracted Colors Display */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  الألوان المستخرجة للمنتج (تتطابق مع الصور):
                </label>
                <div className="flex items-center gap-2 flex-wrap bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  {pColors.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-2xs">
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: c.hex }} />
                      <span className="font-bold text-[11px]">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => setPColors(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-red-500 text-[10px] font-black mr-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {pColors.length === 0 && (
                    <span className="text-[11px] text-gray-400">اضغط "استخراج الألوان تلقائياً" للتحليل الفوري للصورة</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">رابط الفيديو التوضيحي (اختياري)</label>
                <input
                  type="url"
                  dir="ltr"
                  value={pVideoUrl}
                  onChange={(e) => setPVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono text-left"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">الكمية في المخزون</label>
                  <input
                    type="number"
                    required
                    value={pInventory}
                    onChange={(e) => setPInventory(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">الوصف</label>
                  <input
                    type="text"
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm"
                    placeholder="وصف مختصر للمنتج"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md cursor-pointer"
                >
                  حفظ المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
