import { Route, Routes } from 'react-router-dom';
import { Hero } from './components/Hero/Hero';
import { ProjectDetailPage, Projects } from './components/Projects/ProjectPages';
import { SeoManager } from './components/Seo/SeoManager';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 grid grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[minmax(320px,360px)_1fr] xl:grid-cols-[380px_1fr]">
      <SeoManager />
      {/* Hero section (sidebar on large screens, top on small screens) */}
      <div className="lg:sticky lg:top-0 lg:h-screen lg:max-h-screen overflow-y-auto bg-white shadow-md">
        <Hero />
      </div>

      {/* Main content */}
      <div className="w-full lg:pl-3 xl:pl-4">
        <main className="container mx-auto max-w-5xl px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
