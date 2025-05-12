export const resetDeviceId = async (username) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username }),
        credentials: 'include',
      });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error fetching presence:', error);
      return [];
    }
  };