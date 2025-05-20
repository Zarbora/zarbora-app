import { supabase } from "./supabase";
import type { Database } from "@/types/supabase";
import { handleSupabaseError } from "./errors";

type Tables = Database["public"]["Tables"];

// Types
export interface Speaker {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  topics: string[];
  past_sessions: number;
  endorsements: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  speaker_id: string;
  speaker: Speaker;
  location: string;
  start_time: string;
  end_time: string;
  date: string;
  tags: string[];
  is_premium: boolean;
  votes: number;
}

export interface Zone {
  id: string;
  society_id: string;
  name: string;
  icon: string;
  description: string;
  tax_rate: number;
  resource_count: number;
  occupancy_rate: number;
  resource_types: string[];
  total_value: number;
  daily_tax_revenue: number;
  eligibility_rules: string[];
  custom_hooks: string[];
}

export interface ResourcePool {
  id: string;
  society_id: string;
  name: string;
  icon: string;
  collected: number;
  target: number;
  percentage: number;
  contributors: number;
  description: string;
}

export interface TaxAllocation {
  category: string;
  percentage: number;
  society_id: string;
}

export interface Proposal {
  id: string;
  society_id: string;
  title: string;
  description: string;
  status: "active" | "completed";
  proposer: string;
  proposer_name: string;
  proposer_weight: number;
  votes_for: number;
  votes_against: number;
  total_votes: number;
  end_time: string;
  category: string;
  affected_zone: string;
  details: string;
  result?: "passed" | "rejected";
  implementation?: string;
}

export interface Society {
  id: string;
  name: string;
  description: string | null;
  total_resources: number;
  zone_count: number;
  total_members: number;
  total_proposals: number;
}

export interface Identity {
  id: string;
  society_id: string;
  name: string;
  roles: {
    name: string;
    since: string;
    until: string;
    active: boolean;
  }[];
  attestations: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    description: string;
    type: string;
  }[];
  harberger_stats: {
    current_tax_payments: number;
    total_tax_paid: number;
    resources_held: number;
    governance_weight: number;
    voting_history: string[];
  };
}

export interface HarbergerSlot {
  id: string;
  event_id: string;
  current_price: number;
  current_owner: string;
  hourly_rate: number;
  remaining_time: string;
  created_at: string;
  updated_at: string;
}

export interface HarbergerPricing {
  id: string;
  resource_id: string;
  min_price: number;
  max_price: number;
  tax_rate: number;
  retention_days: number;
  created_at: string;
  updated_at: string;
}

