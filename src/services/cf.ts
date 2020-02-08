import api from './api';

export interface UserDTO {
  handle: string;
  email: string;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
}

export enum Verdict {
  OK = 'OK',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  WRONG_ANSWER = 'WRONG_ANSWER',
  PRESENTATION_ERROR = 'PRESENTATION_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  IDLENESS_LIMIT_EXCEEDED = 'IDLENESS_LIMIT_EXCEEDED',
  SECURITY_VIOLATED = 'SECURITY_VIOLATED',
  CRASHED = 'CRASHED',
  INPUT_PREPARATION_CRASHED = 'INPUT_PREPARATION_CRASHED',
  CHALLENGED = 'CHALLENGED',
  SKIPPED = 'SKIPPED',
  TESTING = 'TESTING',
  REJECTED = 'REJECTED'
}

export enum ParticipantType {
  CONTESTANT = 'CONTESTANT',
  PRACTICE = 'PRACTICE',
  VIRTUAL = 'VIRTUAL',
  MANAGER = 'MANAGER',
  OUT_OF_COMPETITION = 'OUT_OF_COMPETITION'
}

export interface SubmissionDTO {
  id: number;
  contestId: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    tags: string[];
  };
  author: {
    participantType: ParticipantType;
  };
  programmingLanguage: string;
  verdict: Verdict;
}

export async function getUserInfo(cfid: string): Promise<UserDTO> {
  const {
    data: {
      result: [data]
    }
  } = await api.get('user.info', {
    params: {
      handles: cfid
    }
  });
  return data as UserDTO;
}

export async function getUserStatus(cfid: string): Promise<SubmissionDTO[]> {
  const {
    data: { result }
  } = await api.get('user.status', {
    params: {
      handle: cfid
    }
  });
  return result as SubmissionDTO[];
}

export async function getUser(cfid: string): Promise<User> {
  const [info, status] = await Promise.all([
    getUserInfo(cfid),
    getUserStatus(cfid)
  ]);
  const user = new User(info);
  status.forEach(sub => user.submission.push(sub));
  return user;
}

export class User {
  handle: string;
  email: string;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  name: string | undefined;
  submission: SubmissionDTO[] = [];

  constructor(data: UserDTO) {
    this.handle = data.handle;
    this.email = data.email;
    this.rank = data.rank;
    this.rating = data.rating;
    this.maxRank = data.maxRank;
    this.maxRating = data.maxRating;
  }

  merge(user: User) {
    if (this.name !== user.name) return false;
    if (user.rating > this.rating) {
      this.rating = user.rating;
      this.rank = user.rank;
      this.handle = user.handle;
    }
    if (user.maxRating > this.maxRating) {
      this.maxRating = user.maxRating;
      this.maxRank = user.maxRank;
    }
    for (const sub of user.submission) {
      this.submission.push(sub);
    }
    this.submission.sort((a: SubmissionDTO, b: SubmissionDTO) => {
      if (a.id === b.id) {
        return 0;
      } else if (a.id < b.id) {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
