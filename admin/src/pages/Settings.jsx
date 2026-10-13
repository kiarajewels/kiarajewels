import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Settings as SettingsIcon, ShieldCheck, Mail, CreditCard, Server, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const [storeName, setStoreName] = useState('Kiara Jewels');
  const [supportEmail, setSupportEmail] = useState('kiarajewels.co@gmail.com');
  const [currency, setCurrency] = useState('INR (₹)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('System settings saved successfully');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="text-2xl font-serif tracking-wide text-neutral-900">SYSTEM SETTINGS</h1>
          <p className="text-sm text-neutral-500 mt-1">Configure global store parameters, integrations, and administration preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center px-5 py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
          style={{ borderRadius: '1px' }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Profile Card */}
        <div className="bg-white border border-neutral-200 p-6 space-y-4" style={{ borderRadius: '1px' }}>
          <div className="flex items-center gap-3 text-neutral-900 font-medium pb-3 border-b border-neutral-100">
            <SettingsIcon className="w-5 h-5 text-neutral-700" />
            <h2 className="text-base tracking-wide uppercase">Store Profile</h2>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1.5">Brand / Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-black"
              style={{ borderRadius: '1px' }}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1.5">Primary Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-black"
              style={{ borderRadius: '1px' }}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1.5">Default Currency</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 text-sm bg-neutral-50"
              style={{ borderRadius: '1px' }}
              readOnly
            />
          </div>
        </div>

        {/* Integration Status Card */}
        <div className="bg-white border border-neutral-200 p-6 space-y-4" style={{ borderRadius: '1px' }}>
          <div className="flex items-center gap-3 text-neutral-900 font-medium pb-3 border-b border-neutral-100">
            <Server className="w-5 h-5 text-neutral-700" />
            <h2 className="text-base tracking-wide uppercase">Services & Health</h2>
          </div>
          
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-neutral-700" />
                <span className="text-sm font-medium text-neutral-800">Razorpay Payment Gateway</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neutral-700" />
                <span className="text-sm font-medium text-neutral-800">Nodemailer SMTP Dispatch</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-neutral-700" />
                <div>
                  <span className="text-sm font-medium text-neutral-800 block">JWT Admin Auth & Security</span>
                  <span className="text-xs text-neutral-500">24-hour automatic session lock policy</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> 24h Lock Active
              </span>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-neutral-200 p-6 space-y-4 md:col-span-2" style={{ borderRadius: '1px' }}>
          <div className="flex items-center gap-3 text-neutral-900 font-medium pb-3 border-b border-neutral-100">
            <Mail className="w-5 h-5 text-neutral-700" />
            <h2 className="text-base tracking-wide uppercase">Operational Notifications</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">Automated Order Status & Return Emails</p>
              <p className="text-xs text-neutral-500">Send automatic customer receipt, dispatch updates, and return refund notifications.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
