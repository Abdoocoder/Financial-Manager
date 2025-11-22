
import React, { useState, useMemo } from 'react';
import { Icons } from './components/Icons';
import { useStore } from './services/store';
import { formatCurrency, formatDate } from './utils/helpers';
import { DonutChart, SimpleBarChart, SimpleLineChart } from './components/Charts';
import { TransactionType, AssetType, InvestmentType } from './types';

// --- Components ---

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${
      active ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <Icon size={24} />
    <span className="text-xs mt-1 font-medium">{label}</span>
  </button>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500">
            <Icons.Close size={20} />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// --- Pages ---

const Dashboard = ({ store, onAddClick }: any) => {
  const { transactions, assets, debts, investments } = store;

  const totalIncome = transactions.filter((t: any) => t.type === TransactionType.INCOME).reduce((acc: number, t: any) => acc + t.amount, 0);
  const totalExpense = transactions.filter((t: any) => t.type === TransactionType.EXPENSE).reduce((acc: number, t: any) => acc + t.amount, 0);
  const totalAssetsVal = assets.reduce((acc: number, a: any) => acc + a.value, 0);
  const totalDebtsVal = debts.reduce((acc: number, d: any) => acc + d.remainingAmount, 0);
  const totalInvestmentsVal = investments.reduce((acc: number, i: any) => acc + (i.currentPrice * i.quantity), 0);

  const netWorth = (totalAssetsVal + totalInvestmentsVal) - totalDebtsVal;

  const expenseData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions.filter((t: any) => t.type === TransactionType.EXPENSE).forEach((t: any) => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">مرحباً، عبد الله 👋</h1>
          <p className="text-slate-500 text-sm">إليك ملخص وضعك المالي اليوم</p>
        </div>
        <div className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
           <img src="https://picsum.photos/100/100" alt="Profile" />
        </div>
      </header>

      {/* Net Worth Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200">
        <p className="text-emerald-100 text-sm font-medium mb-1">صافي الثروة</p>
        <h2 className="text-4xl font-bold mb-4" dir="ltr">{formatCurrency(netWorth)}</h2>
        <div className="flex gap-4">
          <div className="bg-white/10 rounded-xl p-3 flex-1 backdrop-blur-sm">
            <p className="text-xs text-emerald-100 mb-1">الأصول</p>
            <p className="font-semibold text-lg" dir="ltr">{formatCurrency(totalAssetsVal + totalInvestmentsVal)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 flex-1 backdrop-blur-sm">
            <p className="text-xs text-emerald-100 mb-1">الديون</p>
            <p className="font-semibold text-lg" dir="ltr">{formatCurrency(totalDebtsVal)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-full"><Icons.Income size={16} /></div>
            <span className="text-sm text-slate-500 font-medium">الدخل</span>
          </div>
          <p className="text-xl font-bold text-slate-800" dir="ltr">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-full"><Icons.Expense size={16} /></div>
            <span className="text-sm text-slate-500 font-medium">المصاريف</span>
          </div>
          <p className="text-xl font-bold text-slate-800" dir="ltr">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">توزيع المصاريف</h3>
        {expenseData.length > 0 ? (
          <DonutChart data={expenseData} />
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-400 text-sm">لا توجد بيانات مصاريف</div>
        )}
      </div>

       {/* Recent Transactions */}
       <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">آخر العمليات</h3>
          <button className="text-emerald-600 text-sm font-medium">عرض الكل</button>
        </div>
        <div className="space-y-3">
          {transactions.slice(-5).reverse().map((t: any) => (
            <div key={t.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm border border-slate-50">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${t.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {t.type === 'income' ? <Icons.Income size={18} /> : <Icons.Expense size={18} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{t.category}</p>
                  <p className="text-xs text-slate-400">{formatDate(t.date)}</p>
                </div>
              </div>
              <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-slate-800'}`} dir="ltr">
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AssetsPage = ({ store }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', value: '', type: AssetType.OTHER });

  const handleSubmit = () => {
    if (!newAsset.name || !newAsset.value) return;
    store.addAsset({
      name: newAsset.name,
      value: parseFloat(newAsset.value),
      type: newAsset.type,
      dateAcquired: new Date().toISOString()
    });
    setIsOpen(false);
    setNewAsset({ name: '', value: '', type: AssetType.OTHER });
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">الأصول</h1>
        <button onClick={() => setIsOpen(true)} className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700">
          <Icons.Plus />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {store.assets.map((asset: any) => (
          <div key={asset.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                {asset.type === AssetType.REAL_ESTATE ? <Icons.Home /> : 
                 asset.type === AssetType.VEHICLE ? <Icons.Card /> : 
                 <Icons.Coins />}
              </div>
              <div>
                <p className="font-bold text-slate-800">{asset.name}</p>
                <p className="text-xs text-slate-500">{formatCurrency(asset.value)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="إضافة أصل جديد">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم الأصل</label>
            <input 
              type="text" 
              className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none"
              value={newAsset.name}
              onChange={e => setNewAsset({...newAsset, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">القيمة التقديرية</label>
            <input 
              type="number" 
              className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none"
              value={newAsset.value}
              onChange={e => setNewAsset({...newAsset, value: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">النوع</label>
            <select 
              className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none"
              value={newAsset.type}
              onChange={e => setNewAsset({...newAsset, type: e.target.value as AssetType})}
            >
              <option value={AssetType.REAL_ESTATE}>عقار</option>
              <option value={AssetType.VEHICLE}>سيارة</option>
              <option value={AssetType.GOLD}>ذهب</option>
              <option value={AssetType.CASH}>نقد</option>
              <option value={AssetType.OTHER}>آخر</option>
            </select>
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 mt-4"
          >
            حفظ
          </button>
        </div>
      </Modal>
    </div>
  );
};

const InvestmentsPage = ({ store }: any) => {
  const portfolioValue = store.investments.reduce((acc: number, i: any) => acc + (i.currentPrice * i.quantity), 0);
  const totalCost = store.investments.reduce((acc: number, i: any) => acc + (i.buyPrice * i.quantity), 0);
  const roi = totalCost > 0 ? ((portfolioValue - totalCost) / totalCost) * 100 : 0;

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-slate-800">الاستثمارات</h1>
      
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <p className="text-slate-400 text-sm font-medium mb-1">قيمة المحفظة</p>
        <h2 className="text-3xl font-bold mb-4" dir="ltr">{formatCurrency(portfolioValue)}</h2>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold px-2 py-1 rounded-lg ${roi >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`} dir="ltr">
            {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
          </span>
          <span className="text-slate-400 text-sm">العائد الكلي</span>
        </div>
      </div>

      <div className="space-y-3">
        {store.investments.map((inv: any) => {
          const currentVal = inv.currentPrice * inv.quantity;
          const gain = (inv.currentPrice - inv.buyPrice) * inv.quantity;
          return (
            <div key={inv.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                   <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {inv.symbol.substring(0, 1)}
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-800">{inv.symbol}</h3>
                     <p className="text-xs text-slate-400">{inv.quantity} سهم</p>
                   </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800" dir="ltr">{formatCurrency(currentVal)}</p>
                  <p className={`text-xs font-medium ${gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`} dir="ltr">
                    {gain >= 0 ? '+' : ''}{formatCurrency(gain)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main App Layout ---

const App = () => {
  const store = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ amount: '', category: '', type: TransactionType.EXPENSE });

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) return;
    store.addTransaction({
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      type: newTransaction.type,
      date: new Date().toISOString()
    });
    setAddModalOpen(false);
    setNewTransaction({ amount: '', category: '', type: TransactionType.EXPENSE });
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard store={store} />;
      case 'assets': return <AssetsPage store={store} />;
      case 'investments': return <InvestmentsPage store={store} />;
      default: return <Dashboard store={store} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 relative">
      {/* Main Content Area */}
      <main className="max-w-lg mx-auto min-h-screen bg-slate-50 px-5 pt-8">
        {renderPage()}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-5 z-40"> 
         {/* Adjusted for RTL: bottom-24 left-5 puts it on the LEFT side which is common in RTL apps or Center. 
             Let's put it strictly center or end. 
             Standard FAB in Material RTL is usually Left (Start) or Center.
         */}
      </div>
      
      <div className="fixed bottom-24 left-6 z-30">
          <button 
            onClick={() => setAddModalOpen(true)}
            className="bg-slate-900 text-white p-4 rounded-full shadow-xl shadow-slate-400/50 hover:scale-105 transition-transform active:scale-95"
          >
            <Icons.Plus size={28} />
          </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe pt-2 px-4 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] max-w-lg mx-auto">
        <div className="flex justify-around items-center">
          <NavItem 
            icon={Icons.Dashboard} 
            label="الرئيسية" 
            active={currentPage === 'dashboard'} 
            onClick={() => setCurrentPage('dashboard')} 
          />
          <NavItem 
            icon={Icons.Bank} 
            label="الأصول" 
            active={currentPage === 'assets'} 
            onClick={() => setCurrentPage('assets')} 
          />
          <div className="w-12"></div> {/* Spacer for FAB */}
          <NavItem 
            icon={Icons.TrendingUp} 
            label="استثمار" 
            active={currentPage === 'investments'} 
            onClick={() => setCurrentPage('investments')} 
          />
          <NavItem 
            icon={Icons.Chart} 
            label="تقارير" 
            active={currentPage === 'reports'} 
            onClick={() => {}} 
          />
        </div>
      </nav>

      {/* Quick Transaction Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="عملية جديدة">
        <div className="space-y-4">
           <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
             <button 
               className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newTransaction.type === TransactionType.EXPENSE ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
               onClick={() => setNewTransaction({...newTransaction, type: TransactionType.EXPENSE})}
             >
               مصروف
             </button>
             <button 
               className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newTransaction.type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
               onClick={() => setNewTransaction({...newTransaction, type: TransactionType.INCOME})}
             >
               دخل
             </button>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">المبلغ</label>
             <div className="relative">
               <input 
                 type="number" 
                 className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none text-2xl font-bold text-slate-800 text-center"
                 placeholder="0.000"
                 value={newTransaction.amount}
                 onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})}
               />
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">JOD</span>
             </div>
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">التصنيف</label>
             <select 
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none text-right"
                value={newTransaction.category}
                onChange={e => setNewTransaction({...newTransaction, category: e.target.value})}
             >
               <option value="">اختر تصنيف...</option>
               {newTransaction.type === TransactionType.EXPENSE ? (
                 <>
                   <option value="طعام">طعام وشراب</option>
                   <option value="مواصلات">مواصلات</option>
                   <option value="فواتير">فواتير</option>
                   <option value="تسوق">تسوق</option>
                   <option value="صحة">صحة</option>
                 </>
               ) : (
                 <>
                   <option value="راتب">راتب شهري</option>
                   <option value="تجارة">تجارة</option>
                   <option value="هدايا">هدايا</option>
                 </>
               )}
             </select>
           </div>

           <button 
             onClick={handleAddTransaction}
             className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-300 hover:bg-slate-800 mt-2"
           >
             إضافة العملية
           </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
