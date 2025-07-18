export interface Company {
  id: string
  name: string
  industry: string
  employees: string
  revenue: string
  location: string
  description: string
  website: string
  founded: number
  rating: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone: string
  linkedin: string
  location: string
  avatar: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  industry?: string
  size?: string
  location?: string
  query?: string
}