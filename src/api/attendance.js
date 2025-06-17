export const fetchAttendance = async (classId, meetingId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/attendance/${classId}/${meetingId}`, {
        credentials: 'include',
      });
      return response.ok ? response.json() : [];
    } catch (error) {
      console.error('Error fetching presence:', error);
      return [];
    }
  };
export const addManualAttendance = async (classId, meetingId, npm, catatan) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/attendance/${classId}/${meetingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token' : localStorage.getItem('csrf') },
      body: JSON.stringify ({npm, catatan} ),
      credentials: 'include',
    });
    return response.json();
  } catch (error) {
    console.error('Error adding manual attendance:', error);
    return null;
  }
};