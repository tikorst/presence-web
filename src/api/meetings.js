export const fetchMeetings = async (classId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/classes/${classId}/meetings`, {
        credentials: 'include',
      });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return [];
    }
  };