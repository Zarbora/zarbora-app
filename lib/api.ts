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
  daily_tax_revenue: number;
  custom_hooks?: string[];
  zone_resource_types?: Array<{ resource_type: string }>;
  zone_eligibility_rules?: Array<{ rule: string }>;
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

export interface DashboardStats {
  totalResources: number;
  zoneCount: number;
  totalMembers: number;
  totalProposals: number;
  totalResourceValue: number;
  totalDailyTax: number;
  activeProposals: number;
  availableResources: number;
  governanceParticipationRate: number;
  resourceUtilizationRate: number;
}

export interface Member {
  id: string;
  society_id: string;
  address: string;
  name: string;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface MembershipRequest {
  id: string;
  society_id: string;
  applicant_address: string;
  applicant_name: string;
  zupass_verified: boolean;
  status: "pending" | "approved" | "rejected";
  application_text?: string;
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
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

    async update(id: string, updates: Partial<Zone>) {
      if (!id) {
        throw new Error("id is required");
      }

      const { data, error } = await supabase
        .from("zones")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating zone:", error);
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

  governance: {
    async getProposals(societyId: string) {
      if (!societyId) {
        throw new Error("societyId is required");
      }

      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("society_id", societyId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching proposals:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async getProposalById(proposalId: string) {
      if (!proposalId) {
        throw new Error("proposalId is required");
      }

      const { data, error } = await supabase
        .from("proposals")
        .select(
          `
          *,
          votes (*)
        `
        )
        .eq("id", proposalId)
        .single();

      if (error) {
        console.error("Error fetching proposal:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async createProposal(proposal: Tables["proposals"]["Insert"]) {
      const { data, error } = await supabase
        .from("proposals")
        .insert(proposal)
        .select()
        .single();

      if (error) {
        console.error("Error creating proposal:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async vote(vote: Tables["votes"]["Insert"]) {
      const { data, error } = await supabase
        .from("votes")
        .insert(vote)
        .select()
        .single();

      if (error) {
        console.error("Error casting vote:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async getVotesByProposal(proposalId: string) {
      if (!proposalId) {
        throw new Error("proposalId is required");
      }

      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("proposal_id", proposalId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching votes:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async getSettings(societyId: string) {
      if (!societyId) {
        throw new Error("societyId is required");
      }

      const { data, error } = await supabase
        .from("governance_settings")
        .select("*")
        .eq("society_id", societyId)
        .single();

      if (error) {
        console.error("Error fetching governance settings:", error);
        handleSupabaseError(error);
      }
      return data;
    },

    async updateSettings(
      societyId: string,
      updates: Tables["governance_settings"]["Update"]
    ) {
      if (!societyId) {
        throw new Error("societyId is required");
      }

      const { data, error } = await supabase
        .from("governance_settings")
        .update(updates)
        .eq("society_id", societyId)
        .select()
        .single();

      if (error) {
        console.error("Error updating governance settings:", error);
        handleSupabaseError(error);
      }
      return data;
    },
  },

  members: {
    async getAll(societyId: string) {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("society_id", societyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Member[];
    },

    async getMembershipRequests(societyId: string) {
      const { data, error } = await supabase
        .from("membership_requests")
        .select("*")
        .eq("society_id", societyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MembershipRequest[];
    },

    async submitMembershipRequest(
      request: Omit<
        MembershipRequest,
        | "id"
        | "created_at"
        | "updated_at"
        | "status"
        | "reviewed_by"
        | "reviewed_at"
      >
    ) {
      const { data, error } = await supabase
        .from("membership_requests")
        .insert([{ ...request, status: "pending" }])
        .select()
        .single();

      if (error) throw error;
      return data as MembershipRequest;
    },

    async reviewMembershipRequest(
      requestId: string,
      status: "approved" | "rejected",
      reviewerId: string
    ) {
      const { data: request, error: requestError } = await supabase
        .from("membership_requests")
        .update({
          status,
          reviewed_by: reviewerId,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId)
        .select()
        .single();

      if (requestError) throw requestError;

      // If approved, create a new member
      if (status === "approved") {
        const { error: memberError } = await supabase.from("members").insert([
          {
            society_id: request.society_id,
            address: request.applicant_address,
            name: request.applicant_name,
            join_date: new Date().toISOString(),
          },
        ]);

        if (memberError) throw memberError;
      }

      return request as MembershipRequest;
    },

    async verifyZupass(address: string): Promise<boolean> {
      // TODO: Implement actual Zupass verification
      // This is a placeholder that always returns true
      return true;
    },

    async create(
      member: Omit<Member, "id" | "created_at" | "updated_at" | "join_date">
    ) {
      const { data, error } = await supabase
        .from("members")
        .insert([
          {
            ...member,
            join_date: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Member;
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

export async function getDashboardStats(
  societyId: string
): Promise<DashboardStats> {
  // Get resources count and values
  const { data: resources, error: resourcesError } = await supabase
    .from("resources")
    .select("current_value, daily_tax, status")
    .eq("society_id", societyId);

  if (resourcesError) throw resourcesError;

  // Get zones count
  const { count: zoneCount, error: zonesError } = await supabase
    .from("zones")
    .select("*", { count: "exact", head: true })
    .eq("society_id", societyId);

  if (zonesError) throw zonesError;

  // Get members count
  const { count: memberCount, error: membersError } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("society_id", societyId);

  if (membersError) throw membersError;

  // Get proposals data
  const { data: proposals, error: proposalsError } = await supabase
    .from("proposals")
    .select("status")
    .eq("society_id", societyId);

  if (proposalsError) throw proposalsError;

  // Calculate statistics
  const totalResources = resources?.length || 0;
  const totalResourceValue =
    resources?.reduce((sum, r) => sum + (r.current_value || 0), 0) || 0;
  const totalDailyTax =
    resources?.reduce((sum, r) => sum + (r.daily_tax || 0), 0) || 0;
  const availableResources =
    resources?.filter((r) => r.status === "available").length || 0;
  const activeProposals =
    proposals?.filter((p) => p.status === "active").length || 0;
  const totalProposals = proposals?.length || 0;

  return {
    totalResources,
    zoneCount: zoneCount || 0,
    totalMembers: memberCount || 0,
    totalProposals,
    totalResourceValue,
    totalDailyTax,
    activeProposals,
    availableResources,
    governanceParticipationRate: 0, // Can be implemented if needed
    resourceUtilizationRate: totalResources
      ? ((totalResources - availableResources) / totalResources) * 100
      : 0,
  };
}
