export const resetDeviceId = async (username) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token' : localStorage.getItem('csrf')},
        body: JSON.stringify({ username: username }),
        credentials: 'include',
      });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error fetching presence:', error);
      return [];
    }
  };