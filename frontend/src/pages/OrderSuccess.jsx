import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Package } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="container section-padding">
      <div className="card-box" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ color: 'var(--success)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <CheckCircle2 size={64} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
          Thank You! Your Order is Placed.
        </h1>

        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
          We have received your order successfully. It is now being prepared for shipment.
        </p>

        {id && (
          <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', display: 'inline-block', marginBottom: '28px', textAlign: 'left' }}>
            <div style={{ marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID: </span>
              <strong style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--primary)' }}>{id}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
              <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                ✓ Paid via Razorpay Test Mode
              </span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/my-orders" className="btn btn-primary">
            <Package size={16} />
            <span>Track in My Orders</span>
          </Link>
          <Link to="/products" className="btn btn-outline">
            <ShoppingBag size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
