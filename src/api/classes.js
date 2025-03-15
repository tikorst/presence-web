export const fetchClasses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/classes`, {
        credentials: 'include',
      });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  };