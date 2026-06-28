export function isValidLoginEmail(email) {
  return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(email || ''));
}

export function validateLoginCredentials(email, password) {
  const validationErrors = {};

  if (!email) {
    validationErrors.email = 'O campo de e-mail e obrigatorio';
  } else if (!isValidLoginEmail(email)) {
    validationErrors.email = 'Formato de e-mail invalido';
  }

  if (!password) {
    validationErrors.password = 'O campo de senha e obrigatorio';
  } else if (password.length < 6) {
    validationErrors.password = 'A senha deve ter no minimo 6 caracteres';
  }

  return validationErrors;
}
