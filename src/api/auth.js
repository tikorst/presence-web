export const login = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await response.json();
      const csrfToken = data.csrf_token;
      if (!csrfToken) {
        throw new Error('CSRF token missing from response');
      }

      // Simpan ke localStorage
      localStorage.setItem('csrf', csrfToken);
      return data;
    } catch (error) {
      return null;
    }
  };

export const logout = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': localStorage.getItem('csrf') },
      credentials: 'include',
    });
    if (response.ok) {
      localStorage.removeItem('csrf');
      return true;
    }
    return false;
  }  catch (error) {
    
    return false;
  }
};