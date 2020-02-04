import api from './api';

export interface UserDTO {
  handle: string;
  email: string;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
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
