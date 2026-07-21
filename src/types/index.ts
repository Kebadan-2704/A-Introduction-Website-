// ==========================================
// types/index.ts — Complete Type Definitions
// ==========================================

// --- Core Entities ---

export interface Poll {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  opensAt: string;
  closesAt?: string;
  createdAt: string;
}

export interface Song {
  id: string;
  pollId: string;
  number: number;
  title: string;
  artist: string;
  language: 'Tamil' | 'Hindi' | 'English' | 'Mixed';
  coverImageUrl?: string;
  displayOrder: number;
  segments: Segment[];
}

export interface Segment {
  id: string;
  songId: string;
  label: 'A' | 'B' | 'C' | 'D';
  displayLabel: string;
  audioUrl: string;
  durationMs?: number;
  fileSizeBytes?: number;
}

export interface Vote {
  id: string;
  songId: string;
  segmentId: string;
  sessionId: string;
  listenDurationMs?: number;
  createdAt: string;
}

export interface VoterComment {
  id: string;
  songId: string;
  sessionId: string;
  content: string;
  createdAt: string;
}

export interface Session {
  id: string;
  voterName?: string;
  userAgent?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser?: string;
  os?: string;
  completedAll: boolean;
  songsVoted: number;
  firstVisit: string;
  lastActivity: string;
}

// --- Analytics ---

export type AnalyticsEventType =
  | 'play'
  | 'pause'
  | 'seek'
  | 'page_view'
  | 'vote'
  | 'complete'
  | 'share'
  | 'segment_switch';

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  eventType: AnalyticsEventType;
  songId?: string;
  segmentId?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// --- UI State ---

export interface PollState {
  currentSongIndex: number;
  votes: Record<string, string>;         // songId → segmentId
  comments: Record<string, string>;      // songId → comment text
  listenedSegments: Record<string, string[]>; // songId → segmentIds listened
  hasCompleted: boolean;
  sessionId: string;
  voterName: string;
  isReturningVoter: boolean;
  segmentOrder: Record<string, string[]>; // songId → shuffled segment IDs
}

export interface AudioPlayerState {
  currentSegmentId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLooping: boolean;
  isLoading: boolean;
}

// --- Admin Dashboard ---

export interface SongResult {
  songId: string;
  songTitle: string;
  songArtist: string;
  totalVotes: number;
  segments: SegmentResult[];
  winner: SegmentResult | null;
  comments: VoterComment[];
}

export interface SegmentResult {
  segmentId: string;
  label: string;
  displayLabel: string;
  votes: number;
  percentage: number;
  isWinner: boolean;
}

export interface DashboardStats {
  totalVoters: number;
  completedVoters: number;
  completionRate: number;
  totalVotes: number;
  avgTimePerSong: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  votesOverTime: {
    timestamp: string;
    count: number;
  }[];
  dropOffBySong: {
    songNumber: number;
    songTitle: string;
    votersRemaining: number;
    dropOffRate: number;
  }[];
}

// --- Badges ---

export type BadgeType = 'speed_listener' | 'careful_listener' | 'early_bird';

export interface Badge {
  type: BadgeType;
  label: string;
  emoji: string;
  description: string;
}
