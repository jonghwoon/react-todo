export type Task = {
  id: number
  title: string
  created_at: Date
  updated_at: Date
  completed?: boolean
}

export type Credential = {
  email: string
  password: string
}
