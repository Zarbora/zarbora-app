export type TimeUnit = "minutes" | "hours" | "days";
export type ResourceType = "housing" | "workspace" | "vehicle" | "utility";
export type ReleaseStatus = "available" | "occupied" | "releasing";
export type AttestationType = "skill" | "contribution" | "governance";
export type ProposalStatus = "active" | "completed";
export type ProposalResult = "passed" | "rejected";
export type ProposalCategory = "resource" | "zone" | "governance" | "treasury";

export interface Database {
  public: {
    Tables: {
      societies: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          governance_address: string | null;
          treasury_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          governance_address?: string | null;
          treasury_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          governance_address?: string | null;
          treasury_address?: string | null;
          updated_at?: string;
        };
      };
      zones: {
        Row: {
          id: string;
          society_id: string;
          name: string;
          description: string | null;
          icon: string;
          tax_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          name: string;
          description?: string | null;
          icon: string;
          tax_rate: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          society_id?: string;
          name?: string;
          description?: string | null;
          icon?: string;
          tax_rate?: number;
          updated_at?: string;
        };
      };
      resource_pools: {
        Row: {
          id: string;
          society_id: string;
          name: string;
          icon: string;
          collected: number;
          target: number;
          percentage: number;
          contributors: number;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          name: string;
          icon: string;
          collected: number;
          target: number;
          percentage: number;
          contributors: number;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          society_id?: string;
          name?: string;
          icon?: string;
          collected?: number;
          target?: number;
          percentage?: number;
          contributors?: number;
          description?: string;
          updated_at?: string;
        };
      };
      tax_allocation: {
        Row: {
          id: string;
          society_id: string;
          category: string;
          percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          category: string;
          percentage: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          society_id?: string;
          category?: string;
          percentage?: number;
          updated_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          society_id: string;
          zone_id: string;
          name: string;
          type: ResourceType;
          description: string | null;
          current_value: number;
          daily_tax: number;
          current_owner_address: string | null;
          current_owner_name: string | null;
          depreciating: boolean;
          original_value: number | null;
          depreciation_rate: number | null;
          min_holding_period: number | null;
          min_holding_period_unit: TimeUnit;
          has_min_holding_period: boolean;
          release_notice: number | null;
          release_notice_unit: TimeUnit;
          acquired_date: string | null;
          release_requested: boolean;
          release_request_date: string | null;
          occupancy_ends: string | null;
          status: ReleaseStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          zone_id: string;
          name: string;
          type: ResourceType;
          description?: string | null;
          current_value: number;
          daily_tax: number;
          current_owner_address?: string | null;
          current_owner_name?: string | null;
          depreciating?: boolean;
          original_value?: number | null;
          depreciation_rate?: number | null;
          min_holding_period?: number | null;
          min_holding_period_unit?: TimeUnit;
          has_min_holding_period?: boolean;
          release_notice?: number | null;
          release_notice_unit?: TimeUnit;
          acquired_date?: string | null;
          release_requested?: boolean;
          release_request_date?: string | null;
          occupancy_ends?: string | null;
          status?: ReleaseStatus;
        };
        Update: {
          society_id?: string;
          zone_id?: string;
          name?: string;
          type?: ResourceType;
          description?: string | null;
          current_value?: number;
          daily_tax?: number;
          current_owner_address?: string | null;
          current_owner_name?: string | null;
          depreciating?: boolean;
          original_value?: number | null;
          depreciation_rate?: number | null;
          min_holding_period?: number | null;
          min_holding_period_unit?: TimeUnit;
          has_min_holding_period?: boolean;
          release_notice?: number | null;
          release_notice_unit?: TimeUnit;
          acquired_date?: string | null;
          release_requested?: boolean;
          release_request_date?: string | null;
          occupancy_ends?: string | null;
          status?: ReleaseStatus;
        };
      };
      resource_amenities: {
        Row: {
          id: string;
          resource_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          resource_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          resource_id?: string;
          name?: string;
        };
      };
      zone_resource_types: {
        Row: {
          id: string;
          zone_id: string;
          resource_type: ResourceType;
          created_at: string;
        };
        Insert: {
          id?: string;
          zone_id: string;
          resource_type: ResourceType;
          created_at?: string;
        };
        Update: {
          zone_id?: string;
          resource_type?: ResourceType;
        };
      };
      zone_eligibility_rules: {
        Row: {
          id: string;
          zone_id: string;
          rule: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          zone_id: string;
          rule: string;
          created_at?: string;
        };
        Update: {
          zone_id?: string;
          rule?: string;
        };
      };
      resource_ownership_history: {
        Row: {
          id: string;
          resource_id: string;
          owner_address: string;
          owner_name: string | null;
          acquisition_value: number;
          acquisition_date: string;
          release_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resource_id: string;
          owner_address: string;
          owner_name?: string | null;
          acquisition_value: number;
          acquisition_date: string;
          release_date?: string | null;
          created_at?: string;
        };
        Update: {
          resource_id?: string;
          owner_address?: string;
          owner_name?: string | null;
          acquisition_value?: number;
          acquisition_date?: string;
          release_date?: string | null;
        };
      };
      identity: {
        Row: {
          id: string;
          society_id: string;
          address: string;
          name: string;
          join_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          address: string;
          name: string;
          join_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          society_id?: string;
          address?: string;
          name?: string;
          join_date?: string;
          updated_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          identity_id: string;
          name: string;
          since: string;
          until: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          identity_id: string;
          name: string;
          since: string;
          until?: string | null;
          active: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          identity_id?: string;
          name?: string;
          since?: string;
          until?: string | null;
          active?: boolean;
          updated_at?: string;
        };
      };
      attestations: {
        Row: {
          id: string;
          identity_id: string;
          name: string;
          issuer: string;
          date: string;
          description: string;
          type: AttestationType;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          identity_id: string;
          name: string;
          issuer: string;
          date: string;
          description: string;
          type: AttestationType;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          identity_id?: string;
          name?: string;
          issuer?: string;
          date?: string;
          description?: string;
          type?: AttestationType;
          updated_at?: string;
        };
      };
      harberger_stats: {
        Row: {
          id: string;
          identity_id: string;
          current_tax_payments: number;
          total_tax_paid: number;
          resources_held: number;
          governance_weight: number;
          voting_history: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          identity_id: string;
          current_tax_payments: number;
          total_tax_paid: number;
          resources_held: number;
          governance_weight: number;
          voting_history: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          identity_id?: string;
          current_tax_payments?: number;
          total_tax_paid?: number;
          resources_held?: number;
          governance_weight?: number;
          voting_history?: number;
          updated_at?: string;
        };
      };
      harberger_slots: {
        Row: {
          id: string;
          event_id: string;
          current_price: number;
          current_owner: string;
          hourly_rate: number;
          remaining_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          current_price: number;
          current_owner: string;
          hourly_rate: number;
          remaining_time: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          event_id?: string;
          current_price?: number;
          current_owner?: string;
          hourly_rate?: number;
          remaining_time?: string;
          updated_at?: string;
        };
      };
      harberger_pricing: {
        Row: {
          id: string;
          resource_id: string;
          min_price: number;
          max_price: number;
          tax_rate: number;
          retention_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          resource_id: string;
          min_price: number;
          max_price: number;
          tax_rate: number;
          retention_days: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          resource_id?: string;
          min_price?: number;
          max_price?: number;
          tax_rate?: number;
          retention_days?: number;
          updated_at?: string;
        };
      };
      proposals: {
        Row: {
          id: string;
          society_id: string;
          title: string;
          description: string;
          details: string;
          status: ProposalStatus;
          proposer: string;
          proposer_name: string;
          proposer_weight: number;
          votes_for: number;
          votes_against: number;
          total_votes: number;
          start_time: string;
          end_time: string;
          category: ProposalCategory;
          affected_zone: string | null;
          result: ProposalResult | null;
          implementation_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          title: string;
          description: string;
          details: string;
          status?: ProposalStatus;
          proposer: string;
          proposer_name: string;
          proposer_weight: number;
          votes_for?: number;
          votes_against?: number;
          total_votes?: number;
          start_time?: string;
          end_time: string;
          category: ProposalCategory;
          affected_zone?: string | null;
          result?: ProposalResult | null;
          implementation_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          society_id?: string;
          title?: string;
          description?: string;
          details?: string;
          status?: ProposalStatus;
          votes_for?: number;
          votes_against?: number;
          total_votes?: number;
          end_time?: string;
          result?: ProposalResult | null;
          implementation_time?: string | null;
          updated_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          proposal_id: string;
          voter: string;
          voter_name: string;
          weight: number;
          direction: "for" | "against";
          created_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          voter: string;
          voter_name: string;
          weight: number;
          direction: "for" | "against";
          created_at?: string;
        };
        Update: {
          proposal_id?: string;
          voter?: string;
          voter_name?: string;
          weight?: number;
          direction?: "for" | "against";
        };
      };
      governance_settings: {
        Row: {
          id: string;
          society_id: string;
          voting_period_days: number;
          quorum_percentage: number;
          approval_threshold_percentage: number;
          min_proposal_weight: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          society_id: string;
          voting_period_days: number;
          quorum_percentage: number;
          approval_threshold_percentage: number;
          min_proposal_weight: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          society_id?: string;
          voting_period_days?: number;
          quorum_percentage?: number;
          approval_threshold_percentage?: number;
          min_proposal_weight?: number;
          updated_at?: string;
        };
      };
    };
  };
}
