export function isValidEmail(email: string): boolean {
  const emailRegex = '[a-z0-9]+@[a-z]+.[a-z]{2,3}';
  const validateEmail = new RegExp(emailRegex);

  if (!validateEmail.test(email)) {
    return false;
  }

  return true;
}
