export const fetchClasses = async () => {
    try {
      const response = await fetch(` http://localhost:8443/web/classes`, {
        credentials: 'include',
      });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  };