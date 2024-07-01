import { WritableDraft } from 'immer';

export interface Discussion {
  id: number;
  question: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DiscussionResponse {
  code: number;
  success: boolean;
  message: string;
  data: Discussion[];
}

export interface DiscussionsState {
  discussions: Discussion[];
  discussionsloading: boolean;
  discussionserror: string | null;
}
export type WritableDiscussionResponse = WritableDraft<DiscussionResponse>;