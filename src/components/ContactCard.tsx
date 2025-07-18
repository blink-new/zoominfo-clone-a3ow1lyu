import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Building2, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import type { Contact } from '../types'

interface ContactCardProps {
  contact: Contact
  onSelect?: (contact: Contact) => void
}

export function ContactCard({ contact, onSelect }: ContactCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(contact)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={handleClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
              {contact.name}
            </CardTitle>
            <p className="text-sm text-gray-600 line-clamp-1 mb-1">
              {contact.title}
            </p>
            {contact.companyName && (
              <div className="flex items-center gap-1 text-sm text-primary font-medium">
                <Building2 className="h-3 w-3" />
                <span className="line-clamp-1">{contact.companyName}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {contact.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="line-clamp-1">{contact.email}</span>
            </div>
          )}
          
          {contact.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{contact.phone}</span>
            </div>
          )}
          
          {contact.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="line-clamp-1">{contact.location}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {contact.department && (
              <Badge variant="outline" className="text-xs">
                {contact.department}
              </Badge>
            )}
            {contact.seniority && (
              <Badge variant="secondary" className="text-xs">
                {contact.seniority}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {contact.linkedin && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(contact.linkedin, '_blank')
                }}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            )}
            
            {contact.email && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = `mailto:${contact.email}`
                }}
              >
                <Mail className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}