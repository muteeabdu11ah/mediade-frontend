/**
 * Validates a password against robust security requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number or special character
 */
export const isValidPassword = (password: string): { isValid: boolean; error?: string } => {
    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long.' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) {
        return { isValid: false, error: 'Password must contain at least one uppercase letter.' };
    }

    if (!hasLowerCase) {
        return { isValid: false, error: 'Password must contain at least one lowercase letter.' };
    }

    if (!hasNumber && !hasSpecialChar) {
        return { isValid: false, error: 'Password must contain at least one number or special character.' };
    }

    return { isValid: true };
};

export const PASSWORD_REQUIREMENTS_TEXT = "Min. 8 chars, incl. uppercase, lowercase, and a number or special character.";
