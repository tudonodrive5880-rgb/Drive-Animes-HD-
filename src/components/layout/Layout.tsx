import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen flex text-white font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-1 md:ml-[220px] mt-[60px] p-[20px] md:p-[30px] relative box-border bg-dark-bg w-full">
        <Outlet />
        <footer className="w-full mt-10 pt-6 border-t border-border text-center text-[12px] text-muted">
          &copy; {new Date().getFullYear()} Drive Animes HD.
        </footer>
      </main>
    </div>
  );
}
