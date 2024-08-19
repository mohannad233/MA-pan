import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHome } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState(null);
  const [section, setSection] = useState('');
  const [available, setAvailable] = useState('متاح');
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.post('http://localhost:3001/products/get_all');
      setProducts(response.data);
    } catch (error) {
      console.error('There was an error fetching the products!', error);
    }
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (calories) formData.append('calories', calories);
    if (image) formData.append('image', image);
    formData.append('section', section);
    formData.append('available', available === 'متاح' ? 'true' : 'false');

    try {
      let response;
      if (editMode) {
        response = await axios.post(`http://localhost:3001/products/update/${editProductId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('http://localhost:3001/products/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      console.log('Product successfully added/updated:', response.data);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('There was an error adding/updating the product!', error.response || error);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCalories('');
    setImage(null);
    setSection('');
    setAvailable('متاح');
    setEditMode(false);
    setEditProductId(null);
  };

  const handleEditProduct = (product) => {
    setName(product.name);
    setPrice(product.price);
    setCalories(product.calories || '');
    setSection(product.section); // تعديل هنا ليتوافق مع MongoDB
    setAvailable(product.available ? 'متاح' : 'غير متاح');
    setEditMode(true);
    setEditProductId(product._id); // استخدام _id مع MongoDB
  };

  const handleDeleteProduct = async (id) => {
    try {
      console.log('Trying to delete product with id:', id); // Debugging
      await axios.post(`http://localhost:3001/products/delete/${id}`);
      console.log('Product deleted successfully.');
      fetchProducts(); // إعادة تحميل المنتجات بعد الحذف
    } catch (error) {
      console.error('There was an error deleting the product!', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // تنظيم المنتجات حسب الأقسام
  const groupedProducts = products.reduce((acc, product) => {
    const section = product.section || 'غير محدد'; // تعديل هنا ليتوافق مع MongoDB
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(product);
    return acc;
  }, {});

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>لوحة إدارة المنتجات</h1>
        <a href="/" className="home-icon"><FaHome /></a>
      </header>
      <form onSubmit={handleAddOrUpdateProduct} className="product-form">
        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="السعرات الحرارية (اختياري)"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.svg,.pdf"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          required
        >
          <option value="" disabled>اختر القسم</option>
          <option value="سندويتشات">سندويتشات</option>
          <option value="صوصات">صوصات</option>
          <option value="فطور">فطور</option>
          <option value="عصيرات">عصيرات</option>
        </select>
        <select
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
          required
        >
          <option value="متاح">متاح</option>
          <option value="غير متاح">غير متاح</option>
        </select>
        {available === 'غير متاح' && <p style={{ color: 'red' }}>هذا المنتج غير متاح</p>}
        <button type="submit">{editMode ? 'تحديث المنتج' : 'إضافة المنتج'}</button>
      </form>
      <h2>المنتجات</h2>
      {Object.keys(groupedProducts).map(section => (
        <div key={section} className="product-section">
          <h3 className="section-title">قسم {section}</h3>
          <div className="product-grid">
            {groupedProducts[section].map(product => (
              <div className={`product-card ${product.available ? '' : 'unavailable'}`} key={product._id}>
                <img src={`http://localhost:3001${product.image}`} alt={product.name} className="product-image" loading="lazy" />
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>السعر: ${product.price}</p>
                  <p>السعرات الحرارية: {product.calories} kcal</p>
                  <p>القسم: {product.section}</p>
                  <p>متاح: {product.available ? 'نعم' : 'لا'}</p>
                  <button onClick={() => handleEditProduct(product)} className="edit-button">تعديل</button>
                  <button onClick={() => handleDeleteProduct(product._id)}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
