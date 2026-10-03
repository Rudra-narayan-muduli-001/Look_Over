import axios from 'axios';

export const api = axios.create({ baseURL: 'http://localhost:8000' });

export type Platform = 'github' | 'x' | 'instagram' | 'facebook' | 'linkedin' | 'other';

export interface Person {
  id: number;
  name: string;
  notes: string | null;
  avatar_url: string | null;
  check_interval_hours: number;
  created_at: string;
  links: ProfileLink[];
}

export interface ProfileLink {
  id: number;
  person_id: number;
  platform: Platform;
  url: string;
  handle: string | null;
  last_status: string;
  last_checked_at: string | null;
}

export interface Snapshot {
  id: number;
  person_id: number;
  link_id: number | null;
  platform: string;
  raw_json: string;
  hash: string;
  taken_at: string;
  trigger: string;
}

export interface Post {
  id: number;
  person_id: number;
  link_id: number;
  platform: string;
  external_id: string;
  text: string | null;
  media_urls: string | null;
  posted_at: string | null;
  first_seen_at: string;
}

export interface Change {
  id: number;
  person_id: number;
  link_id: number | null;
  type: string;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  detected_at: string;
  seen: number;
}

export interface CheckRun {
  id: number;
  person_id: number;
  started_at: string;
  finished_at: string | null;
  status: string;
  per_link_results: string | null;
}

export interface Timeline {
  snapshots: Snapshot[];
  changes: Change[];
}

export interface PersonCreate {
  name: string;
  notes?: string;
  check_interval_hours?: number;
}

export interface LinkCreate {
  platform: Platform;
  url: string;
}

export interface ManualSnapshot {
  profile: Record<string, unknown>;
  posts?: Array<Record<string, unknown>>;
}

const get = <T>(url: string, params?: Record<string, unknown>) =>
  api.get<T>(url, { params }).then((r) => r.data);

export const health = () => get<{ status: string }>('/health');
export const listPersons = () => get<Person[]>('/persons');
export const createPerson = (p: PersonCreate) =>
  api.post<Person>('/persons', p).then((r) => r.data);
export const getPerson = (id: number) => get<Person>(`/persons/${id}`);
export const updatePerson = (id: number, p: Partial<PersonCreate>) =>
  api.put<Person>(`/persons/${id}`, p).then((r) => r.data);
export const deletePerson = (id: number) => api.delete(`/persons/${id}`);
export const addLink = (personId: number, l: LinkCreate) =>
  api.post<ProfileLink>(`/persons/${personId}/links`, l).then((r) => r.data);
export const deleteLink = (linkId: number) => api.delete(`/links/${linkId}`);
export const checkPerson = (id: number, trigger = 'manual') =>
  api.post<CheckRun>(`/persons/${id}/check`, null, { params: { trigger } }).then((r) => r.data);
export const getTimeline = (id: number, since?: string) =>
  get<Timeline>(`/persons/${id}/timeline`, since ? { since } : undefined);
export const getPosts = (id: number) => get<Post[]>(`/persons/${id}/posts`);
export const getAlerts = (unseen = true, person_id?: number) =>
  get<Change[]>('/alerts', { unseen, person_id });
export const markChangeSeen = (id: number) =>
  api.patch<Change>(`/changes/${id}/seen`).then((r) => r.data);
export const markAlertsSeenAll = (person_id?: number) =>
  api.patch('/alerts/seen-all', null, { params: person_id ? { person_id } : undefined });
export const manualSnapshot = (linkId: number, payload: ManualSnapshot) =>
  api.post(`/links/${linkId}/manual-snapshot`, payload).then((r) => r.data);
