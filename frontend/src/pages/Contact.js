import React, { useState } from 'react';
import axios from 'axios'; // استخدام axios لإرسال الطلب إلى السيرفر
import { Link } from 'react-router-dom'; // إضافة Link للرجوع إلى الصفحة الرئيسية
import { FaHome } from 'react-icons/fa'; // استيراد أيقونة المنزل
import './Contact.css';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // إرسال الطلب إلى الخادم باستخدام axios
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-email`, {
        email,
        subject,
        message,
      });

      if (response.status === 200) {
        setIsSent(true);
        setError(null); // مسح أي أخطاء سابقة
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError('فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="contact-container">
      <h2>تواصل معنا</h2>
      {!isSent ? (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>العنوان (اختياري)</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>النص</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit">إرسال</button>
          {error && <p className="error-message">{error}</p>} {/* إظهار رسالة خطأ إذا حدثت */}
        </form>
      ) : (
        <p>تم إرسال الرسالة بنجاح!</p>
      )}
      <Link to="/" className="home-icon">
        <FaHome size={30} /> {/* إضافة أيقونة المنزل */}
      </Link>
    </div>
  );
};

export default Contact;
