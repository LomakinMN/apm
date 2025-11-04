export interface BookingRequest {
  event_id: number;
  user_id: string;
}

export interface BookingResponse {
  success: boolean;
  booking?: {
    id: number;
    event_id: number;
    user_id: string;
    created_at: Date;
  };
  error?: string;
  message?: string;
}