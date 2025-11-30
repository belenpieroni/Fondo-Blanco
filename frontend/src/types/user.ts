export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: string[];
  following: string[];
  bio?: string;
}
