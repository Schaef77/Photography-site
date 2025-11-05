import React from 'react';

export default function FormTextarea({
  label,
  name,
  register,
  error,
  required = false,
  placeholder = '',
  rows = 6
}) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label
        htmlFor={name}
        style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#ffffff',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        {label} {required && <span style={{ color: '#c9a961' }}>*</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        {...register}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.875rem 1rem',
          backgroundColor: '#1a1f2e',
          border: error ? '2px solid #ef4444' : '2px solid #2a2f3e',
          borderRadius: '0.5rem',
          color: '#ffffff',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          fontFamily: 'Montserrat, sans-serif',
          resize: 'vertical',
          minHeight: '150px'
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = '#c9a961';
            e.target.style.boxShadow = '0 0 0 3px rgba(201, 169, 97, 0.1)';
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#2a2f3e';
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#ef4444',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          {error.message}
        </p>
      )}
    </div>
  );
}
