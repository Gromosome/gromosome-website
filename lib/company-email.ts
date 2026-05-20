const publicEmailDomains = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'yandex.com',
  'mail.com',
  'gmx.com'
];

const emailRegex = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;

export function isCompanyEmail(email: string): boolean {
  if (!emailRegex.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !publicEmailDomains.includes(domain);
}

export function companyEmailHelpText(): string {
  return 'Use a company email address. Public email providers like Gmail, Yahoo, Outlook, and iCloud are not accepted.';
}
