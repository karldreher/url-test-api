export interface URLTestRequest {
  urls: string[];
}

/**
 * An interface for a URL (as a string) and a status, e.g. 200.
 * @property {string} url - The URL as a string.
 * @property {number} status - The returned status code as a number.
 */
export interface URLStatus {
  /**
   * The URL as a string.
   */
  url: string;
  /**
   * The returned status code as a number.
   */
  status: number;
}

/**
 * An interface for a URLStatusRequest, which is an ID.
 * @property {string} id - The ID for the URLStatus request.
 */
export interface URLStatusRequest {
  /*
   * The ID for the URLStatus request.
   */
  id: string;
}
