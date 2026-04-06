import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, LayoutGrid, LayoutList, SlidersHorizontal, 
  Sparkles, History as HistoryIcon, Filter 
} from 'lucide-react';
import HistoryCard from './HistoryCard';
import { MOCK_HISTORY } from '../../data/mockData';
import './HistoryPage.css';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [viewType, setViewType] = useState('grid');
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
      <div className="history-ambient-bg">
        <div className="orb history-orb-1" />
        <div className="orb history-orb-2" />
      </div>

      <div className="history-header">
        <div className="history-header-top">
          <div className="history-title-wrap">
             <div className="history-icon-wrap">
                <HistoryIcon size={20} />
             </div>
             <div>
               <h1 className="history-title">History</h1>
               <p className="history-subtitle">Manage and explore your generated system designs</p>
             </div>
          </div>

          <div className="history-view-toggles">
             <button 
               onClick={() => setViewType('grid')}
               className={`history-toggle-btn ${viewType === 'grid' ? 'active' : ''}`}
             >
               <LayoutGrid size={16} />
             </button>
             <button 
               onClick={() => setViewType('list')}
               className={`history-toggle-btn ${viewType === 'list' ? 'active' : ''}`}
             >
               <LayoutList size={16} />
             </button>
          </div>
        </div>

        <div className="history-controls">
           <div className="history-search-row">
              <div className="history-search-wrap">
                 <Search size={16} className="history-search-icon" />
                 <input 
                   type="text" 
                   placeholder="Search your designs..."
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   className="history-search-input"
                 />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="history-adv-search-btn"
              >
                <SlidersHorizontal size={16} />
                <span>Advanced Search</span>
              </motion.button>
           </div>

           <div className="history-filters-scroll">
              <div className="history-filter-label">
                 <Filter size={12} />
                 <span className="history-filter-text">Tags</span>
              </div>
              {filters.map(filter => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveFilter(filter)}
                  className={`history-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                >
                   {filter}
                </motion.button>
              ))}
           </div>
        </div>
      </div>

      <div className="history-gallery custom-scrollbar">
        <AnimatePresence mode="popLayout">
           {filteredHistory.length > 0 ? (
             <motion.div 
               layout
               className={viewType === 'grid' ? "history-grid-view" : "history-list-view"}
             >
                {filteredHistory.map((item) => (
                  <HistoryCard key={item.id} item={item} viewType={viewType} />
                ))}
             </motion.div>
           ) : (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="history-empty-state"
             >
                <div className="history-empty-icon">
                   <Search size={32} />
                </div>
                <h3 className="history-empty-title">No designs found</h3>
                <p className="history-empty-desc">We couldn't find any designs matching your search or filters.</p>
                <button 
                  onClick={() => { setSearch(''); setActiveFilter('All'); }}
                  className="history-clear-btn"
                >
                  Clear all filters
                </button>
             </motion.div>
           )}
        </AnimatePresence>
      </div>

      <div className="history-sparkle-float">
         <div className="history-sparkle-box">
            <Sparkles size={18} className="text-indigo-400 animate-pulse" />
            <div className="history-sparkle-dot" />
         </div>
      </div>
    </div>
  );
}
