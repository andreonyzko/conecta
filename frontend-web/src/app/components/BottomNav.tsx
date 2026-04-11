import { useLocation, useNavigate } from 'react-router';
import { Home, FileText, User, PlusSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function BottomNav() {
  const { role } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const agricultorItems = [
    { path: '/chamadas', icon: Home, label: 'Chamadas' },
    { path: '/propostas', icon: FileText, label: 'Propostas' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  const instituicaoItems = [
    { path: '/chamadas', icon: Home, label: 'Chamadas' },
    { path: '/criar-chamada', icon: PlusSquare, label: 'Publicar' },
    { path: '/perfil', icon: User, label: 'Perfil' },
  ];

  const items = role === 'agricultor' ? agricultorItems : instituicaoItems;

  const isActive = (path: string) => {
    if (path === '/chamadas') return location.pathname === '/chamadas';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex-shrink-0 bg-[#1D2226] border-t border-[#2F3336] flex items-center justify-around px-2 py-2 safe-area-pb">
      {items.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all active:scale-95 ${
              active ? 'text-[#149D7F]' : 'text-[#B0B3B8]'
            }`}
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 1.8}
              className={active ? 'text-[#149D7F]' : 'text-[#B0B3B8]'}
            />
            <span
              className="text-[10px] font-medium"
              style={{ fontSize: '10px', fontWeight: active ? 600 : 400 }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
