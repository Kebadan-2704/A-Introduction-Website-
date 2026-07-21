import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yrzmkvaqzmfxojtywmji.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyem1rdmFxem1meG9qdHl3bWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1OTg0MjEsImV4cCI6MjEwMDE3NDQyMX0.V3csvmRR2MC-BaWRZf-pEKlu23UrpQ77MwRmH8gjHto";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CloudVoteData {
  id?: string;
  songId: string;
  segmentId: string;
  sessionId: string;
  voterName?: string;
  comment?: string;
  timestamp: number;
}

/**
 * Submits the completed ballot to Supabase cloud table `blind_votes`.
 */
export async function submitCloudBallot({
  sessionId,
  voterName,
  votes,
  comments,
}: {
  sessionId: string;
  voterName: string;
  votes: Record<string, string>;
  comments: Record<string, string>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const rows = Object.entries(votes).map(([songId, segmentId]) => ({
      session_id: sessionId,
      voter_name: voterName || "Anonymous Voter",
      song_id: songId,
      segment_id: segmentId,
      comment: comments[songId] || null,
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("blind_votes").insert(rows);

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Submit ballot error:", err);
    return { success: false, error: err.message || "Unknown cloud error" };
  }
}

/**
 * Fetches all un-blinded vote records from Supabase for the Admin Dashboard.
 */
export async function fetchCloudVotes(): Promise<CloudVoteData[]> {
  try {
    const { data, error } = await supabase
      .from("blind_votes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Could not fetch from Supabase:", error?.message);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      songId: row.song_id,
      segmentId: row.segment_id,
      sessionId: row.session_id,
      voterName: row.voter_name,
      comment: row.comment || undefined,
      timestamp: new Date(row.created_at).getTime(),
    }));
  } catch (err) {
    console.error("Fetch cloud votes error:", err);
    return [];
  }
}
