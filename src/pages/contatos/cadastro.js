import React, { useState } from 'react';
import './ContactForm.css';
import { formatBrazilianPhone, isValidBrazilianCellphone, isValidContactEmail } from '../../utils/contactValidation';

const ContactForm = () => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'phone' ? formatBrazilianPhone(value) : value;

    setContact({
      ...contact,
      [name]: newValue,
    });

    if (name === 'email') {
      setEmailValid(value.length === 0 || isValidContactEmail(value));
    }

    if (name === 'phone') {
      setPhoneValid(newValue.length === 0 || isValidBrazilianCellphone(newValue));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(contact);
    setContact({
      name: '',
      email: '',
      phone: '',
    });
  };

  return (
    <div className="contact-form-container">
      <h2 className="titulo">Cadastrar Contato</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={contact.name}
            onChange={handleInputChange}
            placeholder="Nome"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
          {!emailValid && <p className="error-message">Insira um e-mail valido</p>}
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            value={contact.phone}
            onChange={handleInputChange}
            placeholder="Telefone"
            required
          />
          {!phoneValid && <p className="error-message">O numero de telefone deve ter o formato (DDD) 9XXXX-XXXX</p>}
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default ContactForm;
