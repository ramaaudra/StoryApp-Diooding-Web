import CONFIG from "../config";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  GUEST_STORIES: `${CONFIG.BASE_URL}/stories/guest`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function registerUser({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  return await response.json();
}

export async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return await response.json();
}

export async function getStories({ page, size, location, token }) {
  const queryParams = new URLSearchParams();

  if (page) queryParams.append("page", page);
  if (size) queryParams.append("size", size);
  if (location !== undefined) queryParams.append("location", location ? 1 : 0);

  const url = `${ENDPOINTS.STORIES}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function getStoryDetail({ id, token }) {
  const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function addStory({ description, photo, lat, lon, token }) {
  const formData = new FormData();

  formData.append("description", description);
  formData.append("photo", photo);

  if (lat !== undefined) formData.append("lat", lat);
  if (lon !== undefined) formData.append("lon", lon);

  const response = await fetch(ENDPOINTS.STORIES, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return await response.json();
}

export async function addGuestStory({ description, photo, lat, lon }) {
  const formData = new FormData();

  formData.append("description", description);
  formData.append("photo", photo);

  if (lat !== undefined) formData.append("lat", lat);
  if (lon !== undefined) formData.append("lon", lon);

  const response = await fetch(ENDPOINTS.GUEST_STORIES, {
    method: "POST",
    body: formData,
  });

  return await response.json();
}

export async function subscribeNotification({ endpoint, keys, token }) {
  const response = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      endpoint,
      keys,
    }),
  });

  return await response.json();
}

export async function unsubscribeNotification({ endpoint, token }) {
  const response = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      endpoint,
    }),
  });

  return await response.json();
}
