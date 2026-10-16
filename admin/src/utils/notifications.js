// Utility for Web Audio Chime and Browser Push Notifications for Admin Panel

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Warm up AudioContext on initial admin touch/click to comply with browser autoplay policy
export const initAudioContext = () => {
  try {
    getAudioContext();
  } catch (e) {
    console.warn('AudioContext init error:', e);
  }
};

/**
 * Plays a pleasant luxury double-chime (D5 -> A5) alert sound.
 * Synthesized directly via Web Audio API so no external audio file or network fetch is needed.
 */
export const playOrderAlertSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // Tone 2: 880.00 Hz (A5) - higher chime with sustain
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.12);
    gain2.gain.setValueAtTime(0.001, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.35, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.95);
  } catch (err) {
    console.warn('Unable to play audio alert:', err);
  }
};

export const isNotificationSupported = () => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    initAudioContext();
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
};

/**
 * Triggers a native Chrome OS/browser notification banner.
 */
export const showOrderNotification = ({ title, body, onClick }) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  try {
    const options = {
      body: body || 'A customer just placed a new order.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'kiara-new-order',
      renotify: true,
      requireInteraction: true
    };

    // If ServiceWorker registration is available (recommended for mobile Chrome)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, options);
      }).catch(() => {
        const notif = new Notification(title, options);
        notif.onclick = () => {
          window.focus();
          if (onClick) onClick();
        };
      });
    } else {
      const notif = new Notification(title, options);
      notif.onclick = () => {
        window.focus();
        if (onClick) onClick();
      };
    }
  } catch (err) {
    console.warn('Could not display system notification:', err);
  }
};
