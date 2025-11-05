'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0) // Honeypot field - should be empty
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [isVisible, setIsVisible] = useState(false);
  const successMessageRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      honeypot: ''
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to success message when it appears
  useEffect(() => {
    if (submitStatus === 'success' && successMessageRef.current) {
      setTimeout(() => {
        successMessageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [submitStatus]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        reset(); // Clear form
      } else {
        setSubmitStatus('error');
        console.error('Form submission error:', result.error);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 600ms ease-out'
    }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Honeypot field - hidden from users, catches bots */}
        <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('honeypot')}
          />
        </div>

        <FormInput
          label="Name"
          name="name"
          register={register('name')}
          error={errors.name}
          required
          placeholder="Your name"
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          register={register('email')}
          error={errors.email}
          required
          placeholder="your.email@example.com"
        />

        <FormInput
          label="Subject"
          name="subject"
          register={register('subject')}
          error={errors.subject}
          required
          placeholder="What's this about?"
        />

        <FormTextarea
          label="Message"
          name="message"
          register={register('message')}
          error={errors.message}
          required
          placeholder="Tell me about your project, vision, or any questions you have..."
          rows={6}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            backgroundColor: isSubmitting ? '#8a7a51' : '#c9a961',
            color: '#141414',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'Montserrat, sans-serif',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            opacity: isSubmitting ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.target.style.backgroundColor = '#d4b36d';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(201, 169, 97, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.target.style.backgroundColor = '#c9a961';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #141414',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                marginRight: '0.5rem'
              }} />
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </button>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div
            ref={successMessageRef}
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid #22c55e',
              borderRadius: '0.5rem',
              animation: 'fadeIn 0.5s ease-in'
            }}>
            <h3 style={{
              color: '#22c55e',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              Message Sent Successfully!
            </h3>
            <p style={{
              color: '#ffffff',
              fontSize: '1rem',
              lineHeight: '1.6',
              textAlign: 'center',
              margin: 0
            }}>
              Thank you for reaching out! I'm excited to hear about your vision and bring your creative ideas to life.
              I'll review your message and get back to you within 24-48 hours. Get ready for something amazing!
            </p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid #ef4444',
            borderRadius: '0.5rem',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <h3 style={{
              color: '#ef4444',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              Oops! Something went wrong
            </h3>
            <p style={{
              color: '#ffffff',
              fontSize: '1rem',
              lineHeight: '1.6',
              textAlign: 'center',
              margin: 0
            }}>
              We couldn't send your message. Please try again or reach out directly via email.
            </p>
          </div>
        )}
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
