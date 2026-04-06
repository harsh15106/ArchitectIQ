import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, User, Monitor, Brain, 
  Bell, Database, ShieldAlert, Sparkles, Save, 
  Trash2, Download, LogOut 
} from 'lucide-react';
import { SettingsSection, ToggleSwitch, InputField, DropdownSelect } from './SettingsUI';
import './SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Account');
  const [isSaving, setIsSaving] = useState(false);

  // --- Settings State (Mock) ---
  const [account, setAccount] = useState({ name: 'User', email: 'user@example.com' });
  const [appearance, setAppearance] = useState({ theme: 'Dark', animations: true, compact: false, highContrast: false });
  const [aiPrefs, setAiPrefs] = useState({ style: 'Scalable', output: 'Single Design', depth: 'Intermediate' });
  const [notifications, setNotifications] = useState({ email: true, alerts: true, updates: false });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000); // Simulate API call
  };

  const navItems = [
    { icon: User, label: 'Account' },
    { icon: Monitor, label: 'Appearance' },
    { icon: Brain, label: 'AI Preferences' },
    { icon: Bell, label: 'Notifications' },
    { icon: Database, label: 'Data & Privacy' },
  ];

  return (
    <div className="settings-page-wrapper">
      <header className="settings-header">
        <div className="settings-title-wrap">
           <div className="settings-icon-wrap">
              <SettingsIcon size={22} />
           </div>
           <div>
             <h1 className="settings-title">Settings</h1>
             <p className="settings-subtitle">Manage your personal and system configurations</p>
           </div>
        </div>

        <motion.button 
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`settings-save-btn ${isSaving ? 'saving' : 'normal'}`}
        >
           {isSaving ? <Sparkles size={16} className="animate-spin" /> : <Save size={16} />}
           <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
        </motion.button>
      </header>

      <div className="settings-main">
         <aside className="settings-sidebar">
            {navItems.map(item => (
              <button 
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`settings-nav-btn ${activeTab === item.label ? 'active' : 'inactive'}`}
              >
                <item.icon size={16} strokeWidth={2.5} />
                {item.label}
              </button>
            ))}

            <div className="settings-logout-wrap">
               <button className="settings-logout-btn">
                  <LogOut size={16} strokeWidth={2.5} />
                  Log Out
               </button>
            </div>
         </aside>

         <main className="settings-content-area custom-scrollbar">
            <div className="settings-content-inner">
               <AnimatePresence mode="wait">
                  {activeTab === 'Account' && (
                    <SettingsSection key="account" title="Account Settings" description="Your personal identification and profile information.">
                       <div className="settings-avatar-row">
                          <div className="settings-avatar-circle">
                            U
                          </div>
                          <div className="settings-avatar-actions">
                             <button className="settings-avatar-change-btn">
                                Change Avatar
                             </button>
                             <button className="settings-avatar-remove-btn">
                                Remove Picture
                             </button>
                          </div>
                       </div>
                       <InputField label="Display Name" value={account.name} onChange={v => setAccount({...account, name: v})} placeholder="Your full name" />
                       <InputField label="Email Address" value={account.email} onChange={v => setAccount({...account, email: v})} placeholder="email@example.com" type="email" />
                       <InputField label="Connected ID" value="USER-82910" readOnly={true} placeholder="" />
                    </SettingsSection>
                  )}

                  {activeTab === 'Appearance' && (
                    <SettingsSection key="appearance" title="Appearance Settings" description="Customize how the AI workspace looks and feels on your machine.">
                       <DropdownSelect label="Theme Mode" options={['Dark', 'Light', 'System']} value={appearance.theme} onChange={v => setAppearance({...appearance, theme: v})} />
                       <div className="settings-divider" />
                       <ToggleSwitch label="Enable Animations" description="Smooth transitions and spring effects on interactions." enabled={appearance.animations} onChange={v => setAppearance({...appearance, animations: v})} />
                       <ToggleSwitch label="Compact Layout" description="Reduce padding and text size for higher architecture density." enabled={appearance.compact} onChange={v => setAppearance({...appearance, compact: v})} />
                       <ToggleSwitch label="High Contrast Mode" description="Stronger borders and sharper text for accessibility." enabled={appearance.highContrast} onChange={v => setAppearance({...appearance, highContrast: v})} />
                    </SettingsSection>
                  )}

                  {activeTab === 'AI Preferences' && (
                    <SettingsSection key="ai" title="AI Preferences" description="Configure engine behavior for architecture generation.">
                       <DropdownSelect label="Preferred Architecture style" options={['MVP', 'Scalable', 'Balanced', 'Serverless First']} value={aiPrefs.style} onChange={v => setAiPrefs({...aiPrefs, style: v})} />
                       <DropdownSelect label="Output Generation Mode" options={['Single Design', 'Multi-design Comparison']} value={aiPrefs.output} onChange={v => setAiPrefs({...aiPrefs, output: v})} />
                       <DropdownSelect label="Explanation Depth" options={['Basic', 'Intermediate', 'Advanced explanations']} value={aiPrefs.depth} onChange={v => setAiPrefs({...aiPrefs, depth: v})} />
                       <div className="settings-note-box">
                          <p className="settings-note-text">
                            <strong>Note:</strong> Higher depth levels provide more detailed justification for component selection but may increase generation time.
                          </p>
                       </div>
                    </SettingsSection>
                  )}

                  {activeTab === 'Notifications' && (
                    <SettingsSection key="notifications" title="Notifications" description="Keep track of your projects and system design updates.">
                       <ToggleSwitch label="Email Notifications" description="Weekly digest of your saved designs and updates." enabled={notifications.email} onChange={v => setNotifications({...notifications, email: v})} />
                       <ToggleSwitch label="System Activity Alerts" description="Notify when a background architecture job completes." enabled={notifications.alerts} onChange={v => setNotifications({...notifications, alerts: v})} />
                       <ToggleSwitch label="Platform Product Updates" description="Be first to know about new AI engine features." enabled={notifications.updates} onChange={v => setNotifications({...notifications, updates: v})} />
                    </SettingsSection>
                  )}

                  {activeTab === 'Data & Privacy' && (
                    <SettingsSection key="data" title="Data Management" description="Manage your sensitive history and storage.">
                       <div className="flex flex-col gap-4">
                          <button className="settings-export-btn">
                             <div className="settings-export-left">
                                <Download size={16} className="settings-export-icon" />
                                <span className="settings-export-text">Export Portfolio Data</span>
                             </div>
                             <ArrowUpRight size={14} className="settings-export-arrow" />
                          </button>
                          
                          <div className="settings-divider" />
                          
                          <div className="settings-danger-zone">
                             <h4 className="settings-danger-title">
                                <ShieldAlert size={12} />
                                Danger Zone
                             </h4>
                             
                             <button className="settings-danger-btn">
                                <Trash2 size={16} className="settings-danger-btn-icon" />
                                <span className="settings-danger-btn-text">Clear All History Sessions</span>
                             </button>
                             
                             <button className="settings-danger-btn">
                                <Trash2 size={16} className="settings-danger-btn-icon" />
                                <span className="settings-danger-btn-text">Delete Account Forever</span>
                             </button>
                          </div>
                       </div>
                    </SettingsSection>
                  )}
               </AnimatePresence>
            </div>
         </main>
      </div>

      <div className="settings-ambient-bg">
        <div className="orb settings-orb" />
      </div>
    </div>
  );
}

function ArrowUpRight({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
