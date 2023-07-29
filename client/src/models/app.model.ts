export interface MessageBase {
  type: 'chat' | 'openai' | 'suggested_schedule';
}

export interface ChatMessage extends MessageBase {
  type: 'chat';
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

export interface OpenaiMessage extends MessageBase {
  type: 'openai';
  operation: 'create_meeting' | 'cancel';
  targetUser: string; //このサジェスチョンを表示したいユーザー名を格納するんだけれど、先頭に!があったらその人じゃない人って意味にする。
  year: number;
  month: number;
  day: number;
  hour: number;
  minutes: number;
}

export interface SuggestedScheduleMessage
  extends Omit<OpenaiMessage, 'type' | 'operation'> {
  type: 'suggested_schedule';
  operation: 'create_meeting';
}
