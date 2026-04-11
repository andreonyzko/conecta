import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

export function PhoneWrapper() {
  return (
    <>
      <style>{`
        .phone-root {
          height: 100dvh;
        }
        @media (min-width: 640px) {
          .phone-root {
            height: 844px;
          }
        }
        .agro-scroll::-webkit-scrollbar {
          display: none;
        }
        .agro-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="min-h-screen w-full bg-[#0A0A0A] flex items-start sm:items-center justify-center">
        <div className="phone-root relative w-full sm:w-[390px] bg-[#121212] flex flex-col overflow-hidden sm:rounded-[44px] sm:border-[3px] sm:border-[#2F3336] sm:shadow-[0_32px_80px_rgba(0,0,0,0.9)]">
          <Outlet />
        </div>
      </div>
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: '#1D2226',
            border: '1px solid #2F3336',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}
