import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import background from '../images/back.jpg';
import logo from '../images/logo.jpg';

const Header = () => {
  const [isCalling, setIsCalling] = useState(false);

  const handleCall = () => {
    setIsCalling(true);
    window.location.href = 'tel:+966533259414';
    setTimeout(() => {
      setIsCalling(false);
    }, 3000); // إعادة اللون بعد 3 ثوانٍ
  };

  return (
    <header className="menu-header">
      <img src={background} alt="Background" className="background-image" />
      <div className="header-content">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <div className="icons-container">
          <div className="icon-item" onClick={handleCall}>
            <FontAwesomeIcon
              icon={faPhone}
              size="2x"
              className={`phone-icon ${isCalling ? 'calling' : ''}`}
            />
            <p className="icon-text"> </p>
          </div>
          {/* أيقونات أخرى يمكن إضافتها هنا */}
        </div>
      </div>
    </header>
  );
};

export default Header;
