export const fetchAttendance = async (classId, meetingId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/attendance/${classId}/${meetingId}`, {
        credentials: 'include',
      });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error fetching presence:', error);
      return [];
    }
  };