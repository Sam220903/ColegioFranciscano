// users.client.js
import ApiClient from "../core/apiClient.js";

class NoticesClient extends ApiClient {
  constructor(base) {
    super(base.baseURL, { cacheTTL: base.cacheTTL, headers: base.defaultHeaders });
    this._cache = base._cache; // comparte el caché con el resto
  }

  getAll(params = {})     { return this.get("/notices", { params, cache: true }); }
  getById(id)           { return this.get(`/notices/${id}`, { cache: true }); }
  getMain(params = {})  { return this.get("/notices/main", {params, cache: true}); }
  create(data)          { this.invalidateCache("/users"); return this.post("/users", data); }
  update(id, changes)   { this.invalidateCache(`/users/${id}`); return this.patch(`/users/${id}`, changes); }
  remove(id)            { this.invalidateCache("/users"); return this.delete(`/users/${id}`); }
}

export default NoticesClient;