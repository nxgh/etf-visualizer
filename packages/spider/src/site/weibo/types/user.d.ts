interface StatusTotalCounter {
  total_cnt_format: string;
  comment_cnt: string;
  repost_cnt: string;
  like_cnt: string;
  total_cnt: string;
}

interface Data {
  mbrank: number;
  mbtype: number;
  svip: number;
  vvip: number;
}

interface IconListItem {
  type: string;
  data: Data;
}

interface User {
  id: number;
  idstr: string;
  pc_new: number;
  screen_name: string;
  profile_image_url: string;
  profile_url: string;
  verified: boolean;
  verified_type: number;
  domain: string;
  weihao: string;
  verified_type_ext: number;
  status_total_counter: StatusTotalCounter;
  avatar_large: string;
  avatar_hd: string;
  follow_me: boolean;
  following: boolean;
  mbrank: number;
  mbtype: number;
  v_plus: number;
  user_ability: number;
  planet_video: boolean;
  verified_reason: string;
  description: string;
  location: string;
  gender: string;
  followers_count: number;
  followers_count_str: string;
  friends_count: number;
  statuses_count: number;
  url: string;
  svip: number;
  vvip: number;
  cover_image_phone: string;
  icon_list: IconListItem[];
  top_user: number;
  user_type: number;
  is_star: string;
  is_muteuser: boolean;
  special_follow: boolean;
}

interface TabListItem {
  name: string;
  tabName: string;
}

interface Data {
  user: User;
  tabList: TabListItem[];
  blockText: string;
}

export interface UserJSONType {
  ok: number;
  data: Data;
}
