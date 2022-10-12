interface keyData {
  code: number;
  unikey: string;
}

interface qrCodeData {
  qrurl: string;
  qrimg: string;
}

export interface key {
  code: number;
  data: keyData;
}

export interface qrCode {
  code: number;
  data: qrCodeData;
}

export interface loginResult {
  code: number;
  cookie: any;
  message: string;
  profile: any;
}

export interface loginPhone {
  phone: number;
  md5_password?: string;
  captcha?: number;
}

export interface signinErr {
  code: number;
  msg: string;
}

export interface UserFollowsItem {
  nickname: string;
  userId: number;
  avatarUrl: string;
  avatarDetail: {
    identityIconUrl: string;
  };
  followeds: number;
  playlistCount: number;
  signature: string;
  eventCount: number;
  gender: number;
  followed: boolean;
}

export interface UserFollows {
  code: number;
  follow: UserFollowsItem[];
  more: boolean;
  touchCount: number;
}

export interface UserFolloweds {
  code: number;
  more: boolean;
  followeds: UserFollowsItem[];
  size: number;
}

export interface Status {
  data: {
    code: number;
    profile: any;
    account: any;
  };
}

export interface UserDetail {
  adValid: boolean;
  code: number;
  createDays: number;
  createTime: number;
  level: number;
  listenSongs: number;
  mobileSign: boolean;
  newUser: boolean;
  pcSign: boolean;
  identify ?: {
   imageUrl : string;
  };
  peopleCanSeeMyPlayRecord: boolean;
  profile: {
    avatarUrl: string;
    birthday: number;
    blacklist: boolean;
    city: number;
    createTime: number;
    defaultAvatar: boolean;
    description: string;
    detailDescription: string;
    djStatus: number;
    eventCount: number;
    followMe: boolean;
    followTime: string;
    followed: boolean;
    followeds: number;
    follows: number;
    gender: number;
    inBlacklist: boolean;
    mutual: boolean;
    newFollows: number;
    nickname: string;
    playlistBeSubscribedCount: number;
    playlistCount: number;
    province: number;
    signature: string;
    userId: number;
    userType: number;
    vipType: number;
  };
}

export interface UserSub {
  artistCount: number;
  code: number;
  createDjRadioCount: number;
  createdPlaylistCount: number;
  djRadioCount: number;
  mvCount: number;
  newProgramCount: number;
  programCount: number;
  subPlaylistCount: number;
}

export interface sendCode {
  data: boolean;
  code: number;
}

export interface checkSendCode {
  data: boolean;
  code: number;
}

export interface UsersBatch {
  //图标识别
  "/api/authentication/identity/user/all": {
    code: number;
    data: Array<{
      iconUrl: string;
      showName: string;
    }>;
  };
  //是否是vip 包含图片
  "/api/music-vip-membership/front/vip/info": {
    data: {
      redVipLevel: number;
      redVipLevelIcon: string;
      //动态图片
      redVipDynamicIconUrl: string;
    };
    code: number;
  };
  [propname: string]: {
    //等级
    level: number;
    //听过的歌曲数量
    listenSongs: number;
    //个人资料
    profile: {
      //性别
      gender: number;
      //用户名
      nickname: string;
      //头像
      avatarUrl: string;
      //背景图片
      backgroundUrl: string;
      //是否关注
      followed: boolean;
      //用户id
      userId: number;
      //个人介绍
      signature: string;
      //粉丝数量
      followeds: number;
      //关注数量
      follows: number;
      //是否是黑名单
      blacklist: boolean;
      //动态数量
      eventCount: number;
    };
    //是否可以看电台
    peopleCanSeeMyPlayRecord: boolean;
    //绑定的社交平台
    bindings: Array<{
      url: string;
    }>;
  };
}

export interface UserDj {
  code: number;
  createRadioCount: number;
  subRadioCount: number;
}

export interface UserFriendNoticeSong {
  code: number;
  data: {
    leftIcons: Array<{
      url: string;
    }>;
    text: string;
    time: number;
  };
}

export interface UserFollowRecommendItem {
  avatarUrl: string;
  nickname: string;
  snsNickname: string;
  followed: boolean;
  userId: number;
}

export interface UserFollowRecommend {
  others: Array<any>;
  snsFriends: UserFollowRecommendItem[];
  officials: UserFollowRecommendItem[];
  code: number;
}

export interface UserFollowRecommendCount {
  snsCount: number;
  starCount: number;
  totalCelebrityCount: number;
  totalPlaylistTalentCount: number;
  musicianCount: number;
  newTotalCelebrityCount: number;
  code: number;
}

export interface UserSearch {
  avatarDetail: {
    identityIconUrl: string;
  };
  avatarUrl: string;
  city: number;
  description: string;
  userId: number;
  gender: number;
  followeds: number;
  followed: boolean;
  nickname: string;
  signature: string;
}

export interface UserRecommendCelebrities {
  djCount: number;
  code: number;
}
