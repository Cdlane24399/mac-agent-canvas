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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      collection_collaborators: {
        Row: {
          accepted_at: string | null
          can_add_images: boolean | null
          can_edit_metadata: boolean | null
          can_invite_others: boolean | null
          can_remove_images: boolean | null
          collection_id: string | null
          id: string
          invited_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          can_add_images?: boolean | null
          can_edit_metadata?: boolean | null
          can_invite_others?: boolean | null
          can_remove_images?: boolean | null
          collection_id?: string | null
          id?: string
          invited_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          can_add_images?: boolean | null
          can_edit_metadata?: boolean | null
          can_invite_others?: boolean | null
          can_remove_images?: boolean | null
          collection_id?: string | null
          id?: string
          invited_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_collaborators_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "image_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      image_collection_items: {
        Row: {
          added_at: string | null
          added_by_user_id: string | null
          collection_id: string | null
          custom_caption: string | null
          custom_tags: string[] | null
          id: string
          image_id: string | null
          position_in_collection: number | null
        }
        Insert: {
          added_at?: string | null
          added_by_user_id?: string | null
          collection_id?: string | null
          custom_caption?: string | null
          custom_tags?: string[] | null
          id?: string
          image_id?: string | null
          position_in_collection?: number | null
        }
        Update: {
          added_at?: string | null
          added_by_user_id?: string | null
          collection_id?: string | null
          custom_caption?: string | null
          custom_tags?: string[] | null
          id?: string
          image_id?: string | null
          position_in_collection?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "image_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "image_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_collection_items_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      image_collections: {
        Row: {
          citation_text: string | null
          collaborator_count: number | null
          collection_type: string | null
          color_theme: string | null
          created_at: string | null
          dataset_format: string | null
          description: string | null
          id: string
          image_count: number | null
          is_collaborative: boolean | null
          is_public: boolean | null
          license_type: string | null
          license_url: string | null
          name: string
          tags: string[] | null
          thumbnail_image_id: string | null
          total_downloads: number | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          citation_text?: string | null
          collaborator_count?: number | null
          collection_type?: string | null
          color_theme?: string | null
          created_at?: string | null
          dataset_format?: string | null
          description?: string | null
          id?: string
          image_count?: number | null
          is_collaborative?: boolean | null
          is_public?: boolean | null
          license_type?: string | null
          license_url?: string | null
          name: string
          tags?: string[] | null
          thumbnail_image_id?: string | null
          total_downloads?: number | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          citation_text?: string | null
          collaborator_count?: number | null
          collection_type?: string | null
          color_theme?: string | null
          created_at?: string | null
          dataset_format?: string | null
          description?: string | null
          id?: string
          image_count?: number | null
          is_collaborative?: boolean | null
          is_public?: boolean | null
          license_type?: string | null
          license_url?: string | null
          name?: string
          tags?: string[] | null
          thumbnail_image_id?: string | null
          total_downloads?: number | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      image_embeddings: {
        Row: {
          average_similarity_score: number | null
          confidence_score: number | null
          created_at: string | null
          embedding: string | null
          embedding_type: string
          id: string
          image_id: string | null
          last_used_at: string | null
          model_name: string
          model_version: string | null
          processing_time_ms: number | null
          similarity_search_count: number | null
          source_text: string | null
          updated_at: string | null
        }
        Insert: {
          average_similarity_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          embedding?: string | null
          embedding_type: string
          id?: string
          image_id?: string | null
          last_used_at?: string | null
          model_name: string
          model_version?: string | null
          processing_time_ms?: number | null
          similarity_search_count?: number | null
          source_text?: string | null
          updated_at?: string | null
        }
        Update: {
          average_similarity_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          embedding?: string | null
          embedding_type?: string
          id?: string
          image_id?: string | null
          last_used_at?: string | null
          model_name?: string
          model_version?: string | null
          processing_time_ms?: number | null
          similarity_search_count?: number | null
          source_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "image_embeddings_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      image_tags: {
        Row: {
          ai_model_name: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          image_id: string | null
          language_code: string | null
          parent_tag_id: string | null
          tag_category: string | null
          tag_level: number | null
          tag_name: string
          tag_source: string | null
          tag_type: string | null
          user_verified: boolean | null
          verified_at: string | null
          verified_by_user_id: string | null
        }
        Insert: {
          ai_model_name?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          image_id?: string | null
          language_code?: string | null
          parent_tag_id?: string | null
          tag_category?: string | null
          tag_level?: number | null
          tag_name: string
          tag_source?: string | null
          tag_type?: string | null
          user_verified?: boolean | null
          verified_at?: string | null
          verified_by_user_id?: string | null
        }
        Update: {
          ai_model_name?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          image_id?: string | null
          language_code?: string | null
          parent_tag_id?: string | null
          tag_category?: string | null
          tag_level?: number | null
          tag_name?: string
          tag_source?: string | null
          tag_type?: string | null
          user_verified?: boolean | null
          verified_at?: string | null
          verified_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "image_tags_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_tags_parent_tag_id_fkey"
            columns: ["parent_tag_id"]
            isOneToOne: false
            referencedRelation: "image_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          ai_analysis: string | null
          alt_text: string | null
          created_at: string | null
          description: string | null
          dominant_colors: Json | null
          download_count: number | null
          file_size: number | null
          file_type: string | null
          height: number | null
          id: string
          is_accessible: boolean | null
          is_validated: boolean | null
          last_validated_at: string | null
          original_url: string | null
          quality_score: number | null
          relevance_score: number | null
          search_query: string
          social_metrics: Json | null
          source_metadata: Json | null
          source_quality_score: number | null
          source_type: Database["public"]["Enums"]["image_source_type"] | null
          source_website: string | null
          title: string | null
          updated_at: string | null
          url: string
          user_id: string | null
          user_rating: number | null
          user_verified: boolean | null
          validation_error: string | null
          view_count: number | null
          width: number | null
        }
        Insert: {
          ai_analysis?: string | null
          alt_text?: string | null
          created_at?: string | null
          description?: string | null
          dominant_colors?: Json | null
          download_count?: number | null
          file_size?: number | null
          file_type?: string | null
          height?: number | null
          id?: string
          is_accessible?: boolean | null
          is_validated?: boolean | null
          last_validated_at?: string | null
          original_url?: string | null
          quality_score?: number | null
          relevance_score?: number | null
          search_query: string
          social_metrics?: Json | null
          source_metadata?: Json | null
          source_quality_score?: number | null
          source_type?: Database["public"]["Enums"]["image_source_type"] | null
          source_website?: string | null
          title?: string | null
          updated_at?: string | null
          url: string
          user_id?: string | null
          user_rating?: number | null
          user_verified?: boolean | null
          validation_error?: string | null
          view_count?: number | null
          width?: number | null
        }
        Update: {
          ai_analysis?: string | null
          alt_text?: string | null
          created_at?: string | null
          description?: string | null
          dominant_colors?: Json | null
          download_count?: number | null
          file_size?: number | null
          file_type?: string | null
          height?: number | null
          id?: string
          is_accessible?: boolean | null
          is_validated?: boolean | null
          last_validated_at?: string | null
          original_url?: string | null
          quality_score?: number | null
          relevance_score?: number | null
          search_query?: string
          social_metrics?: Json | null
          source_metadata?: Json | null
          source_quality_score?: number | null
          source_type?: Database["public"]["Enums"]["image_source_type"] | null
          source_website?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string
          user_id?: string | null
          user_rating?: number | null
          user_verified?: boolean | null
          validation_error?: string | null
          view_count?: number | null
          width?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
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
      multi_source_results: {
        Row: {
          created_at: string | null
          duplicate_images_removed: number | null
          google_results_count: number | null
          id: string
          overall_relevance_score: number | null
          search_session_id: string | null
          search_strategy: string | null
          semantic_results_count: number | null
          source_diversity_score: number | null
          successful_sources: string[] | null
          total_sources_attempted: number | null
          total_unique_images: number | null
          user_satisfaction_predicted: number | null
          x_results_count: number | null
        }
        Insert: {
          created_at?: string | null
          duplicate_images_removed?: number | null
          google_results_count?: number | null
          id?: string
          overall_relevance_score?: number | null
          search_session_id?: string | null
          search_strategy?: string | null
          semantic_results_count?: number | null
          source_diversity_score?: number | null
          successful_sources?: string[] | null
          total_sources_attempted?: number | null
          total_unique_images?: number | null
          user_satisfaction_predicted?: number | null
          x_results_count?: number | null
        }
        Update: {
          created_at?: string | null
          duplicate_images_removed?: number | null
          google_results_count?: number | null
          id?: string
          overall_relevance_score?: number | null
          search_session_id?: string | null
          search_strategy?: string | null
          semantic_results_count?: number | null
          source_diversity_score?: number | null
          successful_sources?: string[] | null
          total_sources_attempted?: number | null
          total_unique_images?: number | null
          user_satisfaction_predicted?: number | null
          x_results_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "multi_source_results_search_session_id_fkey"
            columns: ["search_session_id"]
            isOneToOne: false
            referencedRelation: "search_sessions"
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
      search_analytics: {
        Row: {
          ai_enhancement_effective: boolean | null
          analyzed_at: string | null
          api_errors_count: number | null
          api_response_time_ms: number | null
          bounce_rate: number | null
          cache_hit_rate: number | null
          id: string
          keyword_match_score: number | null
          processing_time_ms: number | null
          query_complexity: number | null
          query_intent: string | null
          query_text: string
          query_tokens: string[] | null
          results_clicked: number | null
          results_downloaded: number | null
          search_day_of_week: number | null
          search_hour: number | null
          search_session_id: string | null
          semantic_match_score: number | null
          timeout_count: number | null
          total_search_time_ms: number | null
          user_dwell_time_seconds: number | null
          user_timezone: string | null
          validation_failures: number | null
        }
        Insert: {
          ai_enhancement_effective?: boolean | null
          analyzed_at?: string | null
          api_errors_count?: number | null
          api_response_time_ms?: number | null
          bounce_rate?: number | null
          cache_hit_rate?: number | null
          id?: string
          keyword_match_score?: number | null
          processing_time_ms?: number | null
          query_complexity?: number | null
          query_intent?: string | null
          query_text: string
          query_tokens?: string[] | null
          results_clicked?: number | null
          results_downloaded?: number | null
          search_day_of_week?: number | null
          search_hour?: number | null
          search_session_id?: string | null
          semantic_match_score?: number | null
          timeout_count?: number | null
          total_search_time_ms?: number | null
          user_dwell_time_seconds?: number | null
          user_timezone?: string | null
          validation_failures?: number | null
        }
        Update: {
          ai_enhancement_effective?: boolean | null
          analyzed_at?: string | null
          api_errors_count?: number | null
          api_response_time_ms?: number | null
          bounce_rate?: number | null
          cache_hit_rate?: number | null
          id?: string
          keyword_match_score?: number | null
          processing_time_ms?: number | null
          query_complexity?: number | null
          query_intent?: string | null
          query_text?: string
          query_tokens?: string[] | null
          results_clicked?: number | null
          results_downloaded?: number | null
          search_day_of_week?: number | null
          search_hour?: number | null
          search_session_id?: string | null
          semantic_match_score?: number | null
          timeout_count?: number | null
          total_search_time_ms?: number | null
          user_dwell_time_seconds?: number | null
          user_timezone?: string | null
          validation_failures?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "search_analytics_search_session_id_fkey"
            columns: ["search_session_id"]
            isOneToOne: false
            referencedRelation: "search_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      search_sessions: {
        Row: {
          api_calls_made: number | null
          api_cost_estimate: number | null
          completed_at: string | null
          enhanced_query: string | null
          error_details: Json | null
          errors_encountered: number | null
          google_api_calls: number | null
          id: string
          image_count_requested: number | null
          images_downloaded: number | null
          images_rejected: number | null
          images_verified: number | null
          images_viewed: number | null
          ip_address: unknown | null
          last_activity_at: string | null
          original_query: string
          referrer: string | null
          refinement_count: number | null
          results_displayed: number | null
          results_returned: number | null
          search_abandoned: boolean | null
          search_duration_ms: number | null
          search_filters: Json | null
          search_type: string | null
          semantic_searches: number | null
          session_duration_seconds: number | null
          session_id: string | null
          source_performance: Json | null
          sources_used: string[] | null
          started_at: string | null
          total_results_found: number | null
          user_agent: string | null
          user_id: string | null
          user_satisfaction_rating: number | null
          x_api_calls: number | null
        }
        Insert: {
          api_calls_made?: number | null
          api_cost_estimate?: number | null
          completed_at?: string | null
          enhanced_query?: string | null
          error_details?: Json | null
          errors_encountered?: number | null
          google_api_calls?: number | null
          id?: string
          image_count_requested?: number | null
          images_downloaded?: number | null
          images_rejected?: number | null
          images_verified?: number | null
          images_viewed?: number | null
          ip_address?: unknown | null
          last_activity_at?: string | null
          original_query: string
          referrer?: string | null
          refinement_count?: number | null
          results_displayed?: number | null
          results_returned?: number | null
          search_abandoned?: boolean | null
          search_duration_ms?: number | null
          search_filters?: Json | null
          search_type?: string | null
          semantic_searches?: number | null
          session_duration_seconds?: number | null
          session_id?: string | null
          source_performance?: Json | null
          sources_used?: string[] | null
          started_at?: string | null
          total_results_found?: number | null
          user_agent?: string | null
          user_id?: string | null
          user_satisfaction_rating?: number | null
          x_api_calls?: number | null
        }
        Update: {
          api_calls_made?: number | null
          api_cost_estimate?: number | null
          completed_at?: string | null
          enhanced_query?: string | null
          error_details?: Json | null
          errors_encountered?: number | null
          google_api_calls?: number | null
          id?: string
          image_count_requested?: number | null
          images_downloaded?: number | null
          images_rejected?: number | null
          images_verified?: number | null
          images_viewed?: number | null
          ip_address?: unknown | null
          last_activity_at?: string | null
          original_query?: string
          referrer?: string | null
          refinement_count?: number | null
          results_displayed?: number | null
          results_returned?: number | null
          search_abandoned?: boolean | null
          search_duration_ms?: number | null
          search_filters?: Json | null
          search_type?: string | null
          semantic_searches?: number | null
          session_duration_seconds?: number | null
          session_id?: string | null
          source_performance?: Json | null
          sources_used?: string[] | null
          started_at?: string | null
          total_results_found?: number | null
          user_agent?: string | null
          user_id?: string | null
          user_satisfaction_rating?: number | null
          x_api_calls?: number | null
        }
        Relationships: []
      }
      source_performance: {
        Row: {
          api_cost_estimate: number | null
          avg_image_quality: number | null
          error_details: Json | null
          errors_encountered: number | null
          executed_at: string | null
          id: string
          query_suitability_score: number | null
          query_text: string
          rate_limit_hit: boolean | null
          response_time_ms: number | null
          results_found: number | null
          results_used: number | null
          search_session_id: string | null
          source_type: Database["public"]["Enums"]["image_source_type"]
          user_engagement_score: number | null
        }
        Insert: {
          api_cost_estimate?: number | null
          avg_image_quality?: number | null
          error_details?: Json | null
          errors_encountered?: number | null
          executed_at?: string | null
          id?: string
          query_suitability_score?: number | null
          query_text: string
          rate_limit_hit?: boolean | null
          response_time_ms?: number | null
          results_found?: number | null
          results_used?: number | null
          search_session_id?: string | null
          source_type: Database["public"]["Enums"]["image_source_type"]
          user_engagement_score?: number | null
        }
        Update: {
          api_cost_estimate?: number | null
          avg_image_quality?: number | null
          error_details?: Json | null
          errors_encountered?: number | null
          executed_at?: string | null
          id?: string
          query_suitability_score?: number | null
          query_text?: string
          rate_limit_hit?: boolean | null
          response_time_ms?: number | null
          results_found?: number | null
          results_used?: number | null
          search_session_id?: string | null
          source_type?: Database["public"]["Enums"]["image_source_type"]
          user_engagement_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "source_performance_search_session_id_fkey"
            columns: ["search_session_id"]
            isOneToOne: false
            referencedRelation: "search_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tag_definitions: {
        Row: {
          average_confidence: number | null
          child_tags: string[] | null
          created_at: string | null
          description: string | null
          id: string
          last_used_at: string | null
          parent_category: string | null
          synonyms: string[] | null
          tag_category: string | null
          tag_name: string
          updated_at: string | null
          usage_count: number | null
          user_approval_rate: number | null
        }
        Insert: {
          average_confidence?: number | null
          child_tags?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          last_used_at?: string | null
          parent_category?: string | null
          synonyms?: string[] | null
          tag_category?: string | null
          tag_name: string
          updated_at?: string | null
          usage_count?: number | null
          user_approval_rate?: number | null
        }
        Update: {
          average_confidence?: number | null
          child_tags?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          last_used_at?: string | null
          parent_category?: string | null
          synonyms?: string[] | null
          tag_category?: string | null
          tag_name?: string
          updated_at?: string | null
          usage_count?: number | null
          user_approval_rate?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      find_similar_images: {
        Args: {
          match_count?: number
          match_threshold?: number
          source_image_id: string
        }
        Returns: {
          embedding_type: string
          id: string
          similarity: number
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      record_source_performance: {
        Args: {
          p_api_cost?: number
          p_avg_quality?: number
          p_query_text: string
          p_response_time_ms: number
          p_results_found: number
          p_results_used: number
          p_search_session_id: string
          p_source_type: Database["public"]["Enums"]["image_source_type"]
          p_suitability_score?: number
        }
        Returns: string
      }
      search_images_by_embedding: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          id: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      store_image_embedding: {
        Args: {
          p_confidence_score?: number
          p_embedding: string
          p_embedding_type: string
          p_image_id: string
          p_model_name: string
          p_source_text?: string
        }
        Returns: boolean
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      image_source_type:
        | "google_images"
        | "x_twitter"
        | "semantic_search"
        | "demo"
        | "manual"
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
      image_source_type: [
        "google_images",
        "x_twitter",
        "semantic_search",
        "demo",
        "manual",
      ],
    },
  },
} as const
