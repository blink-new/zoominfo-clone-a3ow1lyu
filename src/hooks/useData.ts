import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Company, Contact, SearchFilters } from '../types'

// Mock data for demonstration since we can't create the database
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    industry: 'Software',
    employees: '1,000-5,000',
    revenue: '$50M-$100M',
    location: 'San Francisco, CA',
    description: 'Leading enterprise software solutions provider specializing in cloud-based business applications and digital transformation services.',
    website: 'techcorp.com',
    founded: 2010,
    rating: 4.5,
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'DataFlow Analytics',
    industry: 'Data Analytics',
    employees: '500-1,000',
    revenue: '$25M-$50M',
    location: 'New York, NY',
    description: 'Advanced data analytics and business intelligence platform helping companies make data-driven decisions.',
    website: 'dataflow.com',
    founded: 2015,
    rating: 4.2,
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'CloudScale Systems',
    industry: 'Cloud Computing',
    employees: '2,000-10,000',
    revenue: '$100M-$500M',
    location: 'Seattle, WA',
    description: 'Enterprise cloud infrastructure and services provider with global reach and 99.9% uptime guarantee.',
    website: 'cloudscale.com',
    founded: 2008,
    rating: 4.7,
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'FinTech Innovations',
    industry: 'Financial Technology',
    employees: '200-500',
    revenue: '$10M-$25M',
    location: 'Austin, TX',
    description: 'Revolutionary fintech solutions for digital payments, lending, and wealth management.',
    website: 'fintech-innovations.com',
    founded: 2018,
    rating: 4.3,
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'HealthTech Solutions',
    industry: 'Healthcare Technology',
    employees: '1,000-2,000',
    revenue: '$75M-$150M',
    location: 'Boston, MA',
    description: 'Healthcare technology solutions improving patient outcomes through AI and data analytics.',
    website: 'healthtech-solutions.com',
    founded: 2012,
    rating: 4.6,
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'EcoGreen Energy',
    industry: 'Renewable Energy',
    employees: '500-1,000',
    revenue: '$30M-$75M',
    location: 'Denver, CO',
    description: 'Sustainable energy solutions and renewable power generation for commercial and residential clients.',
    website: 'ecogreen-energy.com',
    founded: 2016,
    rating: 4.4,
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'VP of Sales',
    company: 'TechCorp Solutions',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/sarahjohnson',
    location: 'San Francisco, CA',
    avatar: '',
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Chief Technology Officer',
    company: 'DataFlow Analytics',
    email: 'michael.chen@dataflow.com',
    phone: '+1 (555) 987-6543',
    linkedin: 'linkedin.com/in/michaelchen',
    location: 'New York, NY',
    avatar: '',
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Head of Marketing',
    company: 'CloudScale Systems',
    email: 'emily.rodriguez@cloudscale.com',
    phone: '+1 (555) 456-7890',
    linkedin: 'linkedin.com/in/emilyrodriguez',
    location: 'Seattle, WA',
    avatar: '',
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Product Manager',
    company: 'FinTech Innovations',
    email: 'david.kim@fintech-innovations.com',
    phone: '+1 (555) 234-5678',
    linkedin: 'linkedin.com/in/davidkim',
    location: 'Austin, TX',
    avatar: '',
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    title: 'Chief Medical Officer',
    company: 'HealthTech Solutions',
    email: 'lisa.thompson@healthtech-solutions.com',
    phone: '+1 (555) 345-6789',
    linkedin: 'linkedin.com/in/lisathompson',
    location: 'Boston, MA',
    avatar: '',
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Robert Martinez',
    title: 'Director of Operations',
    company: 'EcoGreen Energy',
    email: 'robert.martinez@ecogreen-energy.com',
    phone: '+1 (555) 567-8901',
    linkedin: 'linkedin.com/in/robertmartinez',
    location: 'Denver, CO',
    avatar: '',
    userId: 'demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function useData() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // In a real implementation, this would fetch from the database
        // For now, we'll use mock data
        setCompanies(mockCompanies)
        setContacts(mockContacts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const searchCompanies = (filters: SearchFilters): Company[] => {
    return companies.filter(company => {
      const matchesQuery = !filters.query || 
        company.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        company.industry.toLowerCase().includes(filters.query.toLowerCase()) ||
        company.description.toLowerCase().includes(filters.query.toLowerCase())

      const matchesIndustry = !filters.industry || 
        company.industry.toLowerCase().includes(filters.industry.toLowerCase())

      const matchesLocation = !filters.location || 
        company.location.toLowerCase().includes(filters.location.toLowerCase())

      const matchesSize = !filters.size || company.employees === filters.size

      return matchesQuery && matchesIndustry && matchesLocation && matchesSize
    })
  }

  const searchContacts = (filters: SearchFilters): Contact[] => {
    return contacts.filter(contact => {
      const matchesQuery = !filters.query || 
        contact.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        contact.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        contact.company.toLowerCase().includes(filters.query.toLowerCase())

      return matchesQuery
    })
  }

  const exportData = async (data: Company[] | Contact[], filename: string) => {
    try {
      const csvContent = convertToCSV(data)
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      throw new Error('Failed to export data')
    }
  }

  return {
    companies,
    contacts,
    loading,
    error,
    searchCompanies,
    searchContacts,
    exportData
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      }).join(',')
    )
  ]
  
  return csvRows.join('\n')
}