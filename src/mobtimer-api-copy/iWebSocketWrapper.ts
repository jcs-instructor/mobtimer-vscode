export interface IWebSocketWrapper {
  readyState: number;
  send: (message: string) => void;
  close: () => void;
  OPEN: number;
  CLOSED: number;
  onmessage2: (message: any) => void;
}
