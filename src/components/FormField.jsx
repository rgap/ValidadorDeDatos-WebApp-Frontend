import React from 'react';

/**
 * FormField — campo de texto con placeholder y etiqueta flotante al escribir.
 */
function FormField({ id, label, type, value, onChange, error }) {
  const tieneValor = value !== '';

  return (
    <div className="form-field">
      {tieneValor && (
        <label className="form-field__floating-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`form-field__input${error ? ' form-field__input--error' : ''}`}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
      />
      {error && (
        <span className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
