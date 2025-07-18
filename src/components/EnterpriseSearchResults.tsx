import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'
import { enterpriseDataService, type SearchResult } from '../services/enterpriseDataService'
import type { Company, Contact, SearchFilters } from '../types'
import { CompanyCard } from './CompanyCard'
import { ContactCard } from './ContactCard'

interface EnterpriseSearchResultsProps {
  initialFilters?: SearchFilters
}

export function EnterpriseSearchResults({ initialFilters = {} }: EnterpriseSearchResultsProps) {
  const [searchType, setSearchType] = useState<'companies' | 'contacts'>('companies')
  const [filters, setFilters] = useState({
    query: '',
    industry: '',
    size: '',
    location: '',
    ...initialFilters
  })
  
  const [companyResults, setCompanyResults] = useState<SearchResult<Company> | null>(null)
  const [contactResults, setContactResults] = useState<SearchResult<Contact> | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Debounced search function
  const performSearch = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const searchFilters = {
        ...filters,
        page,
        pageSize,
        sortBy,
        sortOrder
      }

      if (searchType === 'companies') {
        const results = await enterpriseDataService.searchCompanies(searchFilters)
        setCompanyResults(results)
        setContactResults(null)
      } else {
        const results = await enterpriseDataService.searchContacts(searchFilters)
        setContactResults(results)
        setCompanyResults(null)
      }
      
      setCurrentPage(page)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, searchType, pageSize, sortBy, sortOrder])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.query || filters.industry || filters.size || filters.location) {
        performSearch(1)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, searchType, pageSize, sortBy, sortOrder, performSearch])

  // Initial search
  useEffect(() => {
    performSearch(1)
  }, [performSearch, searchType])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    performSearch(page)
  }

  const handleExport = async () => {
    // TODO: Implement export functionality
    console.log('Exporting results...')
  }

  const currentResults = searchType === 'companies' ? companyResults : contactResults
  const totalPages = currentResults ? Math.ceil(currentResults.total / currentResults.pageSize) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search companies, contacts, or keywords..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Search Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={searchType === 'companies' ? 'default' : 'ghost'}
                onClick={() => setSearchType('companies')}
                className="flex-1"
              >
                Companies
              </Button>
              <Button
                variant={searchType === 'contacts' ? 'default' : 'ghost'}
                onClick={() => setSearchType('contacts')}
                className="flex-1"
              >
                Contacts
              </Button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 mt-4">
            <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Industries</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.size} onValueChange={(value) => handleFilterChange('size', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sizes</SelectItem>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="501-1000">501-1000 employees</SelectItem>
                <SelectItem value="1000+">1000+ employees</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-48"
            />

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="created_at">Date Added</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>

            <Button variant="outline" onClick={handleExport} disabled={!currentResults?.data.length}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching...
                </div>
              ) : (
                `${currentResults?.total.toLocaleString() || 0} ${searchType} found`
              )}
            </h2>
            
            {currentResults && (
              <Badge variant="secondary">
                Page {currentPage} of {totalPages}
              </Badge>
            )}
          </div>

          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: pageSize }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!loading && currentResults && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchType === 'companies' && companyResults?.data.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
              
              {searchType === 'contacts' && contactResults?.data.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, currentPage - 2) + i
                    if (page > totalPages) return null
                    
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        onClick={() => handlePageChange(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && currentResults && currentResults.data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ query: '', industry: '', size: '', location: '' })
                setCurrentPage(1)
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}