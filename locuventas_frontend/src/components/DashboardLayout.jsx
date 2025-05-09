import Aside from "./Aside";
import Main from "./Main";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="md:w-1/4 w-full bg-gray-800 text-white">
      <p>Tocapelotas</p>
        <Aside />
      </aside>

      {/* Main content */}
      <main className="md:w-3/4 w-full bg-orange-500">
        <Main />
      </main>
    </div>
  );
}
