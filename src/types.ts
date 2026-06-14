export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface WaitlistTicket {
  email: string;
  number: number;
  timestamp: string;
}

export interface CharacterItem {
  hanzi: string;
  pinyin: string;
  meaning: string;
  tone: number;
}
