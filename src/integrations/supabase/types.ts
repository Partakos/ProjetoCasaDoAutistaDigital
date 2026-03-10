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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_progress: {
        Row: {
          activity_name: string
          activity_type: string
          child_id: string
          completed: boolean | null
          created_at: string
          duration_seconds: number | null
          id: string
          metadata: Json | null
          score: number | null
        }
        Insert: {
          activity_name: string
          activity_type: string
          child_id: string
          completed?: boolean | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          score?: number | null
        }
        Update: {
          activity_name?: string
          activity_type?: string
          child_id?: string
          completed?: boolean | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          age: number | null
          birth_date: string | null
          created_at: string
          diagnosis: string | null
          id: string
          name: string
          notes: string | null
          responsible_id: string
          school: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          birth_date?: string | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          name: string
          notes?: string | null
          responsible_id: string
          school?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          birth_date?: string | null
          created_at?: string
          diagnosis?: string | null
          id?: string
          name?: string
          notes?: string | null
          responsible_id?: string
          school?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_date: string
          id: string
          location: string | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          title?: string
        }
        Relationships: []
      }
      family_reports: {
        Row: {
          allows_haircut: boolean | null
          child_id: string
          created_at: string
          created_by: string
          dresses_alone: boolean | null
          eats_alone: boolean | null
          follows_complex_instructions: boolean | null
          follows_simple_instructions: boolean | null
          id: string
          interacts_with_children: boolean | null
          maintains_eye_contact: string | null
          notes: string | null
          prefers_playing_alone: boolean | null
          recognizes_colors: boolean | null
          recognizes_numbers: boolean | null
          responds_when_called: string | null
          sensitive_to_loud_sounds: boolean | null
          sensitive_to_touch: boolean | null
          shows_empathy: boolean | null
          speaks_full_sentences: string | null
          texture_difficulty: boolean | null
          uses_alternative_communication: boolean | null
          uses_bathroom_alone: boolean | null
        }
        Insert: {
          allows_haircut?: boolean | null
          child_id: string
          created_at?: string
          created_by: string
          dresses_alone?: boolean | null
          eats_alone?: boolean | null
          follows_complex_instructions?: boolean | null
          follows_simple_instructions?: boolean | null
          id?: string
          interacts_with_children?: boolean | null
          maintains_eye_contact?: string | null
          notes?: string | null
          prefers_playing_alone?: boolean | null
          recognizes_colors?: boolean | null
          recognizes_numbers?: boolean | null
          responds_when_called?: string | null
          sensitive_to_loud_sounds?: boolean | null
          sensitive_to_touch?: boolean | null
          shows_empathy?: boolean | null
          speaks_full_sentences?: string | null
          texture_difficulty?: boolean | null
          uses_alternative_communication?: boolean | null
          uses_bathroom_alone?: boolean | null
        }
        Update: {
          allows_haircut?: boolean | null
          child_id?: string
          created_at?: string
          created_by?: string
          dresses_alone?: boolean | null
          eats_alone?: boolean | null
          follows_complex_instructions?: boolean | null
          follows_simple_instructions?: boolean | null
          id?: string
          interacts_with_children?: boolean | null
          maintains_eye_contact?: string | null
          notes?: string | null
          prefers_playing_alone?: boolean | null
          recognizes_colors?: boolean | null
          recognizes_numbers?: boolean | null
          responds_when_called?: string | null
          sensitive_to_loud_sounds?: boolean | null
          sensitive_to_touch?: boolean | null
          shows_empathy?: boolean | null
          speaks_full_sentences?: string | null
          texture_difficulty?: boolean | null
          uses_alternative_communication?: boolean | null
          uses_bathroom_alone?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "family_reports_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          approved: boolean | null
          author: string | null
          created_at: string
          description: string | null
          id: string
          suggested_by: string | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          approved?: boolean | null
          author?: string | null
          created_at?: string
          description?: string | null
          id?: string
          suggested_by?: string | null
          title: string
          type: string
          url?: string | null
        }
        Update: {
          approved?: boolean | null
          author?: string | null
          created_at?: string
          description?: string | null
          id?: string
          suggested_by?: string | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          child_id: string | null
          content: string
          created_at: string
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          child_id?: string | null
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          child_id?: string | null
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_reports: {
        Row: {
          attention_score: number | null
          child_id: string
          created_at: string
          created_by: string
          crisis_frequency: string | null
          focus_duration_minutes: number | null
          id: string
          literacy_level: string | null
          math_level: string | null
          motor_coordination: string | null
          notes: string | null
          participation_score: number | null
          quarterly_goals: string | null
          recommended_interventions: string | null
          responds_to_commands: string | null
          trigger_stimuli: string | null
          working_strategies: string | null
        }
        Insert: {
          attention_score?: number | null
          child_id: string
          created_at?: string
          created_by: string
          crisis_frequency?: string | null
          focus_duration_minutes?: number | null
          id?: string
          literacy_level?: string | null
          math_level?: string | null
          motor_coordination?: string | null
          notes?: string | null
          participation_score?: number | null
          quarterly_goals?: string | null
          recommended_interventions?: string | null
          responds_to_commands?: string | null
          trigger_stimuli?: string | null
          working_strategies?: string | null
        }
        Update: {
          attention_score?: number | null
          child_id?: string
          created_at?: string
          created_by?: string
          crisis_frequency?: string | null
          focus_duration_minutes?: number | null
          id?: string
          literacy_level?: string | null
          math_level?: string | null
          motor_coordination?: string | null
          notes?: string | null
          participation_score?: number | null
          quarterly_goals?: string | null
          recommended_interventions?: string | null
          responds_to_commands?: string | null
          trigger_stimuli?: string | null
          working_strategies?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_reports_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "responsavel" | "profissional"
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
      app_role: ["admin", "responsavel", "profissional"],
    },
  },
} as const
