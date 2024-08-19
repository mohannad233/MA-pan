import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaSnapchat, FaTiktok, FaUserShield } from 'react-icons/fa';
import './Home.css';
import logo from '../images/logo.jpg';

const Home = () => {
  return (
    <div className="home">
      <div className="admin-icon">
        <Link to="/login" className="admin-link">
          <FaUserShield size={30} />
        </Link>
      </div>
      <header className="home-header">
        <img src={logo} alt="بان تيكه" className="logo" />
        <h1>بان تكا</h1>
        <div className="social-icons">
          <a href="https://www.instagram.com/Pan.tikka" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={40} />
          </a>
          <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={40} />
          </a>
          <a href="https://www.snapchat.com/add/ali.yanbu" target="_blank" rel="noopener noreferrer">
            <FaSnapchat size={40} />
          </a>
          <a href="https://www.tiktok.com/@Pan.tikka" target="_blank" rel="noopener noreferrer">
            <FaTiktok size={40} />
          </a>
        </div>
      </header>
      <nav className="home-nav">
        <Link to="/menu" className="nav-link">منيو المطعم - FOOD MENU</Link>
        <Link to="/contact" className="nav-link">تواصل معنا - Contact Us</Link>
        <a href="https://maps.app.goo.gl/vWviT2ZgCudpt7Mq5?g_st=com.google.maps.preview.copy" target="_blank" rel="noopener noreferrer" className="nav-link">
        قيمنا - Values
        </a> {/* تعديل الرابط هنا */}
       
      </nav>
      <div className="home-background"></div> {/* إضافة الخلفية */}
    </div>
  );
};

export default Home;
