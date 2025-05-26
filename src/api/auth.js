export const login = async (formData) => {
    try {
      const response = await fetch(`https://backend.tikorst.cloud/web/login`, {
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