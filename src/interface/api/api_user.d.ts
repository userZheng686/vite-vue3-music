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
  //????????????
  "/api/authentication/identity/user/all": {
    code: number;
    data: Array<{
      iconUrl: string;
      showName: string;
    }>;
  };
  //?????????vip ????????????
  "/api/music-vip-membership/front/vip/info": {
    data: {
      redVipLevel: number;
      redVipLevelIcon: string;
      //????????????
      redVipDynamicIconUrl: string;
    };
    code: number;
  };
  [propname: string]: {
    //??????
    level: number;
    //?????????????????????
    listenSongs: number;
    //????????????
    profile: {
      //??????
      gender: number;
      //?????????
      nickname: string;
      //??????
      avatarUrl: string;
      //????????????
      backgroundUrl: string;
      //????????????
      followed: boolean;
      //??????id
      userId: number;
      //????????????
      signature: string;
      //????????????
      followeds: number;
      //????????????
      follows: number;
      //??????????????????
      blacklist: boolean;
      //????????????
      eventCount: number;
    };
    //?????????????????????
    peopleCanSeeMyPlayRecord: boolean;
    //?????????????????????
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
