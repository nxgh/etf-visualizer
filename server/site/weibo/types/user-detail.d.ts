interface SunshineCredit {
  level: string;
}

interface RealName {
  name: string;
  career: string;
}

interface UsersItem {
  screen_name: string;
  avatar_large: string;
  id: number;
}

interface Followers {
  total_number: number;
  users: UsersItem[];
}

interface NormalMode {
  word_color: string;
  background_color: string;
}

interface DarkMode {
  word_color: string;
  background_color: string;
}

interface LabelDescItem {
  name: string;
  normal_mode: NormalMode;
  dark_mode: DarkMode;
  scheme_url: string;
}

interface Data {
  sunshine_credit: SunshineCredit;
  birthday: string;
  created_at: string;
  description: string;
  gender: string;
  ip_location: string;
  real_name: RealName;
  followers: Followers;
  label_desc: LabelDescItem[];
  desc_text: string;
  verified_url: string;
  friend_info: string;
}

export interface UserDetailJSONType {
  data: Data;
  ok: number;
}
