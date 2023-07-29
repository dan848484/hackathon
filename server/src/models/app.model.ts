export interface ChatMessage {
  user: string;
  message: string;
}

export interface Schedule {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
}

export interface ScheduleDto {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export interface ExtractRequest {
  text: string;
}
