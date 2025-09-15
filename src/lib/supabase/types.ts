export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          project_id: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          project_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          project_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bug_report_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string
          bug_id: string
          bug_report_id: string
          id: string
          notes: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by: string
          bug_id: string
          bug_report_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string
          bug_id?: string
          bug_report_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bug_report_assignments_bug_id_fkey"
            columns: ["bug_id"]
            isOneToOne: false
            referencedRelation: "bugs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bug_report_assignments_bug_id_fkey"
            columns: ["bug_id"]
            isOneToOne: false
            referencedRelation: "bugs_with_report_counts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bug_report_assignments_bug_report_id_fkey"
            columns: ["bug_report_id"]
            isOneToOne: false
            referencedRelation: "bug_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      bug_reports: {
        Row: {
          created_at: string | null
          description: string
          enhanced_context: Json | null
          external_user_id: string | null
          hidden: boolean | null
          id: string
          images: string[] | null
          project_id: string
          referrer: string | null
          session_id: string | null
          updated_at: string | null
          url: string | null
          user_agent: string | null
          user_email: string | null
          user_fingerprint: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          enhanced_context?: Json | null
          external_user_id?: string | null
          hidden?: boolean | null
          id?: string
          images?: string[] | null
          project_id: string
          referrer?: string | null
          session_id?: string | null
          updated_at?: string | null
          url?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_fingerprint?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          enhanced_context?: Json | null
          external_user_id?: string | null
          hidden?: boolean | null
          id?: string
          images?: string[] | null
          project_id?: string
          referrer?: string | null
          session_id?: string | null
          updated_at?: string | null
          url?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_fingerprint?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bug_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bug_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      bugs: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          priority: string | null
          project_id: string
          resolved_at: string | null
          severity: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id: string
          resolved_at?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          priority?: string | null
          project_id?: string
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bugs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bugs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_metrics: {
        Row: {
          created_at: string | null
          date: string
          first_feedbacks: number | null
          mrr: number | null
          projects_created: number | null
          signups: number | null
          subscription_upgrades: number | null
          subscriptions: number | null
          total_feedback: number | null
          total_projects: number | null
          total_users: number | null
          widgets_copied: number | null
          widgets_viewed: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          first_feedbacks?: number | null
          mrr?: number | null
          projects_created?: number | null
          signups?: number | null
          subscription_upgrades?: number | null
          subscriptions?: number | null
          total_feedback?: number | null
          total_projects?: number | null
          total_users?: number | null
          widgets_copied?: number | null
          widgets_viewed?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          first_feedbacks?: number | null
          mrr?: number | null
          projects_created?: number | null
          signups?: number | null
          subscription_upgrades?: number | null
          subscriptions?: number | null
          total_feedback?: number | null
          total_projects?: number | null
          total_users?: number | null
          widgets_copied?: number | null
          widgets_viewed?: number | null
        }
        Relationships: []
      }
      email_preferences: {
        Row: {
          all_notifications_enabled: boolean | null
          created_at: string | null
          id: string
          new_bug_reports_enabled: boolean | null
          new_feedback_enabled: boolean | null
          new_reviews_enabled: boolean | null
          project_id: string
          updated_at: string | null
          user_id: string
          weekly_digest_enabled: boolean | null
        }
        Insert: {
          all_notifications_enabled?: boolean | null
          created_at?: string | null
          id?: string
          new_bug_reports_enabled?: boolean | null
          new_feedback_enabled?: boolean | null
          new_reviews_enabled?: boolean | null
          project_id: string
          updated_at?: string | null
          user_id: string
          weekly_digest_enabled?: boolean | null
        }
        Update: {
          all_notifications_enabled?: boolean | null
          created_at?: string | null
          id?: string
          new_bug_reports_enabled?: boolean | null
          new_feedback_enabled?: boolean | null
          new_reviews_enabled?: boolean | null
          project_id?: string
          updated_at?: string | null
          user_id?: string
          weekly_digest_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "email_preferences_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_preferences_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          assigned_to_feature: string | null
          created_at: string | null
          description: string
          external_user_id: string | null
          hidden: boolean | null
          id: string
          ignored_at: string | null
          ignored_by: string | null
          project_id: string
          referrer: string | null
          session_id: string | null
          status: string
          updated_at: string | null
          url: string | null
          user_agent: string | null
          user_email: string | null
          user_fingerprint: string
          user_id: string | null
        }
        Insert: {
          assigned_to_feature?: string | null
          created_at?: string | null
          description: string
          external_user_id?: string | null
          hidden?: boolean | null
          id?: string
          ignored_at?: string | null
          ignored_by?: string | null
          project_id: string
          referrer?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string | null
          url?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_fingerprint: string
          user_id?: string | null
        }
        Update: {
          assigned_to_feature?: string | null
          created_at?: string | null
          description?: string
          external_user_id?: string | null
          hidden?: boolean | null
          id?: string
          ignored_at?: string | null
          ignored_by?: string | null
          project_id?: string
          referrer?: string | null
          session_id?: string | null
          status?: string
          updated_at?: string | null
          url?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_fingerprint?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_requests_assigned_to_feature_fkey"
            columns: ["assigned_to_feature"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_votes: {
        Row: {
          created_at: string | null
          external_user_id: string | null
          feature_id: string
          id: string
          project_id: string
          session_id: string | null
          updated_at: string | null
          user_agent: string | null
          user_fingerprint: string
          user_id: string | null
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          external_user_id?: string | null
          feature_id: string
          id?: string
          project_id: string
          session_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_fingerprint: string
          user_id?: string | null
          vote_type: string
        }
        Update: {
          created_at?: string | null
          external_user_id?: string | null
          feature_id?: string
          id?: string
          project_id?: string
          session_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_fingerprint?: string
          user_id?: string | null
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_votes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_votes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          created_at: string | null
          created_by: string
          description: string
          downvotes: number | null
          id: string
          priority: string
          project_id: string
          request_count: number | null
          status: string
          title: string
          updated_at: string | null
          upvotes: number | null
          votable: boolean
          vote_count: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description: string
          downvotes?: number | null
          id?: string
          priority?: string
          project_id: string
          request_count?: number | null
          status?: string
          title: string
          updated_at?: string | null
          upvotes?: number | null
          votable?: boolean
          vote_count?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string
          downvotes?: number | null
          id?: string
          priority?: string
          project_id?: string
          request_count?: number | null
          status?: string
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          votable?: boolean
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "features_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "features_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string | null
          hidden: boolean | null
          id: string
          is_read: boolean | null
          message: string
          project_id: string
          read_at: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          hidden?: boolean | null
          id?: string
          is_read?: boolean | null
          message: string
          project_id: string
          read_at?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          hidden?: boolean | null
          id?: string
          is_read?: boolean | null
          message?: string
          project_id?: string
          read_at?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_id: string
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id: string
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          can_share: boolean
          created_at: string | null
          hidden: boolean | null
          id: string
          project_id: string
          rating: number
          review: string
          updated_at: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          can_share?: boolean
          created_at?: string | null
          hidden?: boolean | null
          id?: string
          project_id: string
          rating: number
          review: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          can_share?: boolean
          created_at?: string | null
          hidden?: boolean | null
          id?: string
          project_id?: string
          rating?: number
          review?: string
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: string
          team_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role?: string
          team_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_invites_invited_by_profile"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_personal: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_personal?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_personal?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          project_id: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          project_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          project_id?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_funnel_status: {
        Row: {
          created_at: string | null
          current_funnel_step: string | null
          days_to_first_feedback: number | null
          days_to_first_project: number | null
          days_to_subscription: number | null
          email: string | null
          first_feedback_date: string | null
          first_feedback_project_id: string | null
          first_project_date: string | null
          first_project_id: string | null
          is_active: boolean | null
          last_login: string | null
          signup_date: string | null
          signup_source: string | null
          subscription_tier: string | null
          subscription_upgrade_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_funnel_step?: string | null
          days_to_first_feedback?: number | null
          days_to_first_project?: number | null
          days_to_subscription?: number | null
          email?: string | null
          first_feedback_date?: string | null
          first_feedback_project_id?: string | null
          first_project_date?: string | null
          first_project_id?: string | null
          is_active?: boolean | null
          last_login?: string | null
          signup_date?: string | null
          signup_source?: string | null
          subscription_tier?: string | null
          subscription_upgrade_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_funnel_step?: string | null
          days_to_first_feedback?: number | null
          days_to_first_project?: number | null
          days_to_subscription?: number | null
          email?: string | null
          first_feedback_date?: string | null
          first_feedback_project_id?: string | null
          first_project_date?: string | null
          first_project_id?: string | null
          is_active?: boolean | null
          last_login?: string | null
          signup_date?: string | null
          signup_source?: string | null
          subscription_tier?: string | null
          subscription_upgrade_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_interval: string | null
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_interval?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          created_at: string | null
          current_period_feedback: number | null
          feature_request_count: number | null
          feedback_count: number | null
          id: string
          last_reset: string | null
          project_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_feedback?: number | null
          feature_request_count?: number | null
          feedback_count?: number | null
          id?: string
          last_reset?: string | null
          project_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_feedback?: number | null
          feature_request_count?: number | null
          feedback_count?: number | null
          id?: string
          last_reset?: string | null
          project_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      widget_settings: {
        Row: {
          color: string
          created_at: string | null
          custom_text: string | null
          icon: string
          id: string
          language: string | null
          position: string
          project_id: string
          show_branding: boolean | null
          show_bug_reports: boolean | null
          show_feedback: boolean | null
          show_reviews: boolean | null
          show_text: boolean
          size: string
          style: string
          updated_at: string | null
        }
        Insert: {
          color?: string
          created_at?: string | null
          custom_text?: string | null
          icon?: string
          id?: string
          language?: string | null
          position?: string
          project_id: string
          show_branding?: boolean | null
          show_bug_reports?: boolean | null
          show_feedback?: boolean | null
          show_reviews?: boolean | null
          show_text?: boolean
          size?: string
          style?: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          custom_text?: string | null
          icon?: string
          id?: string
          language?: string | null
          position?: string
          project_id?: string
          show_branding?: boolean | null
          show_bug_reports?: boolean | null
          show_feedback?: boolean | null
          show_reviews?: boolean | null
          show_text?: boolean
          size?: string
          style?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "widget_settings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widget_settings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      bugs_with_report_counts: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string | null
          priority: string | null
          project_id: string | null
          report_count: number | null
          resolved_at: string | null
          severity: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bugs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bugs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects_ids"
            referencedColumns: ["id"]
          },
        ]
      }
      public_projects_ids: {
        Row: {
          id: string | null
        }
        Insert: {
          id?: string | null
        }
        Update: {
          id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_accept_team_invitation: {
        Args: { p_team_id: string; p_user_email: string }
        Returns: boolean
      }
      can_add_team_member: {
        Args: { p_user_id: string }
        Returns: {
          can_add: boolean
          current_count: number
          limit_count: number
          reason: string
          tier: string
        }[]
      }
      can_submit_feedback: {
        Args: { p_user_id: string }
        Returns: {
          can_submit: boolean
          current_count: number
          limit_count: number
          reason: string
          tier: string
        }[]
      }
      cleanup_unused_bug_images: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_activation_funnel: {
        Args: { end_date: string; start_date: string }
        Returns: {
          avg_time_to_step: number
          conversion_rate: number
          step: string
          step_order: number
          users_count: number
        }[]
      }
      get_active_projects_this_month: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
        }[]
      }
      get_daily_metrics: {
        Args: { days_back: number } | { end_date: string; start_date: string }
        Returns: {
          date: string
          first_feedbacks: number
          projects_created: number
          signups: number
          subscription_upgrades: number
        }[]
      }
      get_effective_email_preferences: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: {
          all_notifications_enabled: boolean
          new_bug_reports_enabled: boolean
          new_feedback_enabled: boolean
          new_reviews_enabled: boolean
          project_id: string
          role: string
          user_id: string
          weekly_digest_enabled: boolean
        }[]
      }
      get_effective_subscription: {
        Args: { p_user_id: string }
        Returns: {
          billing_interval: string
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          is_team_member_subscription: boolean
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          tier: string
          updated_at: string
          user_id: string
        }[]
      }
      get_email_preference_defaults: {
        Args: { user_role: string }
        Returns: Json
      }
      get_hidden_feedback_count: {
        Args: { p_project_id: string }
        Returns: {
          bug_reports_hidden: number
          feedback_hidden: number
          total_hidden: number
        }[]
      }
      get_monthly_submissions_per_project: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_submissions: number
        }[]
      }
      get_retained_projects: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
        }[]
      }
      get_subscription_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          free: number
          paid: number
        }[]
      }
      get_team_members_with_preferences: {
        Args: { p_notification_type: string; p_project_id: string }
        Returns: {
          all_notifications_enabled: boolean
          new_bug_reports_enabled: boolean
          new_feedback_enabled: boolean
          new_reviews_enabled: boolean
          role: string
          user_id: string
        }[]
      }
      get_user_limits: {
        Args: { p_user_id: string }
        Returns: {
          current_period_feature_requests: number
          current_period_feedback: number
          feature_request_count: number
          feedback_count: number
          is_at_feedback_limit: boolean
          is_at_project_limit: boolean
          max_feedback: number
          max_projects: number
          project_count: number
          tier: string
          total_current_period: number
        }[]
      }
      get_user_project_role: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: string
      }
      get_votable_features: {
        Args: { p_project_id: string; p_user_fingerprint?: string }
        Returns: {
          created_at: string
          description: string
          downvotes: number
          id: string
          priority: string
          request_count: number
          status: string
          title: string
          upvotes: number
          user_vote: string
          vote_count: number
        }[]
      }
      increment_feedback_count: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      increment_project_count: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      mark_feedback_as_read: {
        Args: { feedback_id: string; owner_user_id: string }
        Returns: boolean
      }
      mark_multiple_feedback_as_read: {
        Args: { feedback_ids: string[]; owner_user_id: string }
        Returns: number
      }
      reset_period_feedback: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      submit_feature_vote: {
        Args: {
          p_external_user_id?: string
          p_feature_id: string
          p_project_id: string
          p_session_id?: string
          p_user_agent?: string
          p_user_fingerprint: string
          p_user_id?: string
          p_vote_type: string
        }
        Returns: {
          downvotes: number
          success: boolean
          upvotes: number
          user_vote: string
          vote_count: number
        }[]
      }
      sync_user_project_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      track_user_event: {
        Args: {
          p_event_data?: Json
          p_event_type: string
          p_ip_address?: string
          p_project_id?: string
          p_referrer?: string
          p_session_id?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: string
      }
      update_user_funnel_status: {
        Args: { p_event_type: string; p_project_id?: string; p_user_id: string }
        Returns: undefined
      }
      user_is_team_member: {
        Args: { check_team_id: string; check_user_id: string }
        Returns: boolean
      }
      user_is_team_owner: {
        Args: { check_team_id: string; check_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
