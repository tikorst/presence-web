export const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        credentials: 'include',
      });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error fetching presence:', error);
      return [];
    }
  };