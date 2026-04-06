import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, BookMarked, Filter, 
  ChevronDown, PackagePlus, ArrowUpRight, 
  X, LayoutTemplate, Tag, Calendar, Star, Clock, FileText
} from 'lucide-react';
import SavedCard from './SavedCard';
import { MOCK_SAVED_DESIGNS, MOCK_DIAGRAM } from '../../data/mockData';
import MermaidDiagram from '../../components/ArchitecturePanel/MermaidDiagram';
import './SavedPage.css';

export default function SavedPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Saved');
  const [selectedDesign, setSelectedDesign] = useState(null);

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
                  <SavedCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => setSelectedDesign(item)}
                  />
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
                   <BookMarked size={36} className="relative z-10 text-[var(--accent)]" />
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

      {/* --- Architecture Diagram Modal (ULTRA PREMIUM) --- */}
      <AnimatePresence>
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="saved-modal-backdrop"
            onClick={() => setSelectedDesign(null)}
          >
            <motion.div
              layoutId={`card-${selectedDesign.id}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="saved-modal-container"
            >
              {/* Modal Header */}
              <div className="saved-modal-header">
                <div className="saved-title-wrap" style={{ gap: '16px' }}>
                  <div className="saved-icon-wrap" style={{ width: '44px', height: '44px', borderRadius: '12px' }}>
                    <LayoutTemplate size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {selectedDesign.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, margin: '2px 0 0 0' }}>
                      {selectedDesign.category} Vault
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDesign(null)}
                  className="saved-modal-close"
                  title="Close Modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body / 2-Column Viewer */}
              <div className="saved-modal-body">
                {/* Fixed Information Sidebar (Tags, Stats, Description) */}
                <div className="saved-modal-sidebar custom-scrollbar">
                  
                  <h4 className="saved-modal-section-title">
                    <FileText size={12} /> Blueprint Summary
                  </h4>
                  <p className="saved-modal-desc">
                    {selectedDesign.summary}
                  </p>
                  
                  <div className="saved-meta-list">
                    <div className="saved-meta-item">
                       <span className="saved-meta-label">Domain Topology</span>
                       <div className="saved-meta-val">
                         <Tag size={14} style={{ color: 'var(--accent)' }}/>
                         <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                           {selectedDesign.tags.map(tag => (
                             <span key={tag} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px' }}>{tag}</span>
                           ))}
                         </div>
                       </div>
                    </div>

                    <div className="saved-meta-item">
                       <span className="saved-meta-label">Design Snapshot</span>
                       <div className="saved-meta-val">
                         <Calendar size={14} style={{ color: 'var(--accent)' }}/>
                         <span>{selectedDesign.savedDate}</span>
                       </div>
                    </div>

                    <div className="saved-meta-item">
                       <span className="saved-meta-label">Last Iteration</span>
                       <div className="saved-meta-val">
                         <Clock size={14} style={{ color: 'var(--accent)' }}/>
                         <span>{selectedDesign.modifiedTime}</span>
                       </div>
                    </div>
                    
                    <div className="saved-meta-item">
                       <span className="saved-meta-label">Efficiency Rating</span>
                       <div className="saved-meta-val">
                         <Star size={14} style={{ color: 'var(--accent)' }} fill="var(--accent)" />
                         <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{selectedDesign.rating} / 5.0</span>
                         {selectedDesign.isPinned && (
                           <span style={{ fontSize: '10px', background: 'var(--accent)', color: '#000', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', fontWeight: 800 }}>PINNED</span>
                         )}
                       </div>
                    </div>
                  </div>
                  
                </div>

                {/* Vast Interactive Canvas */}
                <div className="saved-modal-main">
                  <div className="saved-modal-blueprint-bg" />
                  <div className="saved-modal-diagram-wrap custom-scrollbar">
                    <MermaidDiagram diagram={selectedDesign.diagram || MOCK_DIAGRAM} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