export const api = {
  societies: {
    async getAll() {
      const { data, error } = await supabase
        .from("societies")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching societies:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async getById(id: string) {
      const { data, error } = await supabase
        .from("societies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching society:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async create(society: Tables["societies"]["Insert"]) {
      const { data, error } = await supabase
        .from("societies")
        .insert(society)
        .select()
        .single();

      if (error) {
        console.error("Error creating society:", error);
        handleSupabaseError(error);
      }
      return data;
    },
  },

  zones: {
    async getBySociety(societyId: string) {
      if (!societyId) {
        throw new Error("societyId is required");
      }

      const { data, error } = await supabase
        .from("zones")
        .select(
          `
          *,
          zone_resource_types (
            resource_type
          ),
          zone_eligibility_rules (
            rule
          )
        `
        )
        .eq("society_id", societyId)
        .order("name");

      if (error) {
        console.error("Error fetching zones:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async create(zone: Tables["zones"]["Insert"]) {
      const { data, error } = await supabase
        .from("zones")
        .insert(zone)
        .select()
        .single();

      if (error) {
        console.error("Error creating zone:", error);
        handleSupabaseError(error);
      }
      return data;
    },
  },

  resources: {
    async getByZone(zoneId: string) {
      if (!zoneId) {
        throw new Error("zoneId is required");
      }

      const { data, error } = await supabase
        .from("resources")
        .select(
          `
          *,
          resource_amenities (
            name
          )
        `
        )
        .eq("zone_id", zoneId)
        .order("name");

      if (error) {
        console.error("Error fetching resources by zone:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async getBySociety(societyId: string) {
      if (!societyId) {
        throw new Error("societyId is required");
      }

      const { data, error } = await supabase
        .from("resources")
        .select(
          `
          *,
          zones (
            name,
            icon
          ),
          resource_amenities (
            name
          )
        `
        )
        .eq("society_id", societyId)
        .order("name");

      if (error) {
        console.error("Error fetching resources by society:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async create(resource: Tables["resources"]["Insert"]) {
      const { data, error } = await supabase
        .from("resources")
        .insert(resource)
        .select()
        .single();

      if (error) {
        console.error("Error creating resource:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async update(id: string, updates: Tables["resources"]["Update"]) {
      if (!id) {
        throw new Error("id is required");
      }

      const { data, error } = await supabase
        .from("resources")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating resource:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async requestRelease(id: string) {
      if (!id) {
        throw new Error("id is required");
      }

      const { data, error } = await supabase
        .from("resources")
        .update({
          release_requested: true,
          release_request_date: new Date().toISOString(),
          status: "releasing",
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error requesting resource release:", error);
        handleSupabaseError(error);
      }
      return data;
    },
  },

  resourcePools: {
    async getBySociety(societyId: string) {
      if (!societyId) {
        throw new Error("societyId is required");
      }

      const { data, error } = await supabase
        .from("resource_pools")
        .select("*")
        .eq("society_id", societyId)
        .order("name");

      if (error) {
        console.error("Error fetching resource pools:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async create(pool: Tables["resource_pools"]["Insert"]) {
      const { data, error } = await supabase
        .from("resource_pools")
        .insert(pool)
        .select()
        .single();

      if (error) {
        console.error("Error creating resource pool:", error);
        handleSupabaseError(error);
      }
      return data;
    },
  },

  taxAllocation: {
    async getBySociety(societyId: string) {
      if (!societyId) {
        throw new Error("societyId is required");
      }

      const { data, error } = await supabase
        .from("tax_allocation")
        .select("*")
        .eq("society_id", societyId)
        .order("percentage", { ascending: false });

      if (error) {
        console.error("Error fetching tax allocation:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async update(societyId: string, allocations: TaxAllocation[]) {
      const { data, error } = await supabase
        .from("tax_allocation")
        .upsert(
          allocations.map((allocation) => ({
            ...allocation,
            society_id: societyId,
          }))
        )
        .select();

      if (error) {
        console.error("Error updating tax allocation:", error);
        handleSupabaseError(error);
      }
      return data;
    },
  },

  identity: {
    async getBySociety(societyId: string) {
      if (!societyId) {
        throw new Error("societyId is required");
      }

      const { data, error } = await supabase
        .from("identity")
        .select(
          `
          *,
          roles (
            name,
            since,
            until,
            active
          ),
          attestations (
            id,
            name,
            issuer,
            date,
            description,
            type
          ),
          harberger_stats (
            current_tax_payments,
            total_tax_paid,
            resources_held,
            governance_weight,
            voting_history
          )
        `
        )
        .eq("society_id", societyId)
        .single();

      if (error) {
        console.error("Error fetching identity:", error);
        handleSupabaseError(error);
      }

      return {
        ...data,
        harbergerStats: {
          currentTaxPayments: data.harberger_stats.current_tax_payments,
          totalTaxPaid: data.harberger_stats.total_tax_paid,
          resourcesHeld: data.harberger_stats.resources_held,
          governanceWeight: data.harberger_stats.governance_weight,
          votingHistory: data.harberger_stats.voting_history,
        },
      };
    },

    async update(id: string, updates: Partial<Identity>) {
      const { data, error } = await supabase
        .from("identity")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating identity:", error);
        handleSupabaseError(error);
      }
      return data;
    },
  },

  harbergerSlots: {
    async getByEvent(eventId: string) {
      if (!eventId) {
        throw new Error("eventId is required");
      }

      const { data, error } = await supabase
        .from("harberger_slots")
        .select("*")
        .eq("event_id", eventId)
        .single();

      if (error) {
        console.error("Error fetching harberger slot:", error);
        handleSupabaseError(error);
      }

      return {
        currentPrice: data.current_price,
        currentOwner: data.current_owner,
        hourlyRate: data.hourly_rate,
        remainingTime: data.remaining_time,
      };
    },

    async update(id: string, updates: Partial<HarbergerSlot>) {
      const { data, error } = await supabase
        .from("harberger_slots")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating harberger slot:", error);
        handleSupabaseError(error);
      }
      return data;
    },
  },

  harbergerPricing: {
    async getByResource(resourceId: string) {
      if (!resourceId) {
        throw new Error("resourceId is required");
      }

      const { data, error } = await supabase
        .from("harberger_pricing")
        .select("*")
        .eq("resource_id", resourceId)
        .single();

      if (error) {
        console.error("Error fetching harberger pricing:", error);
        handleSupabaseError(error);
      }

      return {
        minPrice: data.min_price,
        maxPrice: data.max_price,
        taxRate: data.tax_rate,
        retentionDays: data.retention_days,
      };
    },

    async update(id: string, updates: Partial<HarbergerPricing>) {
      const { data, error } = await supabase
        .from("harberger_pricing")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating harberger pricing:", error);
        handleSupabaseError(error);
      }
      return data;
    },
  },
};

// API Functions
export async function getSociety(id: string) {
  const { data, error } = await supabase
    .from("societies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Society;
}

export async function getSpeakers(societyId: string) {
  const { data, error } = await supabase
    .from("speakers")
    .select("*")
    .eq("society_id", societyId);

  if (error) throw error;
  return data as Speaker[];
}

export async function getEvents(societyId: string) {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      speaker:speakers(*)
    `
    )
    .eq("society_id", societyId);

  if (error) throw error;
  return data as Event[];
}

export async function getZones(societyId: string) {
  const { data, error } = await supabase
    .from("zones")
    .select("*")
    .eq("society_id", societyId);

  if (error) throw error;
  return data as Zone[];
}

export async function getProposals(societyId: string) {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("society_id", societyId);

  if (error) throw error;
  return data as Proposal[];
}

export async function getGovernanceStats(societyId: string) {
  const { data: proposals, error: proposalsError } = await supabase
    .from("proposals")
    .select("*")
    .eq("society_id", societyId);

  if (proposalsError) throw proposalsError;

  const { data: topVoters, error: votersError } = await supabase
    .from("members")
    .select("address, name, voting_weight")
    .eq("society_id", societyId)
    .order("voting_weight", { ascending: false })
    .limit(3);

  if (votersError) throw votersError;

  const totalProposals = proposals.length;
  const activeProposals = proposals.filter((p) => p.status === "active").length;
  const completedProposals = proposals.filter(
    (p) => p.status === "completed"
  ).length;
  const passedProposals = proposals.filter((p) => p.result === "passed").length;
  const passRate = (passedProposals / completedProposals) * 100;

  const totalVotes = proposals.reduce((sum, p) => sum + p.total_votes, 0);
  const averageVoterParticipation = totalVotes / totalProposals;

  return {
    totalProposals,
    activeProposals,
    completedProposals,
    passRate,
    averageVoterParticipation,
    topVoters,
  };
}

export async function createProposal(proposal: Omit<Proposal, "id">) {
  const { data, error } = await supabase
    .from("proposals")
    .insert([proposal])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProposal(id: string, updates: Partial<Proposal>) {
  const { data, error } = await supabase
    .from("proposals")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createZone(zone: Omit<Zone, "id">) {
  const { data, error } = await supabase
    .from("zones")
    .insert([zone])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateZone(id: string, updates: Partial<Zone>) {
  const { data, error } = await supabase
    .from("zones")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
