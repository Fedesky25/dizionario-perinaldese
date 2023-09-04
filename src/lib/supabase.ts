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
      collegamenti: {
        Row: {
          parola1: number
          parola2: number
          tipo: number
        }
        Insert: {
          parola1: number
          parola2: number
          tipo?: number
        }
        Update: {
          parola1?: number
          parola2?: number
          tipo?: number
        }
        Relationships: [
          {
            foreignKeyName: "collegamenti_parola1_fkey"
            columns: ["parola1"]
            referencedRelation: "parole"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collegamenti_parola2_fkey"
            columns: ["parola2"]
            referencedRelation: "parole"
            referencedColumns: ["id"]
          }
        ]
      }
      coniugazioni: {
        Row: {
          gerundio: string | null
          id: number
          numero: number
          participio: number | null
          tempi: Json | null
          tipo: number
        }
        Insert: {
          gerundio?: string | null
          id?: number
          numero: number
          participio?: number | null
          tempi?: Json | null
          tipo: number
        }
        Update: {
          gerundio?: string | null
          id?: number
          numero?: number
          participio?: number | null
          tempi?: Json | null
          tipo?: number
        }
        Relationships: [
          {
            foreignKeyName: "coniugazioni_participio_fkey"
            columns: ["participio"]
            referencedRelation: "declinazioni"
            referencedColumns: ["id"]
          }
        ]
      }
      declinazioni: {
        Row: {
          fp: string | null
          fs: string | null
          id: number
          mp: string | null
          ms: string | null
        }
        Insert: {
          fp?: string | null
          fs?: string | null
          id?: number
          mp?: string | null
          ms?: string | null
        }
        Update: {
          fp?: string | null
          fs?: string | null
          id?: number
          mp?: string | null
          ms?: string | null
        }
        Relationships: []
      }
      esempi: {
        Row: {
          id: number
          originale: string
          parola: number
          traduzione: string
        }
        Insert: {
          id?: number
          originale: string
          parola: number
          traduzione: string
        }
        Update: {
          id?: number
          originale?: string
          parola?: number
          traduzione?: string
        }
        Relationships: [
          {
            foreignKeyName: "esempi_parola_fkey"
            columns: ["parola"]
            referencedRelation: "parole"
            referencedColumns: ["id"]
          }
        ]
      }
      funzioni: {
        Row: {
          corto: string
          id: number
          lungo: string
        }
        Insert: {
          corto: string
          id?: number
          lungo: string
        }
        Update: {
          corto?: string
          id?: number
          lungo?: string
        }
        Relationships: []
      }
      parole: {
        Row: {
          coniugazione: number | null
          creazione: string
          declinazione: number | null
          descrizione: string | null
          esempi: Json | null
          funzione: number
          id: number
          modifica: string
          ordine: number
          parola: string
          radice: string | null
          traduzione: string
        }
        Insert: {
          coniugazione?: number | null
          creazione?: string
          declinazione?: number | null
          descrizione?: string | null
          esempi?: Json | null
          funzione: number
          id?: number
          modifica?: string
          ordine: number
          parola: string
          radice?: string | null
          traduzione: string
        }
        Update: {
          coniugazione?: number | null
          creazione?: string
          declinazione?: number | null
          descrizione?: string | null
          esempi?: Json | null
          funzione?: number
          id?: number
          modifica?: string
          ordine?: number
          parola?: string
          radice?: string | null
          traduzione?: string
        }
        Relationships: [
          {
            foreignKeyName: "parole_coniugazione_fkey"
            columns: ["coniugazione"]
            referencedRelation: "coniugazioni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parole_declinazione_fkey"
            columns: ["declinazione"]
            referencedRelation: "declinazioni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parole_funzione_fkey"
            columns: ["funzione"]
            referencedRelation: "funzioni"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aggiorna_collegamenti: {
        Args: {
          riferimento: number
          tipologie: number[]
          parole_collegate: number[]
        }
        Returns: undefined
      }
      aggiorna_ordini: {
        Args: {
          id_parole: number[]
        }
        Returns: undefined
      }
      casuale: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          parola: string
        }[]
      }
      parola_admin: {
        Args: {
          id_parola: number
        }
        Returns: {
          id: number
          parola: string
          traduzione: string
          ordine: number
          funzione: number
          descrizione: string
          esempi: Json
          radice: string
          collegamenti: Json
          declinazione: Json
          coniugazione: Json
        }[]
      }
      parola_multipla: {
        Args: {
          parola_esatta: string
        }
        Returns: {
          id: number
          parola: string
          traduzione: string
          ordine: number
          funzione: number
          funzione_display: string
          descrizione: string
          esempi: Json
          radice: string
          collegamenti: Json
          declinazione: Json
          coniugazione: Json
        }[]
      }
      parola_singola: {
        Args: {
          id_parola: number
        }
        Returns: {
          id: number
          parola: string
          traduzione: string
          ordine: number
          funzione: number
          funzione_display: string
          descrizione: string
          esempi: Json
          radice: string
          collegamenti: Json
          declinazione: Json
          coniugazione: Json
        }[]
      }
      problemi: {
        Args: Record<PropertyKey, never>
        Returns: {
          parola: string
          traduzioni: string[]
          ids: number[]
          tipo: number
        }[]
      }
      riassunto: {
        Args: {
          numero?: number
          salta?: number
        }
        Returns: {
          id: number
          ordine: number
          parola: string
          traduzione: string
          funzione: string
          con_descrizione: boolean
          numero_esempi: number
        }[]
      }
      ricerca_completa: {
        Args: {
          parola_re: string
          traduzione_re: string
        }
        Returns: {
          id: number
          parola: string
          traduzione: string
          funzione: string
        }[]
      }
      ricerca_singola: {
        Args: {
          parola_re: string
          traduzione_re: string
        }
        Returns: {
          id: number
          ordine: number
          parola: string
          traduzione: string
          funzione: string
          con_descrizione: boolean
          numero_esempi: number
        }[]
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
