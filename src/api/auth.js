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