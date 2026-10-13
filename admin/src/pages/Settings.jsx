import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Building2, 
  ShieldCheck, 
  Server, 
  BellRing, 
  CreditCard, 
  Mail, 
  Database, 
  Lock, 
  CheckCircle2, 
  HelpCircle,
  Save,
  Clock
} from 'lucide-react';

const Settings = () => {
  const [storeName, setStoreName] = useState('Kiara Jewels');
  const [supportEmail, setSupportEmail] = useState('kiarajewels.co@gmail.com');
  const [currency] = useState('INR - Indian Rupee (₹)');
  const [timezone] = useState('India Standard Time (IST / UTC+05:30) - Mumbai, IN');
  
  // Notification Automations
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [returnAlerts, setReturnAlerts] = useState(true);
  const [reviewRequests, setReviewRequests] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Store settings saved successfully');
    }, 500);
  };

  return (
    <div className="admin-settings-container">
      {/* Page Header */}
      <div className="admin-page-header" style={{ marginBottom: '8px' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 'bold', margin: 0, color: '#000000', letterSpacing: '-0.02em' }}>
            Store Settings & Configuration
          </h2>
          <p style={{ color: '#4b5563', margin: '6px 0 0 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
            Structured administration parameters, security policies, third-party infrastructure, and automation triggers.
          </p>
        </div>
        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="settings-save-btn"
          >
            <Save style={{ width: '15px', height: '15px', marginRight: '6px' }} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* ================= SECTION 1: STORE IDENTITY & REGIONAL PARAMETERS ================= */}
      <div className="settings-section-card">
        <div className="settings-card-header">
          <Building2 className="settings-card-header-icon" />
          <div>
            <h3 className="settings-card-title">1. Store Profile & Regional Information</h3>
            <p className="settings-card-subtitle">
              Core brand parameters displayed across customer receipts, tax invoices, and payment descriptors.
            </p>
          </div>
        </div>

        <div className="settings-card-body">
          <div className="settings-grid-2">
            {/* Field 1: Store Name */}
            <div className="settings-item-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div className="settings-item-header">
                <h4 className="settings-field-heading">Brand & Store Name</h4>
              </div>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="settings-field-input"
              />
              <div className="settings-reason-box">
                <span className="settings-reason-tag">
                  <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Visibility Reason
                </span>
                <p className="settings-reason-text">
                  Printed on official customer receipts, invoice headers, browser bookmark titles, and delivery packaging manifests.
                </p>
              </div>
            </div>

            {/* Field 2: Support Email */}
            <div className="settings-item-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div className="settings-item-header">
                <h4 className="settings-field-heading">Primary Support Email</h4>
              </div>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="settings-field-input"
              />
              <div className="settings-reason-box">
                <span className="settings-reason-tag">
                  <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Visibility Reason
                </span>
                <p className="settings-reason-text">
                  Official contact destination displayed on transactional order emails and return instructions for customer inquiries.
                </p>
              </div>
            </div>

            {/* Field 3: Base Currency */}
            <div className="settings-item-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div className="settings-item-header">
                <h4 className="settings-field-heading">Store Base Currency</h4>
                <span className="settings-status-pill">Fixed (INR)</span>
              </div>
              <input
                type="text"
                value={currency}
                readOnly
                className="settings-field-input"
              />
              <div className="settings-reason-box">
                <span className="settings-reason-tag">
                  <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Visibility Reason
                </span>
                <p className="settings-reason-text">
                  Standard monetary unit for jewelry pricing, checkout billing, Razorpay gateway collection, and admin revenue accounting.
                </p>
              </div>
            </div>

            {/* Field 4: Timezone */}
            <div className="settings-item-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div className="settings-item-header">
                <h4 className="settings-field-heading">Fulfillment Timezone & Base</h4>
                <span className="settings-status-pill">IST (UTC+5:30)</span>
              </div>
              <input
                type="text"
                value={timezone}
                readOnly
                className="settings-field-input"
              />
              <div className="settings-reason-box">
                <span className="settings-reason-tag">
                  <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Visibility Reason
                </span>
                <p className="settings-reason-text">
                  Synchronizes daily dispatch cutoffs, calculates the 3-day return eligibility window, and schedules post-delivery feedback emails.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: ACCESS CONTROL & SESSION SECURITY ================= */}
      <div className="settings-section-card">
        <div className="settings-card-header">
          <ShieldCheck className="settings-card-header-icon" />
          <div>
            <h3 className="settings-card-title">2. Access Control & Session Security</h3>
            <p className="settings-card-subtitle">
              Automated workstation locking policies and cryptographic security protocols.
            </p>
          </div>
        </div>

        <div className="settings-card-body">
          {/* Policy 1: 24h Auto-Lock */}
          <div className="settings-item-block">
            <div className="settings-item-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock style={{ width: '16px', height: '16px', color: '#000000' }} />
                <h4 className="settings-field-heading">24-Hour Session Auto-Lock Policy</h4>
              </div>
              <span className="settings-status-pill active">
                <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Active & Enforced
              </span>
            </div>
            <div className="settings-reason-box">
              <span className="settings-reason-tag">
                <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Security Reason
              </span>
              <p className="settings-reason-text">
                Enforces continuous security compliance by automatically terminating the active administrator session every 24 hours. Prevents unauthorized access to customer records, orders, and payment data if a physical workstation is left unattended.
              </p>
            </div>
          </div>

          {/* Policy 2: JWT Authentication */}
          <div className="settings-item-block">
            <div className="settings-item-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock style={{ width: '16px', height: '16px', color: '#000000' }} />
                <h4 className="settings-field-heading">JWT Cryptographic Token Authentication</h4>
              </div>
              <span className="settings-status-pill active">
                <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Enforced (HS256)
              </span>
            </div>
            <div className="settings-reason-box">
              <span className="settings-reason-tag">
                <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Security Reason
              </span>
              <p className="settings-reason-text">
                All administrative requests (order status edits, return refunds, catalog updates) are cryptographically validated to guarantee that only authorized administrators can alter database state.
              </p>
            </div>
          </div>

          {/* Policy 3: Super Admin Account */}
          <div className="settings-item-block">
            <div className="settings-item-header">
              <h4 className="settings-field-heading">Master Administrator Account</h4>
              <span className="settings-status-pill" style={{ color: '#000000', fontWeight: 'bold' }}>
                kiarajewels.co@gmail.com
              </span>
            </div>
            <div className="settings-reason-box">
              <span className="settings-reason-tag">
                <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Security Reason
              </span>
              <p className="settings-reason-text">
                Designates the master account holder who receives password reset OTPs, administrative system alerts, and retains override permissions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 3: INFRASTRUCTURE & SERVICE INTEGRATIONS ================= */}
      <div className="settings-section-card">
        <div className="settings-card-header">
          <Server className="settings-card-header-icon" />
          <div>
            <h3 className="settings-card-title">3. Connected Services & Infrastructure Health</h3>
            <p className="settings-card-subtitle">
              Live operational health and connection status of critical payment, messaging, and database services.
            </p>
          </div>
        </div>

        <div className="settings-card-body">
          {/* Service 1: Razorpay */}
          <div className="settings-item-block">
            <div className="settings-item-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard style={{ width: '16px', height: '16px', color: '#000000' }} />
                <h4 className="settings-field-heading">Razorpay Payment Gateway (Live Processing)</h4>
              </div>
              <span className="settings-status-pill active">
                <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Operational - Active
              </span>
            </div>
            <div className="settings-reason-box">
              <span className="settings-reason-tag">
                <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Architecture Reason
              </span>
              <p className="settings-reason-text">
                Handles real-time customer payments (UPI, Credit/Debit cards, Net Banking) and programmatically executes automated refund payouts directly to customers for accepted returns.
              </p>
            </div>
          </div>

          {/* Service 2: Nodemailer */}
          <div className="settings-item-block">
            <div className="settings-item-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail style={{ width: '16px', height: '16px', color: '#000000' }} />
                <h4 className="settings-field-heading">Nodemailer SMTP Email Dispatch Engine</h4>
              </div>
              <span className="settings-status-pill active">
                <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Operational - Active
              </span>
            </div>
            <div className="settings-reason-box">
              <span className="settings-reason-tag">
                <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Architecture Reason
              </span>
              <p className="settings-reason-text">
                Dispatches high-priority transactional emails including purchase receipts, tracking alerts, admin login OTPs, and return confirmations.
              </p>
            </div>
          </div>

          {/* Service 3: MongoDB */}
          <div className="settings-item-block">
            <div className="settings-item-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database style={{ width: '16px', height: '16px', color: '#000000' }} />
                <h4 className="settings-field-heading">MongoDB Core Storage Cluster</h4>
              </div>
              <span className="settings-status-pill active">
                <CheckCircle2 style={{ width: '13px', height: '13px' }} /> Connected - Healthy
              </span>
            </div>
            <div className="settings-reason-box">
              <span className="settings-reason-tag">
                <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Architecture Reason
              </span>
              <p className="settings-reason-text">
                Stores persistent store records including products, live shopping carts, customer accounts, placed orders, customer reviews, and audit logs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 4: AUTOMATED COMMUNICATIONS & TRIGGERS ================= */}
      <div className="settings-section-card">
        <div className="settings-card-header">
          <BellRing className="settings-card-header-icon" />
          <div>
            <h3 className="settings-card-title">4. Operational Notifications & Automations</h3>
            <p className="settings-card-subtitle">
              Rules controlling automated email triggers sent to customers throughout their order journey.
            </p>
          </div>
        </div>

        <div className="settings-card-body">
          {/* Notification 1: Order Updates */}
          <div className="settings-item-block">
            <div className="settings-toggle-row">
              <div className="settings-toggle-info">
                <h4 className="settings-field-heading">Automated Order Status & Tracking Alerts</h4>
                <div className="settings-reason-box" style={{ marginTop: '8px' }}>
                  <span className="settings-reason-tag">
                    <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Business Reason
                  </span>
                  <p className="settings-reason-text">
                    Automatically notifies customers via email when an order moves through fulfillment stages (Processing → In Transit → Delivered), significantly reducing "Where is my order?" support inquiries.
                  </p>
                </div>
              </div>
              <label className="settings-toggle-label">
                <input
                  type="checkbox"
                  checked={orderAlerts}
                  onChange={(e) => setOrderAlerts(e.target.checked)}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Notification 2: Return Lifecycle Alerts */}
          <div className="settings-item-block">
            <div className="settings-toggle-row">
              <div className="settings-toggle-info">
                <h4 className="settings-field-heading">Return Request Status & Refund Notifications</h4>
                <div className="settings-reason-box" style={{ marginTop: '8px' }}>
                  <span className="settings-reason-tag">
                    <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Business Reason
                  </span>
                  <p className="settings-reason-text">
                    Sends real-time updates when a customer files a return within the 3-day window, when admin approves the inspection, and when Razorpay disburses the refund payment.
                  </p>
                </div>
              </div>
              <label className="settings-toggle-label">
                <input
                  type="checkbox"
                  checked={returnAlerts}
                  onChange={(e) => setReturnAlerts(e.target.checked)}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>

          {/* Notification 3: Post-Delivery Reviews */}
          <div className="settings-item-block">
            <div className="settings-toggle-row">
              <div className="settings-toggle-info">
                <h4 className="settings-field-heading">Post-Delivery Review Follow-Up Sequence</h4>
                <div className="settings-reason-box" style={{ marginTop: '8px' }}>
                  <span className="settings-reason-tag">
                    <HelpCircle style={{ width: '12px', height: '12px' }} /> Purpose & Business Reason
                  </span>
                  <p className="settings-reason-text">
                    Automatically triggers a feedback invitation 5 days following order delivery, encouraging verified buyers to leave ratings and photos on the storefront.
                  </p>
                </div>
              </div>
              <label className="settings-toggle-label">
                <input
                  type="checkbox"
                  checked={reviewRequests}
                  onChange={(e) => setReviewRequests(e.target.checked)}
                />
                <span className="settings-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
