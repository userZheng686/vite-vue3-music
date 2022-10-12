import { get } from '@/utils/request';
import { MatchSong } from 'i/api/api_match.d'

/**
 * 歌曲识别
 * @returns interface MatchSong
 */
export const getMatchSong = (sessionId: string, rawdata: string): MatchSong => get('/audio/match/new', { sessionId, rawdata })