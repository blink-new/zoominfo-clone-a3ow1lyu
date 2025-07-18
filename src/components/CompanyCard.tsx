import React from 'react'
import { Building2, Users, DollarSign, MapPin, Star, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import type { Company } from '../types'

interface CompanyCardProps {
  company: Company
  onSelect?: (company: Company) => void
}

export function CompanyCard({ company, onSelect }: CompanyCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(company)
    }
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={handleClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {company.name}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {company.industry}
              </Badge>
              {company.website && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(company.website, '_blank')
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{company.size || company.employeeCount || 'N/A'} employees</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>{company.revenue || 'Revenue not disclosed'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="line-clamp-1">{company.location || 'Location not specified'}</span>
          </div>
        </div>
        
        {company.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {company.description}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Founded: {company.founded || 'N/A'}
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}