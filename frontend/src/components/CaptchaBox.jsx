import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import api from '../services/api';

const CaptchaBox = ({ value, onChange, error }) => {
  const [svg, setSvg] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCaptcha = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/captcha');
      setSvg(res.data.svg);
      setCaptchaToken(res.data.captchaToken);
      if (onChange) {
        onChange({ captchaToken: res.data.captchaToken, captchaInput: '' });
      }
    } catch (err) {
      console.error('Failed to load CAPTCHA:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    if (onChange) {
      onChange({ captchaToken, captchaInput: text });
    }
  };

  return (
    <div className="form-group" style={{ marginTop: '14px', marginBottom: '14px' }}>
      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Security Verification *</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Case-insensitive</span>
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div
          style={{
            height: '42px',
            minWidth: '130px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f1f5f9',
            borderRadius: '4px',
            border: '1px solid #cbd5e1',
            overflow: 'hidden'
          }}
          dangerouslySetInnerHTML={{ __html: svg || '<span style="font-size: 12px; color: #94a3b8;">Loading...</span>' }}
        />

        <button
          type="button"
          onClick={fetchCaptcha}
          disabled={loading}
          className="btn btn-sm btn-outline"
          title="Refresh CAPTCHA"
          style={{ height: '40px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <RotateCw size={14} className={loading ? 'spin' : ''} />
          <span style={{ fontSize: '0.8rem' }}>Refresh</span>
        </button>
      </div>

      <input
        type="text"
        className="form-control"
        required
        placeholder="Type the characters above"
        value={value || ''}
        onChange={handleInputChange}
        maxLength={8}
        autoComplete="off"
        style={{ letterSpacing: '2px', fontWeight: 600 }}
      />
    </div>
  );
};

export default CaptchaBox;
