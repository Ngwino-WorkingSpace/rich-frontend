import React, { useState } from 'react';
import { api } from '../../services/api';

const Field = ({ label, placeholder, type = 'text', required=false, value, onChange }) => {
  return (
    <div className="flex flex-col gap-3 font-poppins">
      <label className="text-yellow-400 text-base md:text-lg font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="bg-[#EBC4854D] border border-yellow-600/60 rounded-lg px-5 py-3 text-base md:text-lg text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-yellow-400"
      />
    </div>
  );
};

const SupportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.sendSupport(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to send support message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mr-0 md:mr-[100px]">
      <div className="border border-yellow-600 rounded-md p-5 md:p-8 bg-black/40 font-poppins">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Field 
            label="Name" 
            placeholder="Will Smith" 
            required 
            value={formData.name}
            onChange={(e) => {
              const event = { target: { name: 'name', value: e.target.value } };
              handleChange(event);
            }}
          />
          <Field 
            label="Email" 
            placeholder="willsmith@gmail.com" 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => {
              const event = { target: { name: 'email', value: e.target.value } };
              handleChange(event);
            }}
          />
          <div className="flex flex-col gap-2">
            <label className="text-yellow-400 text-base md:text-lg font-medium">Message</label>
            <textarea
              name="message"
              placeholder="Type something..."
              rows={6}
              required
              value={formData.message}
              onChange={handleChange}
              className="bg-[#EBC4854D] border border-yellow-600/60 rounded-lg px-5 py-3 text-base md:text-lg text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-yellow-400"
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500 rounded-lg p-3">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-400 text-sm bg-green-500/10 border border-green-500 rounded-lg p-3">
              Support message sent successfully! We'll get back to you soon.
            </div>
          )}
          
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-bold">{loading ? 'Sending...' : 'Send'}</span>
              <span className="inline-block w-7 h-7 rounded-full bg-black text-yellow-400 flex items-center justify-center font-bold">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportForm;