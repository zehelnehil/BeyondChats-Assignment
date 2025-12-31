import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ArticleDetail from './pages/ArticleDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">

        {/* Modern Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                B
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                BeyondChats
              </span>
            </a>
            <div className="text-sm font-medium text-slate-500">
              Intern Assignment
            </div>
          </div>
        </nav>

        {/* Main Content Area with padding for fixed nav */}
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} BeyondChats Assignment
        </footer>
      </div>
    </Router>
  );
}

export default App;
