import { useState, useMemo } from 'react'
import { Search, Building2, Users, Filter, Download, Star, MapPin, DollarSign, TrendingUp, Phone, Mail, Linkedin, LogOut, BarChart3 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Separator } from './components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { Skeleton } from './components/ui/skeleton'
import { EnterpriseSearchResults } from './components/EnterpriseSearchResults'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { useAuth } from './hooks/useAuth'
import { useData } from './hooks/useData'
import { SearchFilters } from './types'
import toast from 'react-hot-toast'

function App() {
  const { user, isLoading: authLoading, isAuthenticated, login, logout } = useAuth()
  const { companies, contacts, loading: dataLoading, searchCompanies, searchContacts, exportData } = useData()
  
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'analytics'>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'companies' | 'contacts'>('companies')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const filters: SearchFilters = useMemo(() => ({
    query: searchQuery,
    industry: selectedIndustry,
    size: selectedSize,
    location: selectedLocation
  }), [searchQuery, selectedIndustry, selectedSize, selectedLocation])

  const filteredCompanies = useMemo(() => searchCompanies(filters), [searchCompanies, filters])
  const filteredContacts = useMemo(() => searchContacts(filters), [searchContacts, filters])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCurrentView('search')
      toast.success(`Searching for "${searchQuery}"...`)
    }
  }

  const handleExport = async () => {
    try {
      const data = activeTab === 'companies' ? filteredCompanies : filteredContacts
      const filename = `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`
      await exportData(data, filename)
      toast.success(`${activeTab} data exported successfully!`)
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedIndustry('')
    setSelectedSize('')
    setSelectedLocation('')
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center space-x-2 justify-center">
            <Building2 className="h-8 w-8 text-primary animate-pulse" />
            <span className="text-xl font-bold text-gray-900">ZoomInfo</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Authentication required
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="p-8 text-center">
            <div className="flex items-center space-x-2 justify-center mb-6">
              <Building2 className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold text-gray-900">ZoomInfo</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to ZoomInfo Clone
            </h1>
            <p className="text-gray-600 mb-6">
              Access the most comprehensive B2B database with millions of contacts and companies. 
              Sign in to start your search.
            </p>
            <Button onClick={login} className="w-full" size="lg">
              Sign In to Continue
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-gray-900">ZoomInfo</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView('home')}
                className={`font-medium ${currentView === 'home' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Platform
              </button>
              <button 
                onClick={() => setCurrentView('search')}
                className={`font-medium ${currentView === 'search' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Search
              </button>
              <button 
                onClick={() => setCurrentView('analytics')}
                className={`font-medium ${currentView === 'analytics' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Analytics
              </button>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Welcome, {user?.displayName || user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Home View */}
      {currentView === 'home' && (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Next Customer
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Access the most comprehensive B2B database with over 100M+ contacts and 20M+ companies. 
                Accelerate your sales and marketing with accurate, real-time business intelligence.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search companies, contacts, or industries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 pr-4 py-4 text-lg h-14 rounded-xl border-2 border-gray-200 focus:border-primary"
                  />
                  <Button 
                    className="absolute right-2 top-2 h-10 px-6 rounded-lg"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">100M+</div>
                  <div className="text-lg font-semibold text-gray-900">Records</div>
                  <div className="text-gray-600">Companies & contacts</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">&lt;100ms</div>
                  <div className="text-lg font-semibold text-gray-900">Search Speed</div>
                  <div className="text-gray-600">Even with massive datasets</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                  <div className="text-lg font-semibold text-gray-900">Uptime</div>
                  <div className="text-gray-600">Enterprise reliability</div>
                </div>
              </div>
            </div>
          </section>

          {/* Enterprise Features */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Enterprise-Scale Performance
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Built to handle massive datasets with lightning-fast search, advanced filtering, and real-time analytics.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center p-6">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Search</h3>
                  <p className="text-gray-600">
                    Multi-column indexing and full-text search capabilities for instant results across 100M+ records.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
                  <p className="text-gray-600">
                    Comprehensive dashboards and insights to understand your data coverage and performance.
                  </p>
                </Card>
                
                <Card className="text-center p-6">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Pagination</h3>
                  <p className="text-gray-600">
                    Efficient result chunking and batch processing for smooth navigation through large datasets.
                  </p>
                </Card>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Search View */}
      {currentView === 'search' && (
        <EnterpriseSearchResults 
          initialFilters={filters}
        />
      )}

      {/* Analytics View */}
      {currentView === 'analytics' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">
              Real-time insights into your B2B database performance and coverage
            </p>
          </div>
          <AnalyticsDashboard />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-lg font-bold">ZoomInfo</span>
              </div>
              <p className="text-gray-400 text-sm">
                The leading B2B contact database and sales intelligence platform built for enterprise scale.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Sales Intelligence</a></li>
                <li><a href="#" className="hover:text-white">Marketing Intelligence</a></li>
                <li><a href="#" className="hover:text-white">Recruiting Intelligence</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Lead Generation</a></li>
                <li><a href="#" className="hover:text-white">Account-Based Marketing</a></li>
                <li><a href="#" className="hover:text-white">Sales Prospecting</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ZoomInfo Clone. All rights reserved. Built for enterprise scale.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App