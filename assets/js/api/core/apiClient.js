// =============================================================================
// api-client.js
// Arquitectura: ApiClient base → clases hijas por endpoint → instancias globales
// =============================================================================

// -----------------------------------------------------------------------------
// 1. CLASE BASE: ApiClient
//    - Métodos HTTP: get, post, patch, delete
//    - Caché en memoria con TTL configurable (evita re-fetches al recargar tabs)
//    - Interceptores de request/response
//    - Manejo centralizado de errores
// -----------------------------------------------------------------------------

class ApiClient {
  /**
   * @param {string} baseURL  - URL base de la API (ej. "https://api.miapp.com/v1")
   * @param {object} options  - Opciones globales
   * @param {number} options.cacheTTL   - Tiempo de vida del caché en ms (default: 5 min)
   * @param {object} options.headers    - Headers por defecto para todos los requests
   */
  constructor(baseURL, options = {}) {
    this.baseURL  = baseURL.replace(/\/$/, ""); // elimina slash final
    this.cacheTTL = options.cacheTTL ?? 5 * 60 * 1000; // 5 minutos por defecto
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Almacén de caché: { [cacheKey]: { data, expiresAt } }
    this._cache = new Map();
  }

  // ---------------------------------------------------------------------------
  // INTERCEPTORES — sobrescribe en subclases o instancias para lógica custom
  // ---------------------------------------------------------------------------

  /** Se ejecuta antes de cada request. Retorna el objeto `options` modificado. */
  async onRequest(url, options) {
    return options;
  }

  /** Se ejecuta con la respuesta exitosa. Retorna los datos procesados. */
  async onResponse(data, response) {
    return data;
  }

  /** Se ejecuta cuando ocurre un error. Lanza o retorna un valor de fallback. */
  async onError(error, url, options) {
    throw error;
  }

  // ---------------------------------------------------------------------------
  // GESTIÓN DE CACHÉ
  // ---------------------------------------------------------------------------

  _cacheKey(url, params = {}) {
    const query = new URLSearchParams(params).toString();
    return query ? `${url}?${query}` : url;
  }

  _getCached(key) {
    const entry = this._cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._cache.delete(key);
      return null;
    }
    return entry.data;
  }

  _setCache(key, data) {
    this._cache.set(key, { data, expiresAt: Date.now() + this.cacheTTL });
  }

  /** Invalida entradas de caché cuya clave contenga el patrón dado. */
  invalidateCache(pattern = "") {
    for (const key of this._cache.keys()) {
      if (key.includes(pattern)) this._cache.delete(key);
    }
  }

  /** Limpia todo el caché. */
  clearCache() {
    this._cache.clear();
  }

  // ---------------------------------------------------------------------------
  // MÉTODO CORE: _request
  // ---------------------------------------------------------------------------

  async _request(method, endpoint, { body, params, headers, cache = false, cacheTTL } = {}) {
    // Construir URL con query params opcionales
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.append(k, v);
      });
    }
    const fullURL = url.toString();

    // Revisar caché (solo para GET con cache:true)
    if (cache && method === "GET") {
      const cached = this._getCached(fullURL);
      if (cached) {
        console.debug(`[ApiClient] Cache HIT → ${fullURL}`);
        return cached;
      }
    }

    // Armar opciones del fetch
    let fetchOptions = {
      method,
      headers: { ...this.defaultHeaders, ...headers },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    };

    // Interceptor de request
    fetchOptions = await this.onRequest(fullURL, fetchOptions);

    // Ejecutar fetch
    let response;
    try {
      response = await fetch(fullURL, fetchOptions);
    } catch (networkError) {
      const err = new Error(`[Network Error] ${networkError.message}`);
      err.original = networkError;
      return this.onError(err, fullURL, fetchOptions);
    }

    // Parsear respuesta
    let data;
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Manejar errores HTTP
    if (!response.ok) {
      const err = new Error(`[HTTP ${response.status}] ${response.statusText}`);
      err.status   = response.status;
      err.response = response;
      err.data     = data;
      return this.onError(err, fullURL, fetchOptions);
    }

    // Interceptor de respuesta
    data = await this.onResponse(data, response);

    // Guardar en caché si aplica
    if (cache && method === "GET") {
      const ttl = cacheTTL ?? this.cacheTTL;
      this._cache.set(fullURL, { data, expiresAt: Date.now() + ttl });
      console.debug(`[ApiClient] Cache SET → ${fullURL}`);
    }

    return data;
  }

  // ---------------------------------------------------------------------------
  // MÉTODOS HTTP PÚBLICOS
  // ---------------------------------------------------------------------------

  /**
   * GET — obtiene recursos. Soporta caché.
   * @param {string} endpoint
   * @param {{ params, headers, cache, cacheTTL }} options
   */
  get(endpoint, options = {}) {
    return this._request("GET", endpoint, options);
  }

  /**
   * POST — crea recursos.
   * @param {string} endpoint
   * @param {object} body
   * @param {{ params, headers }} options
   */
  post(endpoint, body, options = {}) {
    return this._request("POST", endpoint, { ...options, body });
  }

  /**
   * PATCH — actualiza parcialmente un recurso.
   * @param {string} endpoint
   * @param {object} body
   * @param {{ params, headers }} options
   */
  patch(endpoint, body, options = {}) {
    return this._request("PATCH", endpoint, { ...options, body });
  }

  /**
   * DELETE — elimina un recurso.
   * @param {string} endpoint
   * @param {{ params, headers }} options
   */
  delete(endpoint, options = {}) {
    return this._request("DELETE", endpoint, options);
  }

  // Alias semántico para mayor legibilidad
  put(endpoint, body, options = {}) {
    return this._request("PUT", endpoint, { ...options, body });
  }
}

export default ApiClient;

