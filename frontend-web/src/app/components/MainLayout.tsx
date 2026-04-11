import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';

export function MainLayout() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto agro-scroll min-h-0">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
