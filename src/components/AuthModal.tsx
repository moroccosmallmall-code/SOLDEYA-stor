import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Mail, User as UserIcon, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginOwnerDirect, loginCustomer, registerCustomer } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  /**
   * Validates Email / Gmail structure
   * Requirement: تنبيهه إن أخطأ بكتابة كلمة: "المرجو إدخال إيميل أو جيميل صحيح"
   */
  const validateEmailOrGmail = (email: string): boolean => {
    const trimmed = email.trim();
    if (!trimmed) return false;

    // Strict email regex validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) return false;

    // Specific Gmail validation if user enters @gmail.com
    if (trimmed.toLowerCase().includes('gmail')) {
      const gmailRegex = /^[a-zA-Z0-9.]+@gmail\.com$/i;
      if (!gmailRegex.test(trimmed)) {
        return false;
      }
    }

    return true;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const emailTrimmed = loginEmail.trim();

    // Check if this is the store owner
    if (emailTrimmed.toLowerCase() === 'hocinbourchim5@gmail.com') {
      if (loginPassword === 'omil4aliya') {
        setIsLoading(true);
        setTimeout(() => {
          loginOwnerDirect(loginPassword);
          setIsLoading(false);
        }, 400);
        return;
      } else {
        setErrorMessage('كلمة المرور غير صحيحة، المرجو التأكد من البيانات');
        return;
      }
    }

    // Customer Email / Gmail Validation
    if (!validateEmailOrGmail(emailTrimmed)) {
      setErrorMessage('المرجو إدخال إيميل أو جيميل صحيح');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginCustomer(emailTrimmed);
      setIsLoading(false);
      if (res.success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMessage(res.message || 'حدث خطأ أثناء تسجيل الدخول');
      }
    }, 300);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regFullName.trim()) {
      setErrorMessage('المرجو إدخال الاسم الكامل');
      return;
    }

    if (!validateEmailOrGmail(regEmail)) {
      setErrorMessage('المرجو إدخال إيميل أو جيميل صحيح');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = registerCustomer({
        email: regEmail,
        fullName: regFullName,
        phone: regPhone,
        city: regCity,
      });
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage('تم إنشاء حسابك بنجاح! يمكنك الآن التسوق والتتبع.');
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 800);
      } else {
        setErrorMessage(res.message || 'تعذر إتمام التسجيل');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 my-auto animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center">
              ص
            </div>
            <span className="font-bold text-gray-900 text-sm">
              {activeTab === 'login' ? 'تسجيل الدخول إلى صولديا' : 'إنشاء حساب جديد في صولديا'}
            </span>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-gray-100 mx-5 mt-5 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            تسجيل الدخول المباشر
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: Direct Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="p-5 sm:p-6 space-y-4" autoCapitalize="none" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                البريد الإلكتروني أو الجيميل (Gmail) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  dir="ltr"
                  placeholder="name@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50/50 focus:bg-white text-left font-mono"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                متاح لجميع الزبائن للتفقد والشراء وتتبع الطلبيات
              </span>
            </div>

            {/* Optional Password field for admin/special auth */}
            {loginEmail.trim().toLowerCase() === 'hocinbourchim5@gmail.com' && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-gray-50/50 focus:bg-white text-left"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <span>{isLoading ? 'جاري التحقق...' : 'تسجيل الدخول والمتابعة'}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold"
              >
                ليس لديك حساب؟ أنشئ حساب زائر مجاناً
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: New Customer Registration Form */
          <form onSubmit={handleRegisterSubmit} className="p-5 sm:p-6 space-y-3.5" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="محمد الإدريسي"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 text-sm bg-gray-50/50 focus:bg-white"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                البريد الإلكتروني أو الجيميل (Gmail) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  dir="ltr"
                  placeholder="example@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 text-sm bg-gray-50/50 focus:bg-white text-left font-mono"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 block">
                تأكد من كتابة إيميل صحيح لتتوصل بإشعارات الشحن
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  رقم الهاتف (اختياري)
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="06XXXXXXXX"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-gray-50/50 focus:bg-white text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  المدينة (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="الدار البيضاء"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-gray-50/50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isLoading ? 'جاري التسجيل...' : 'تأكيد إنشاء الحساب ودخول المتجر'}</span>
              <CheckCircle className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-gray-600 hover:text-gray-900 font-bold"
              >
                مسجل مسبقاً؟ تسجيل الدخول المباشر
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
