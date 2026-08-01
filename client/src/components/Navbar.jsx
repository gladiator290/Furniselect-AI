import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const isAdmin = userInfo?.role === 'admin';
  const viewMode = localStorage.getItem('viewMode') || 'customer';
  const adminMode = isAdmin && viewMode === 'admin';

  const logout = () => { localStorage.clear(); window.location.href = '/'; };
  const nav = adminMode
    ? [['/admin', 'Overview'], ['/admin/products', 'Products'], ['/admin/orders', 'Orders'], ['/admin/analytics', 'Analytics']]
    : [['/', 'Home'], ['/products', 'Collection'], ['/ai-room', 'AI Studio']];

  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#211a16] text-white shadow-[0_8px_30px_rgba(49,29,18,.16)]">
    <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 lg:px-8">
      <Link to={adminMode ? '/admin' : '/'} className="focus-ring flex items-center gap-3" aria-label="FurniSelect home">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d39a69] text-sm font-bold text-[#3b2419] shadow-inner">F</span>
        <span className="text-[1.08rem] font-bold tracking-[-.03em]">Furni<span className="font-normal text-[#d9a274]">Select</span></span>
      </Link>
      <nav className="hidden items-center gap-8 lg:flex">
        {nav.map(([href, label]) => <Link key={href} to={href} className={`focus-ring text-sm font-medium transition ${location.pathname === href ? 'text-[#e0ae82]' : 'text-white/65 hover:text-white'}`}>{label}</Link>)}
      </nav>
      <div className="flex items-center gap-3">
        {!userInfo ? <><Link to="/login" className="hidden px-3 py-2 text-sm font-semibold text-white/65 hover:text-white sm:block">Sign in</Link><Link to="/register" className="rounded-full bg-[#d59d6c] px-4 py-2.5 text-sm font-semibold text-[#3b2419] shadow-[0_8px_22px_rgba(0,0,0,.15)] transition hover:bg-[#e1b181]">Get started</Link></> : <>
          {isAdmin && <button onClick={() => { localStorage.setItem('viewMode', adminMode ? 'customer' : 'admin'); window.location.href = adminMode ? '/' : '/admin'; }} className="hidden rounded-full border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 sm:block">{adminMode ? 'Customer view' : 'Admin view'}</button>}
          <button onClick={() => setOpen(!open)} className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-[#d9a274] text-sm font-bold text-[#3b2419]">{userInfo.name?.[0]?.toUpperCase()}</button>
          {open && <div className="absolute right-5 top-[68px] w-60 overflow-hidden rounded-2xl border border-[#e7dfd6] bg-white shadow-2xl lg:right-8">
            <div className="border-b border-[#eee7df] px-4 py-4"><p className="font-semibold">{userInfo.name}</p><p className="mt-1 truncate text-xs text-[#897e75]">{userInfo.email}</p></div>
            <Link to="/profile" className="block px-4 py-3 text-sm hover:bg-[#f7f3ee]">My profile</Link><Link to="/orders" className="block px-4 py-3 text-sm hover:bg-[#f7f3ee]">My orders</Link><button onClick={logout} className="w-full border-t border-[#eee7df] px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50">Sign out</button>
          </div>}
        </>}
        <button onClick={() => setOpen(!open)} className="ml-1 rounded-lg p-2 text-[#e1b181] lg:hidden" aria-label="Toggle menu">☰</button>
      </div>
    </div>
    {open && <div className="border-t border-white/10 bg-[#3b2419] px-5 py-4 lg:hidden">{nav.map(([href, label]) => <Link key={href} to={href} className="block border-b border-white/10 py-3 text-sm font-medium text-white/80">{label}</Link>)}</div>}
  </header>;
}
export default Navbar;
