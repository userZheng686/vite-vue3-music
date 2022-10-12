import { SongDetailSongsItem } from 'i/api/api_song.d';
import { Album } from './api_album';
import { ArtistItem } from './api_artist';
import { playlist } from './api_playList';
import { Program, Radio } from './api_radio';
import { UserSearch } from './api_user';
import { videoRelatedRecommendItem } from './api_video';

export interface DjProgramSearch {
    resourceId : string;
    baseInfo : Program;
}


export interface Search {
    code : number;
    result : {
        songCount ?: number;
        songs ?: SongDetailSongsItem[];
        artistCount ?: number;
        artists ?: ArtistItem[];
        albumCount ?: number;
        albums ?: Album[];
        playlistCount ?: number;
        playlists ?: playlist[];
        djRadiosCount ?: number;
        djRadios ?: Radio[];
        userprofileCount ?: number;
        userprofiles : UserSearch[]
        videoCount : number;
        videos : videoRelatedRecommendItem[];
    };
    data ?: {
        totalCount : number;
        resources : DjProgramSearch[]
    }
}

export interface SuggestsItem {
    keyword : string;
}

export interface SearchBatch {
    "/api/search/suggest/web" : {
        result : {
            albums : Album[],
            artists : ArtistItem[];
            songs: SongDetailSongsItem[];
            playlists : playlist[];
            order : string[];
        };
        code : number;
    };
    "/api/search/suggest/keyword/get" : {
        code : number;
        data : {
            suggests : SuggestsItem[]
        }
    }
}

export interface resDTOListItem {
    resourceType : string;
    subType ?: string;
    resourceDTO : {
        resourceId : string;
        uiElement : {
            image : {
                imageUrl : string;
            };
            mainTitle : {
                title : string;
            };
            subTitle : {
                title : string;
            }
        }
    }
}

export interface BestMatch {
    code : number;
    data : {
        query : string;
        resDTOList : resDTOListItem[]
    }
}