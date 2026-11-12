/**
 * API Service for FriendConnect Backend
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = 'Network request failed';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // Graph snapshot
  getGraph: () => fetch(`${API_BASE_URL}/graph`).then(handleResponse),

  // Users
  getUsers: () => fetch(`${API_BASE_URL}/users`).then(handleResponse),
  getUserById: (userId) => fetch(`${API_BASE_URL}/users/${encodeURIComponent(userId)}`).then(handleResponse),
  createUser: (id, name) =>
    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name }),
    }).then(handleResponse),
  deleteUser: (userId) =>
    fetch(`${API_BASE_URL}/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Friendships
  getFriendships: () => fetch(`${API_BASE_URL}/friendships`).then(handleResponse),
  createFriendship: (user1, user2) =>
    fetch(`${API_BASE_URL}/friendships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user1, user2 }),
    }).then(handleResponse),
  deleteFriendship: (user1, user2) =>
    fetch(
      `${API_BASE_URL}/friendships?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`,
      { method: 'DELETE' }
    ).then(handleResponse),

  // Algorithms
  getMutualFriends: (userA, userB) =>
    fetch(
      `${API_BASE_URL}/algorithms/mutual-friends?user_a=${encodeURIComponent(userA)}&user_b=${encodeURIComponent(userB)}`
    ).then(handleResponse),
  getSuggestions: (userId) =>
    fetch(`${API_BASE_URL}/algorithms/suggestions?user_id=${encodeURIComponent(userId)}`).then(handleResponse),
  getShortestPath: (source, destination) =>
    fetch(
      `${API_BASE_URL}/algorithms/shortest-path?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`
    ).then(handleResponse),
  getCommunities: () => fetch(`${API_BASE_URL}/algorithms/communities`).then(handleResponse),
  getComplexity: () => fetch(`${API_BASE_URL}/algorithms/complexity`).then(handleResponse),

  // Graph state reset
  resetGraph: () =>
    fetch(`${API_BASE_URL}/graph/reset`, {
      method: 'POST',
    }).then(handleResponse),
};
