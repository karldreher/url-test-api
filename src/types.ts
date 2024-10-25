/**
 * An interface for a URL (as a string) and a status, e.g. 200.
 */
export interface URLStatus {
  url: string;
  status: number;
}

/**
 * An interface for a URLStatusRequest, which is an ID.
 */
export interface URLStatusRequest {
  id: string;
}