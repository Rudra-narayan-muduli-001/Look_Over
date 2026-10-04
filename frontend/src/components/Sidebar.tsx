import { NavLink } from 'react-router-dom';

export default function Sidebar({ unseen }: { unseen: number }) {
  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
      isActive ? 'bg-[#22D3EE]/15 text-[#22D3EE]' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`;
  return (
    <nav className="border-b border-white/10 bg-[#131A26] px-4 py-3 sm:w-60 sm:shrink-0 sm:border-b-0 sm:border-r sm:p-4">
      <p className="mb-3 hidden text-lg font-bold text-slate-200 sm:block">Eyes on You</p>
      <div className="flex gap-2 sm:flex-col">
        <NavLink to="/" end className={link}>
          Dashboard
        </NavLink>
        <NavLink to="/alerts" className={link}>
          Alerts
          {unseen > 0 && (
            <span className="rounded-full bg-[#22D3EE] px-2 py-0.5 text-[11px] font-bold text-[#0B0F17]">
              {unseen}
            </span>
          )}
        </NavLink>
        <NavLink to="/new" className={link}>
          + Add person
        </NavLink>
      </div>
    </nav>
  );
}
