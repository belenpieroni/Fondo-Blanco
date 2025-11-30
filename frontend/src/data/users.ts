import { User } from '../types/user';

export const users: Record<string, User> = {
  user1: {
    id: 'user1',
    name: 'Bartender Pro',
    username: '@bartenderpro',
    avatar: 'B',
    followers: ['user2', 'user3'],
    following: ['user2', 'user5'],
    bio: 'Mixólogo profesional | Creador de experiencias'
  },
  user2: {
    id: 'user2',
    name: 'Carlos M.',
    username: '@carlosm',
    avatar: 'C',
    followers: ['user1', 'user3', 'user5'],
    following: ['user1', 'user4'],
  },
  user3: {
    id: 'user3',
    name: 'Ana L.',
    username: '@anal',
    avatar: 'A',
    followers: ['user1', 'user2'],
    following: ['user2', 'user5'],
  },
  user4: {
    id: 'user4',
    name: 'Marco R.',
    username: '@marcor',
    avatar: 'M',
    followers: ['user2', 'user5'],
    following: ['user1', 'user3'],
  },
  user5: {
    id: 'user5',
    name: 'Laura P.',
    username: '@laurap',
    avatar: 'L',
    followers: ['user1', 'user3', 'user4'],
    following: ['user2'],
  },
};

export const CURRENT_USER_ID = 'user1';
export const currentUser = users[CURRENT_USER_ID];
