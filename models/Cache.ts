export interface Cache {
  code: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  type?: string;
  difficulty?: number;
  terrain?: number;
  found?: boolean;
  foundAt?: string;
  userLog?: string;
}

export interface LogEntry {
  date: string; // ISO datum
  type: string; // Loggtyp, t.ex. "Found it"
  finderId?: string; // Användar-ID för loggaren
  finderName?: string;
  text?: string; // Loggtext
}

export interface GPXCache extends Cache {
  description?: string;
  url?: string;
  symbol?: string;
  country?: string;
  state?: string;
  logs?: LogEntry[];
}