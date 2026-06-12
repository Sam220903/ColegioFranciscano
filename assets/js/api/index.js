// api/index.js
import ApiClient   from "./core/apiClient.js";
import NoticesClient from "./clients/notices.client.js";

const API = (() => {
  const base = new ApiClient("http://localhost/cf_api/backend/public", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
  });

  return {
    notices: new NoticesClient(base),
    raw:      base,
  };
})();

export default API;