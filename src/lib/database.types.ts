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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          assistant_type: string
          created_at: string
          id: string
          interface_locale: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assistant_type?: string
          created_at?: string
          id?: string
          interface_locale?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assistant_type?: string
          created_at?: string
          id?: string
          interface_locale?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_preferences: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          proficiency_level: string | null
          source_locale: string
          target_locale: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          proficiency_level?: string | null
          source_locale?: string
          target_locale: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          proficiency_level?: string | null
          source_locale?: string
          target_locale?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          arabic_translation: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          source_locale: string | null
          user_id: string
        }
        Insert: {
          arabic_translation?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          source_locale?: string | null
          user_id: string
        }
        Update: {
          arabic_translation?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          source_locale?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_consent_events: {
        Row: {
          consent_type: string
          consent_version: string
          created_at: string
          decision: string
          id: string
          notice_snapshot: Json
          user_id: string
        }
        Insert: {
          consent_type: string
          consent_version: string
          created_at?: string
          decision: string
          id?: string
          notice_snapshot?: Json
          user_id: string
        }
        Update: {
          consent_type?: string
          consent_version?: string
          created_at?: string
          decision?: string
          id?: string
          notice_snapshot?: Json
          user_id?: string
        }
        Relationships: []
      }
      privacy_settings: {
        Row: {
          model_improvement_opt_in: boolean
          updated_at: string
          user_id: string
          wellbeing_review_opt_in: boolean
        }
        Insert: {
          model_improvement_opt_in?: boolean
          updated_at?: string
          user_id: string
          wellbeing_review_opt_in?: boolean
        }
        Update: {
          model_improvement_opt_in?: boolean
          updated_at?: string
          user_id?: string
          wellbeing_review_opt_in?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quality_feedback: {
        Row: {
          category: string
          created_at: string
          description: string
          explicit_content_share: boolean
          id: string
          shared_excerpt: string | null
          status: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          explicit_content_share?: boolean
          id?: string
          shared_excerpt?: string | null
          status?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          explicit_content_share?: boolean
          id?: string
          shared_excerpt?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          arabic_translation_mode: string
          created_at: string
          interface_locale: string
          learning_languages: string[]
          reduced_motion: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          arabic_translation_mode?: string
          created_at?: string
          interface_locale?: string
          learning_languages?: string[]
          reduced_motion?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          arabic_translation_mode?: string
          created_at?: string
          interface_locale?: string
          learning_languages?: string[]
          reduced_motion?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wellbeing_preferences: {
        Row: {
          created_at: string
          enabled: boolean
          preferred_language: string
          privacy_acknowledged_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          preferred_language?: string
          privacy_acknowledged_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          preferred_language?: string
          privacy_acknowledged_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wellbeing_review_requests: {
        Row: {
          consent_version: string
          created_at: string
          id: string
          reason: string
          separate_explicit_consent: boolean
          shared_excerpt: string
          status: string
          user_id: string
        }
        Insert: {
          consent_version: string
          created_at?: string
          id?: string
          reason: string
          separate_explicit_consent?: boolean
          shared_excerpt: string
          status?: string
          user_id: string
        }
        Update: {
          consent_version?: string
          created_at?: string
          id?: string
          reason?: string
          separate_explicit_consent?: boolean
          shared_excerpt?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
