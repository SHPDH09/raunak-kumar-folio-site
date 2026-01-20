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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          image_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      greetings: {
        Row: {
          code: string
          created_at: string
          created_by: string
          custom_message: string | null
          date_of_birth: string | null
          email: string | null
          expires_at: string
          greeting_type: Database["public"]["Enums"]["greeting_type"]
          id: string
          phone: string | null
          recipient_name: string
          sender_name: string | null
          views_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          custom_message?: string | null
          date_of_birth?: string | null
          email?: string | null
          expires_at?: string
          greeting_type: Database["public"]["Enums"]["greeting_type"]
          id?: string
          phone?: string | null
          recipient_name: string
          sender_name?: string | null
          views_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          custom_message?: string | null
          date_of_birth?: string | null
          email?: string | null
          expires_at?: string
          greeting_type?: Database["public"]["Enums"]["greeting_type"]
          id?: string
          phone?: string | null
          recipient_name?: string
          sender_name?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      images: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          caption: string | null
          created_at: string
          description: string | null
          file_path: string | null
          id: string
          is_approved: boolean | null
          is_public: boolean
          repost_of: string | null
          share_count: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          caption?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_approved?: boolean | null
          is_public?: boolean
          repost_of?: string | null
          share_count?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          caption?: string | null
          created_at?: string
          description?: string | null
          file_path?: string | null
          id?: string
          is_approved?: boolean | null
          is_public?: boolean
          repost_of?: string | null
          share_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "images_repost_of_fkey"
            columns: ["repost_of"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      leetcode_monthly_progress: {
        Row: {
          created_at: string | null
          id: string
          month: number
          solved: number | null
          username: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          month: number
          solved?: number | null
          username: string
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          month?: number
          solved?: number | null
          username?: string
          year?: number
        }
        Relationships: []
      }
      leetcode_stats: {
        Row: {
          acceptance_rate: number | null
          contest_rating: number | null
          created_at: string | null
          easy_solved: number | null
          hard_solved: number | null
          id: string
          medium_solved: number | null
          ranking: number | null
          streak: number | null
          total_solved: number | null
          updated_at: string | null
          username: string
        }
        Insert: {
          acceptance_rate?: number | null
          contest_rating?: number | null
          created_at?: string | null
          easy_solved?: number | null
          hard_solved?: number | null
          id?: string
          medium_solved?: number | null
          ranking?: number | null
          streak?: number | null
          total_solved?: number | null
          updated_at?: string | null
          username: string
        }
        Update: {
          acceptance_rate?: number | null
          contest_rating?: number | null
          created_at?: string | null
          easy_solved?: number | null
          hard_solved?: number | null
          id?: string
          medium_solved?: number | null
          ranking?: number | null
          streak?: number | null
          total_solved?: number | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      leetcode_submissions: {
        Row: {
          created_at: string | null
          difficulty: string
          id: string
          status: string
          submitted_at: string | null
          title: string
          username: string
        }
        Insert: {
          created_at?: string | null
          difficulty: string
          id?: string
          status: string
          submitted_at?: string | null
          title: string
          username: string
        }
        Update: {
          created_at?: string | null
          difficulty?: string
          id?: string
          status?: string
          submitted_at?: string | null
          title?: string
          username?: string
        }
        Relationships: []
      }
      leetcode_topic_progress: {
        Row: {
          created_at: string | null
          id: string
          solved: number | null
          topic: string
          total: number | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          solved?: number | null
          topic: string
          total?: number | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          solved?: number | null
          topic?: string
          total?: number | null
          username?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          image_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      otp_rate_limits: {
        Row: {
          attempts: number
          created_at: string
          email: string
          id: string
          last_attempt: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          email: string
          id?: string
          last_attempt?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          email?: string
          id?: string
          last_attempt?: string
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          id: string
          option_text: string
          poll_id: string
          vote_count: number | null
        }
        Insert: {
          id?: string
          option_text: string
          poll_id: string
          vote_count?: number | null
        }
        Update: {
          id?: string
          option_text?: string
          poll_id?: string
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          id: string
          option_id: string
          poll_id: string
          user_id: string | null
          voted_at: string | null
        }
        Insert: {
          id?: string
          option_id: string
          poll_id: string
          user_id?: string | null
          voted_at?: string | null
        }
        Update: {
          id?: string
          option_id?: string
          poll_id?: string
          user_id?: string | null
          voted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          is_public: boolean | null
          question: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          is_public?: boolean | null
          question: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          is_public?: boolean | null
          question?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_about: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          education: string | null
          id: string
          location: string | null
          name: string
          resume_url: string | null
          tagline: string | null
          university: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education?: string | null
          id?: string
          location?: string | null
          name: string
          resume_url?: string | null
          tagline?: string | null
          university?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education?: string | null
          id?: string
          location?: string | null
          name?: string
          resume_url?: string | null
          tagline?: string | null
          university?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_achievements: {
        Row: {
          badge_text: string | null
          created_at: string | null
          date_achieved: string | null
          description: string | null
          details: Json | null
          display_order: number | null
          id: string
          title: string
        }
        Insert: {
          badge_text?: string | null
          created_at?: string | null
          date_achieved?: string | null
          description?: string | null
          details?: Json | null
          display_order?: number | null
          id?: string
          title: string
        }
        Update: {
          badge_text?: string | null
          created_at?: string | null
          date_achieved?: string | null
          description?: string | null
          details?: Json | null
          display_order?: number | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      portfolio_applications: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          features: string[] | null
          icon_name: string | null
          id: string
          live_url: string | null
          tech_stack: string[] | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          icon_name?: string | null
          id?: string
          live_url?: string | null
          tech_stack?: string[] | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          icon_name?: string | null
          id?: string
          live_url?: string | null
          tech_stack?: string[] | null
          title?: string
        }
        Relationships: []
      }
      portfolio_certifications: {
        Row: {
          badge_url: string | null
          created_at: string | null
          credential_url: string | null
          display_order: number | null
          id: string
          issue_date: string | null
          issuer: string | null
          title: string
        }
        Insert: {
          badge_url?: string | null
          created_at?: string | null
          credential_url?: string | null
          display_order?: number | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          title: string
        }
        Update: {
          badge_url?: string | null
          created_at?: string | null
          credential_url?: string | null
          display_order?: number | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          title?: string
        }
        Relationships: []
      }
      portfolio_contact: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      portfolio_education_marks: {
        Row: {
          board: string | null
          created_at: string | null
          education_type: string
          id: string
          overall_grade: string | null
          overall_percentage: number | null
          passing_year: string | null
          school_name: string | null
          stream: string | null
          updated_at: string | null
        }
        Insert: {
          board?: string | null
          created_at?: string | null
          education_type: string
          id?: string
          overall_grade?: string | null
          overall_percentage?: number | null
          passing_year?: string | null
          school_name?: string | null
          stream?: string | null
          updated_at?: string | null
        }
        Update: {
          board?: string | null
          created_at?: string | null
          education_type?: string
          id?: string
          overall_grade?: string | null
          overall_percentage?: number | null
          passing_year?: string | null
          school_name?: string | null
          stream?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_experience: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          organization: string
          start_date: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          organization: string
          start_date?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          organization?: string
          start_date?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category: string | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          display_order: number | null
          github_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          tech_stack: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_publications: {
        Row: {
          abstract: string | null
          authors: string[] | null
          created_at: string | null
          display_order: number | null
          doi_url: string | null
          id: string
          pdf_url: string | null
          publication_date: string | null
          publication_venue: string | null
          status: string | null
          title: string
        }
        Insert: {
          abstract?: string | null
          authors?: string[] | null
          created_at?: string | null
          display_order?: number | null
          doi_url?: string | null
          id?: string
          pdf_url?: string | null
          publication_date?: string | null
          publication_venue?: string | null
          status?: string | null
          title: string
        }
        Update: {
          abstract?: string | null
          authors?: string[] | null
          created_at?: string | null
          display_order?: number | null
          doi_url?: string | null
          id?: string
          pdf_url?: string | null
          publication_date?: string | null
          publication_venue?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      portfolio_semester_grades: {
        Row: {
          cgpa: number
          created_at: string | null
          display_order: number | null
          id: string
          semester: number
          sgpa: number
          status: string | null
          year: string | null
        }
        Insert: {
          cgpa: number
          created_at?: string | null
          display_order?: number | null
          id?: string
          semester: number
          sgpa: number
          status?: string | null
          year?: string | null
        }
        Update: {
          cgpa?: number
          created_at?: string | null
          display_order?: number | null
          id?: string
          semester?: number
          sgpa?: number
          status?: string | null
          year?: string | null
        }
        Relationships: []
      }
      portfolio_skills: {
        Row: {
          category: string
          created_at: string | null
          display_order: number | null
          id: string
          proficiency: number | null
          skill_name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          proficiency?: number | null
          skill_name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          proficiency?: number | null
          skill_name?: string
        }
        Relationships: []
      }
      portfolio_social_links: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          platform: string
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          url?: string
        }
        Relationships: []
      }
      portfolio_soft_skills: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          skill_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          skill_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          skill_name?: string
        }
        Relationships: []
      }
      portfolio_subject_marks: {
        Row: {
          created_at: string | null
          display_order: number | null
          education_marks_id: string | null
          grade: string | null
          id: string
          max_marks: number | null
          obtained_marks: number | null
          subject_name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          education_marks_id?: string | null
          grade?: string | null
          id?: string
          max_marks?: number | null
          obtained_marks?: number | null
          subject_name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          education_marks_id?: string | null
          grade?: string | null
          id?: string
          max_marks?: number | null
          obtained_marks?: number | null
          subject_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_subject_marks_education_marks_id_fkey"
            columns: ["education_marks_id"]
            isOneToOne: false
            referencedRelation: "portfolio_education_marks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          followers_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          caption: string | null
          created_at: string | null
          expires_at: string
          file_path: string
          id: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          expires_at?: string
          file_path: string
          id?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          expires_at?: string
          file_path?: string
          id?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: []
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          viewed_at: string | null
          viewer_id: string
        }
        Insert: {
          id?: string
          story_id: string
          viewed_at?: string | null
          viewer_id: string
        }
        Update: {
          id?: string
          story_id?: string
          viewed_at?: string | null
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_views_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      greeting_type:
        | "birthday"
        | "new_year"
        | "anniversary"
        | "congratulations"
        | "thank_you"
        | "happiness"
        | "get_well"
        | "wedding"
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
    Enums: {
      app_role: ["admin", "user"],
      greeting_type: [
        "birthday",
        "new_year",
        "anniversary",
        "congratulations",
        "thank_you",
        "happiness",
        "get_well",
        "wedding",
      ],
    },
  },
} as const
