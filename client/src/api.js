export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}, notifyUnauthorized = true) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      credentials: "same-origin",
      headers: options.body
        ? { "Content-Type": "application/json", ...options.headers }
        : options.headers,
    });
  } catch {
    throw new Error("Нет связи с сервером. Проверьте, что API запущен.");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    if (response.status === 401 && notifyUnauthorized) {
      window.dispatchEvent(new Event("workbase:unauthorized"));
    }
    throw new ApiError(
      data?.details?.[0]?.message ?? data?.message ?? `Ошибка сервера: ${response.status}`,
      response.status
    );
  }

  return response.status === 204 ? undefined : response.json();
}

export const currentUser = () => request("/api/auth/me", {}, false);
export const login = (username, password) =>
  request(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ username, password }) },
    false
  );
export const logout = () => request("/api/auth/logout", { method: "POST" }, false);

export const listProjects = (limit, offset) =>
  request(`/api/projects?limit=${limit}&offset=${offset}`);

const tasksPath = (projectId) => `/api/project/${projectId}/tasks`;
export const listTasks = (projectId) => request(tasksPath(projectId));
export const createTask = (projectId, input) =>
  request(tasksPath(projectId), { method: "POST", body: JSON.stringify(input) });
export const updateTask = (projectId, taskId, input) =>
  request(`${tasksPath(projectId)}/${taskId}`, { method: "PUT", body: JSON.stringify(input) });
export const deleteTask = (projectId, taskId) =>
  request(`${tasksPath(projectId)}/${taskId}`, { method: "DELETE" });
