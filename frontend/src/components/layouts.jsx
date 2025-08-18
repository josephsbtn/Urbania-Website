export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">Smart City Dashboard</h1>
        <nav className="space-x-6">
          <button>Future Mobility</button>
          <button>Smart Governance</button>
          <button>Green Cities</button>
        </nav>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
