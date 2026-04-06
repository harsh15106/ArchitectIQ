import { motion } from 'framer-motion';
import './SettingsPage.css';

export function SettingsSection({ title, description, children }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="settings-ui-section"
    >
      <div className="settings-ui-header">
        <h3 className="settings-ui-title">{title}</h3>
        {description && <p className="settings-ui-desc">{description}</p>}
      </div>
      <div className="settings-ui-content">
        {children}
      </div>
    </motion.section>
  );
}

export function ToggleSwitch({ label, description, enabled, onChange }) {
  return (
    <div className="settings-ui-toggle-wrap">
      <div className="settings-ui-toggle-text">
        <span className="settings-ui-toggle-label">{label}</span>
        {description && <span className="settings-ui-toggle-desc">{description}</span>}
      </div>
      <button 
        onClick={() => onChange(!enabled)}
        className={`settings-ui-toggle-btn ${enabled ? 'active' : ''}`}
      >
        <motion.div 
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="settings-ui-toggle-thumb"
          style={{ x: enabled ? 18 : 0 }}
        />
      </button>
    </div>
  );
}

export function InputField({ label, value, onChange, placeholder, type = 'text', readOnly = false }) {
  return (
    <div className="settings-ui-input-wrap">
      <label className="settings-ui-field-label">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="settings-ui-input"
      />
    </div>
  );
}

export function DropdownSelect({ label, options, value, onChange }) {
  return (
    <div className="settings-ui-input-wrap">
      <label className="settings-ui-field-label">{label}</label>
      <select 
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="settings-ui-select"
      >
        {options.map(opt => (
          <option key={opt} value={opt} className="settings-ui-option">{opt}</option>
        ))}
      </select>
    </div>
  );
}
