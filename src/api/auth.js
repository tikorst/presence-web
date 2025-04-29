export const login = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      return response.ok || response.json();
    } catch (error) {
      console.log("masuk error", error)
      console.error('Login error:', error);
      return null;
    }
  };