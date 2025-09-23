export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      licitaciones: {
        Row: {
          id: string
          contract_folder_id: string
          contract_folder_status_code: string | null
          project_name: string
          contracting_party_name: string | null
          cpv_code: string | null
          cpv_description: string | null
          nuts_code: string | null
          territory_name: string | null
          importe: number | null
          fecha_fin_presentacion: string | null
          hora_fin_presentacion: string | null
          anuncio_link: string | null
          created_at: string
          updated_at: string
          ingested_at: string
        }
        Insert: {
          id?: string
          contract_folder_id: string
          contract_folder_status_code?: string | null
          project_name: string
          contracting_party_name?: string | null
          cpv_code?: string | null
          cpv_description?: string | null
          nuts_code?: string | null
          territory_name?: string | null
          importe?: number | null
          fecha_fin_presentacion?: string | null
          hora_fin_presentacion?: string | null
          anuncio_link?: string | null
          created_at?: string
          updated_at?: string
          ingested_at?: string
        }
        Update: {
          id?: string
          contract_folder_id?: string
          contract_folder_status_code?: string | null
          project_name?: string
          contracting_party_name?: string | null
          cpv_code?: string | null
          cpv_description?: string | null
          nuts_code?: string | null
          territory_name?: string | null
          importe?: number | null
          fecha_fin_presentacion?: string | null
          hora_fin_presentacion?: string | null
          anuncio_link?: string | null
          created_at?: string
          updated_at?: string
          ingested_at?: string
        }
      }
      documentos: {
        Row: {
          id: string
          licitacion_id: string | null
          document_name: string
          document_uri: string
          document_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          licitacion_id?: string | null
          document_name: string
          document_uri: string
          document_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          licitacion_id?: string | null
          document_name?: string
          document_uri?: string
          document_id?: string | null
          created_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          title: string
          description: string
          client_name: string
          amount: number
          status: 'draft' | 'active' | 'completed' | 'cancelled'
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          client_name: string
          amount: number
          status?: 'draft' | 'active' | 'completed' | 'cancelled'
          start_date: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          client_name?: string
          amount?: number
          status?: 'draft' | 'active' | 'completed' | 'cancelled'
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          status: 'planning' | 'in_progress' | 'completed' | 'on_hold'
          budget: number
          deadline: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          status?: 'planning' | 'in_progress' | 'completed' | 'on_hold'
          budget: number
          deadline?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          status?: 'planning' | 'in_progress' | 'completed' | 'on_hold'
          budget?: number
          deadline?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          type: 'contract' | 'invoice' | 'proposal' | 'report' | 'other'
          file_path: string | null
          size: number
          uploaded_at: string
          contract_id: string | null
          project_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          type: 'contract' | 'invoice' | 'proposal' | 'report' | 'other'
          file_path?: string | null
          size: number
          uploaded_at?: string
          contract_id?: string | null
          project_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'contract' | 'invoice' | 'proposal' | 'report' | 'other'
          file_path?: string | null
          size?: number
          uploaded_at?: string
          contract_id?: string | null
          project_id?: string | null
          user_id?: string
        }
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