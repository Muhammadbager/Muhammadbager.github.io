export type ApplicationStage =
  | "Discovered"
  | "Saved"
  | "Ready"
  | "Applied"
  | "Online Assessment"
  | "Recruiter Screen"
  | "Technical Interview"
  | "Final Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn"
  | "Position Closed"
  | "Accepted";

export interface Application {
  id: string;
  company: string;
  job_title: string;
  job_url: string | null;
  location: string | null;
  listing_date: string | null;
  applied_date: string | null;
  stage: ApplicationStage;
  source: string | null;
  application_method: string | null;
  resume_name: string | null;
  notes: string | null;
  next_action: string | null;
  updated_at: string;
}

export interface JobMatch {
  id: string;
  company: string;
  title: string;
  location: string | null;
  url: string;
  posted_at: string | null;
  discovered_at: string;
  is_wishlist: boolean;
}

