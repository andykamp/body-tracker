export type User = {
  uid: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export type Session = {
  id: string,
  user: User
}
