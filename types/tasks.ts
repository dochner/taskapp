export interface Task {
  id: string
  name: string
  description: string | null
  is_completed: boolean | null
  list_id?: string
  created_at?: string | null
}
