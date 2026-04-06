import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookMarked, Filter, 
  ChevronDown, PackagePlus, ArrowUpRight 
} from 'lucide-react';
import SavedCard from './SavedCard';
import { MOCK_SAVED_DESIGNS } from '../../data/mockData';
import './SavedPage.css';

export default function SavedPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Saved');

  const filters = ['All', 'High Scale', 'MVP', 'Optimized', 'Kafka', 'Fintech', 'Communication'];
  
  const filteredSaved = MOCK_SAVED_DESIGNS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || item.tags.includes(activeFilter) || item.category.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="saved-page-wrapper">
      <div className="saved-ambient-bg">
        <div className="orb saved-orb-1" />
        <div className="orb saved-orb-2" />
      </div>

      <div className="saved-header">
        <div className="saved-header-top">
          <div className="saved-title-wrap">
             <div className="saved-icon-wrap">
                <BookMarked size={22} />
             </div>
             <div>
               <h1 className="saved-title">Saved Designs</h1>
               <p className="saved-subtitle">Your bookmarked and reusable system architectures</p>
             </div>
          </div>

          <motion.button 
             whileHover={{ scale: 1.02, y: -2 }}
             whileTap={{ scale: 0.98 }}
             className="saved-create-btn"
          >
             <PackagePlus size={18} />
             <span>Create New Design</span>
          </motion.button>
        </div>

        <div className="saved-controls">
           <div className="saved-search-row">
              <div className="saved-search-wrap">
                 <Search size={18} className="saved-search-icon" />
                 <input 
                   type="text" 
                   placeholder="Search saved designs (e.g., 'E-commerce', 'Payment')..."
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   className="saved-search-input"
                 />
              </div>

              <div className="saved-sort-wrap">
                 <span className="saved-sort-label">Sort By</span>
                 <p className="saved-sort-value">{sortBy}</p>
                 <ChevronDown size={14} className="saved-sort-icon" />
              </div>
           </div>

           <div className="saved-filters-scroll">
              <div className="saved-filter-label">
                 <Filter size={12} />
                 <span className="saved-filter-text">Filter</span>
              </div>
              {filters.map(filter => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveFilter(filter)}
                  className={`saved-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                >
                   {filter}
                </motion.button>
              ))}
           </div>
        </div>
      </div>

      <div className="saved-gallery custom-scrollbar">
        <AnimatePresence mode="popLayout">
           {filteredSaved.length > 0 ? (
             <motion.div 
               layout
               className="saved-grid-view"
             >
                {filteredSaved.map((item) => (
                  <SavedCard key={item.id} item={item} />
                ))}
             </motion.div>
           ) : (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="saved-empty-state"
             >
                <div className="saved-empty-icon">
                   <div className="saved-empty-glow" />
                   <BookMarked size={36} className="relative z-10 text-[#333]" />
                </div>
                <h3 className="saved-empty-title">No Saved Designs Yet</h3>
                <p className="saved-empty-desc">
                  Start creating and bookmarking architectures to build your own curated collection of system blueprints.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="saved-first-design-btn"
                >
                  Create Your First Design
                  <ArrowUpRight size={14} />
                </motion.button>
             </motion.div>
           )}
        </AnimatePresence>
      </div>

      <div className="saved-decor-float">
         <div className="saved-decor-dot animate-pulse" />
         <span className="saved-decor-text">ArchitectAI Vault</span>
      </div>
    </div>
  );
}
