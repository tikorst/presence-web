export const fetchMeetings = async (classId) => {
    try {
      const response = await fetch(` https://backend.tikorst.cloud/web/classes/${classId}/meetings`, {
        credentials: 'include',
      });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return [];
    }
  };