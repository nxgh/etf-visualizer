interface Visible {
  type: number;
  list_id: number;
}

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
  icon_list: IconListItem[];
}

interface AnnotationsItem {
  shooting: number;
  client_mblogid: string;
  source_text: string;
  phone_id: string;
  mapi_request: boolean;
}

interface NumberDisplayStrategy {
  apply_scenario_flag: number;
  display_text_min_number: number;
  display_text: string;
}

interface ContinueTag {
  title: string;
  pic: string;
  scheme: string;
  cleaned: boolean;
}

interface CommentManageInfo {
  comment_permission_type: number;
  approval_comment_type: number;
  comment_sort_type: number;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Bmiddle {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Large {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Original {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Largest {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Mw2000 {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Largecover {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Actionlog {
  act_code: number;
  oid: string;
  uicode: string;
  luicode: string;
  fid: string;
  ext: string;
}

interface TagStructItem {
  tag_name: string;
  oid: string;
  tag_type: number;
  tag_hidden: number;
  tag_scheme: string;
  url_type_pic: string;
  actionlog: Actionlog;
  bd_object_type: string;
  desc: string;
}

interface Actionlog {
  act_type: number;
  act_code: number;
  oid: string;
  uuid: number;
  cardid: string;
  lcardid: string;
  uicode: string;
  luicode: string;
  fid: string;
  lfid: string;
  ext: string;
}

interface UrlStructItem {
  url_title: string;
  url_type_pic: string;
  ori_url: string;
  page_id: string;
  short_url: string;
  long_url: string;
  url_type: number;
  result: boolean;
  actionlog: Actionlog;
  storage_type: string;
  hide: number;
  object_type: string;
  h5_target_url: string;
  need_save_obj: number;
}

interface Visible {
  type: number;
  list_id: number;
}

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
  icon_list: IconListItem[];
}

interface AnnotationsItem {
  photo_sub_type: string;
  source_text: string;
  phone_id: string;
  mapi_request: boolean;
}

interface FocusPoint {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface PicFocusPointItem {
  focus_point: FocusPoint;
  pic_id: string;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Bmiddle {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Large {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Original {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Largest {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Mw2000 {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Largecover {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface FocusPoint {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Bmiddle {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Large {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Original {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Largest {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Mw2000 {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface Largecover {
  url: string;
  width: number;
  height: number;
  cut_type: number;
  type: string;
}

interface FocusPoint {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface PicInfos {
  [key: string]: {
    thumbnail: Thumbnail;
    bmiddle: Bmiddle;
    large: Large;
    original: Original;
    largest: Largest;
    mw2000: Mw2000;
    largecover: Largecover;
    focus_point: FocusPoint;
    object_id: string;
    pic_id: string;
    photo_tag: number;
    type: string;
    pic_status: number;
  };
}

interface NumberDisplayStrategy {
  apply_scenario_flag: number;
  display_text_min_number: number;
  display_text: string;
}

interface ContinueTag {
  title: string;
  pic: string;
  scheme: string;
  cleaned: boolean;
}

interface CommentManageInfo {
  comment_permission_type: number;
  approval_comment_type: number;
  comment_sort_type: number;
  ai_play_picture_type: number;
}

interface RetweetedStatus {
  visible: Visible;
  created_at: string;
  id: number;
  idstr: string;
  mid: string;
  mblogid: string;
  user: User;
  can_edit: boolean;
  edit_count: number;
  textLength: number;
  annotations: AnnotationsItem[];
  source: string;
  favorited: boolean;
  rid: string;
  pic_ids: string[];
  pic_focus_point: PicFocusPointItem[];
  geo: string;
  pic_num: number;
  pic_infos: {};
  is_paid: boolean;
  mblog_vip_type: number;
  number_display_strategy: NumberDisplayStrategy;
  reposts_count: number;
  comments_count: number;
  attitudes_count: number;
  attitudes_status: number;
  continue_tag: ContinueTag;
  isLongText: boolean;
  mlevel: number;
  content_auth: number;
  is_show_bulletin: number;
  comment_manage_info: CommentManageInfo;
  mblogtype: number;
  showFeedRepost: boolean;
  showFeedComment: boolean;
  pictureViewerSign: boolean;
  showPictureViewer: boolean;
  rcList: any[];
  mixed_count: number;
  is_show_mixed: boolean;
  isSinglePayAudio: boolean;
  text: string;
  text_raw: string;
  region_name: string;
}

interface Actionlog {
  act_code: string;
  uid: string;
  mid: number;
  oid: string;
  uicode: string;
  cardid: string;
  fid: string;
  luicode: string;
  lfid: string;
  ext: string;
  source: string;
  shop_window_scene: string;
}

interface Params {
  scheme: string;
  cleaned: boolean;
}

interface Actionlog {
  act_code: number;
  uid: string;
  mid: number;
  oid: string;
  uicode: string;
  cardid: string;
  fid: string;
  luicode: string;
  lfid: string;
  ext: string;
  source: string;
  shop_window_scene: string;
}

interface ButtonsItem {
  name: string;
  pic: string;
  type: string;
  params: Params;
  actionlog: Actionlog;
}

interface CommonStructItem {
  name: string;
  url: string;
  desc: string;
  img: string;
  type: number;
  page_id: string;
  actionlog: Actionlog;
  buttons: ButtonsItem[];
}

interface ListItem {
  visible: Visible;
  created_at: string;
  id: number;
  idstr: string;
  mid: string;
  mblogid: string;
  user: User;
  can_edit: boolean;
  edit_count: number;
  textLength: number;
  annotations: AnnotationsItem[];
  source: string;
  favorited: boolean;
  rid: string;
  pic_ids: any[];
  pic_num: number;
  is_paid: boolean;
  mblog_vip_type: number;
  number_display_strategy: NumberDisplayStrategy;
  reposts_count: number;
  comments_count: number;
  attitudes_count: number;
  attitudes_status: number;
  continue_tag: ContinueTag;
  isLongText: boolean;
  mlevel: number;
  content_auth: number;
  is_show_bulletin: number;
  comment_manage_info: CommentManageInfo;
  share_repost_type: number;
  isTop: number;
  mblogtype: number;
  showFeedRepost: boolean;
  showFeedComment: boolean;
  pictureViewerSign: boolean;
  showPictureViewer: boolean;
  rcList: any[];
  analysis_extra: string;
  readtimetype: string;
  mixed_count: number;
  is_show_mixed: boolean;
  isSinglePayAudio: boolean;
  text: string;
  text_raw: string;
  region_name: string;
  pic_infos: PicInfos;
  tag_struct: TagStructItem[];
  url_struct: UrlStructItem[];
  repost_type: number;
  retweeted_status: RetweetedStatus;
  common_struct: CommonStructItem[];
}

interface Data {
  since_id: string;
  list: ListItem[];
  status_visible: number;
  bottom_tips_visible: boolean;
  bottom_tips_text: string;
  topicList: any[];
  total: number;
}

export interface BlogJSONType {
  data: Data;
  ok: number;
}
