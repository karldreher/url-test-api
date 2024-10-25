/**
 * An interface which allows for a URL (as a string) and a status, e.g. 200.
 */
export interface URLStatus {
  url: string;
  status: number;
}

export interface URLStatusRequest {
  id: string;
}