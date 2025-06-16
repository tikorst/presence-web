export const login = async (formData) => {
    try {
      const response = await fetch(` http://localhost:8443/web/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      return response.json();
    } catch (error) {
      return null;
    }
  };