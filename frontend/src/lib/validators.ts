export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class FormValidator {
  static validatePhone(phone: string): ValidationResult {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (!cleaned) {
      return { isValid: false, error: 'Phone number zaroori hai.' };
    }
    if (cleaned.length < 10 || cleaned.length > 12) {
      return { isValid: false, error: 'Sahi 10-digit WhatsApp number dalein.' };
    }
    return { isValid: true };
  }

  static validateEmail(email: string): ValidationResult {
    if (!email) return { isValid: true }; // Optional field check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Valid email address enter karein.' };
    }
    return { isValid: true };
  }

  static validateRequired(value: string, fieldName: string): ValidationResult {
    if (!value || !value.trim()) {
      return { isValid: false, error: `${fieldName} mandatory hai.` };
    }
    return { isValid: true };
  }

  static validateAmount(amount: number, fieldName: string): ValidationResult {
    if (isNaN(amount) || amount < 0) {
      return { isValid: false, error: `${fieldName} 0 ya usse zyada hona chahiye.` };
    }
    return { isValid: true };
  }
}