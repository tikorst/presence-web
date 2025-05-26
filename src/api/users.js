export const fetchUsers = async (page = 1, limit = 10, search = '') => {
  try {
    const queryParams = new URLSearchParams({
      page: page,
      limit: limit,
      search: search,
    }).toString();

    const url = `https://backend.tikorst.cloud/web/admin/users?${queryParams}`;

    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.error || 'Failed to fetch users');
      error.response = response;
      throw error;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};