import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, Sparkles, 
  History as HistoryIcon, Filter, X 
} from 'lucide-react';
import HistoryCard from './HistoryCard';
import { MOCK_HISTORY } from '../../data/mockData';
import './HistoryPage.css';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'High Scale', 'Real-time', 'MVP', 'Microservices', 'Database'];
  
  const filteredHistory = MOCK_HISTORY.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.preview.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || item.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="history-page-wrapper">
      <div className="history-container">
        
        {/* ── Page Header (Premium Glow Icons) ── */}
        <header className="history-header">
          <div className="history-title-block">
             <div className="history-icon-glow">
                <HistoryIcon size={22} strokeWidth={2.5} />
             </div>
             <h1 className="history-title">Session History</h1>
             <p className="history-subtitle">
               Manage and explore your previously generated software architectures.
             </p>
          </div>
        </header>

        {/* ── Search & Filter Controls ── */}
        <section className="history-controls">
           <div className="history-search-row">
              <div className="history-search-input-wrap">
                 <Search size={18} className="history-search-icon" />
                 <input 
                   type="text" 
                   placeholder="Search architectures (e.g. 'Twitter', 'Kafka')..."
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   className="history-search-bar"
                 />
                 {search && (
                   <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white" onClick={() => setSearch('')}>
                     <X size={14} />
                   </button>
                 )}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="history-tag-pill active"
                style={{ height: '52px', padding: '0 24px', display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
              </motion.button>
           </div>

           <div className="history-tags-filter">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`history-tag-pill ${activeFilter === filter ? 'active' : ''}`}
                >
                   {filter}
                </button>
              ))}
           </div>
        </section>

        {/* ── Cards Gallery Grid ── */}
        <div className="history-gallery-root">
          <AnimatePresence mode="popLayout">
             {filteredHistory.length > 0 ? (
               <motion.div 
                 layout
                 className="history-cards-grid"
               >
                  {filteredHistory.map((item) => (
                    <HistoryCard key={item.id} item={item} />
                  ))}
               </motion.div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="history-empty-state"
                 style={{ 
                   display: 'grid', placeItems: 'center', textAlign: 'center', 
                   padding: '100px 0', border: '1px dashed rgba(255,255,255,0.05)', 
                   borderRadius: '30px', background: 'rgba(255,255,255,0.01)'
                 }}
               >
                  <div className="history-icon-glow" style={{ marginBottom: '24px' }}>
                     <Search size={28} />
                  </div>
                  <h3 className="history-title" style={{ fontSize: '1.25rem' }}>No results found</h3>
                  <p className="history-subtitle">Try adjusting your keywords or filters.</p>
                  <button 
                    onClick={() => { setSearch(''); setActiveFilter('All'); }}
                    className="history-tag-pill active"
                    style={{ marginTop: '24px' }}
                  >
                    Reset Dashboard
                  </button>
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="history-ambient-bg">
        <div className="orb history-orb-1" style={{ position: 'fixed', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'rgba(212,175,55,0.03)', filter: 'blur(100px)', borderRadius: '50%' }} />
      </div>
    </div>
  );
}
