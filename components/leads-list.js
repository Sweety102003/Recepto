"use client"

import { useState, useEffect, useRef } from "react"
import { ThumbsUp, ThumbsDown, Lock, Search, MapPin, Filter, X, Phone, Mail, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import  { Lead, User as UserType } from "@/lib/types"
import { getLeads, updateLead, getUsers } from "@/lib/data-utils"

// List of locations for the filter
const locations = [
  { country: "India", cities: ["Mumbai", "Bangalore", "Delhi", "Hyderabad"] },
  { country: "United States of America", cities: ["New York", "San Francisco", "Chicago", "Los Angeles"] },
  { country: "United Kingdom", cities: ["London", "Manchester", "Birmingham", "Edinburgh"] },
  { country: "Germany", cities: ["Berlin", "Munich", "Hamburg", "Frankfurt"] },
  { country: "France", cities: ["Paris", "Lyon", "Marseille", "Toulouse"] },
  { country: "Japan", cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama"] },
  { country: "China", cities: ["Beijing", "Shanghai", "Shenzhen", "Guangzhou"] },
  { country: "Singapore", cities: ["Singapore"] },
  { country: "South Africa", cities: ["Johannesburg", "Cape Town", "Durban", "Pretoria"] },
  { country: "Australia", cities: ["Sydney", "Melbourne", "Brisbane", "Perth"] },
]

export function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const searchInputRef = useRef(null);
  

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      setCurrentUser(JSON.parse(userString))
    }

    loadLeads()
    loadUsers()

    // Set up interval to refresh data every 5 seconds to simulate real-time updates
    const interval = setInterval(() => {
      loadLeads()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Filter leads based on search query and selected locations
    let filtered = leads

    if (searchQuery) {
      filtered = filtered.filter(
        (lead) =>
          lead.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (lead.type === "organization" && lead.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((lead) => selectedLocations.includes(lead.location || ""))
    }

    setFilteredLeads(filtered)
  }, [leads, searchQuery, selectedLocations])

  const loadLeads = () => {
    const leadsData = getLeads()
    setLeads(leadsData)
    setFilteredLeads(leadsData)
  }

  const loadUsers = () => {
    const usersData = getUsers()
    setUsers(usersData)
  }

  const handleUnlock = (lead) => {
    const updatedLead = { ...lead, unlocked: true }
    updateLead(updatedLead)
    loadLeads()
  }

  const handleLike = (lead) => {
    const updatedLead = { ...lead, liked: !lead.liked, disliked: false }
    updateLead(updatedLead)
    loadLeads()
  }

  const handleDislike = (lead) => {
    const updatedLead = { ...lead, disliked: !lead.disliked, liked: false }
    updateLead(updatedLead)
    loadLeads()
  }

  const openAssignDialog = (lead) => {
    setSelectedLead(lead)
    setIsAssignDialogOpen(true)
  }

  const handleAssign = (userId) => {
    if (selectedLead) {
      const user = users.find((u) => u.id === userId)
      if (user) {
        const updatedLead = {
          ...selectedLead,
          assignedTo: userId,
          assignedToName: user.name,
        }

        // Update the lead in localStorage
        updateLead(updatedLead)

        // Update the leads in state to reflect the change immediately
        setLeads((prevLeads) => prevLeads.map((lead) => (lead.id === selectedLead.id ? updatedLead : lead)))

        // Also update filtered leads
        setFilteredLeads((prevLeads) => prevLeads.map((lead) => (lead.id === selectedLead.id ? updatedLead : lead)))

        // Close the dialog
        setIsAssignDialogOpen(false)
      }
    }
  }

  const toggleLocationFilter = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location],
    )
  }

  const clearFilters = () => {
    setSelectedLocations([])
  }

  const getTimeAgo = (lead) => {
    // Simulate time ago based on lead ID to make it deterministic
    const hash = lead.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0) % 24

    if (hash < 3) return "Found 2 hour ago"
    if (hash < 6) return "3 hours ago"
    if (hash < 9) return "Today"
    if (hash < 12) return "Yesterday"
    if (hash < 15) return "2 days ago"
    if (hash < 18) return "3 days ago"
    if (hash < 21) return "Last week"
    return "2 weeks ago"
  }

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            ref={searchInputRef}
            placeholder="What is the best tool for XYZ..."
            className="pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsFilterDialogOpen(true)}>
          <Filter className="h-4 w-4" />
          Filters
          {selectedLocations.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selectedLocations.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className={`border-l-4 ${lead.type === "receptoNet" ? "border-l-orange-500" : "border-l-blue-500"} bg-white rounded-md shadow-sm overflow-hidden`}
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                    {lead.type === "receptoNet" ? (
                      <Lock className="h-6 w-6" />
                    ) : (
                      <Avatar>
                        <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col">
                    <div className="font-medium text-gray-900">
                      {lead.type === "receptoNet" ? (
                        <span className="text-gray-500">[Name Hidden]</span>
                      ) : (
                        <span>Jennifer Markus</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{lead.location || "Mumbai, India"}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      {lead.type === "receptoNet"
                        ? `"${lead.description}"`
                        : `A team from *company name mentioned* is seeking a highly motivated Business Development Executive to outreach and secure business opportunities.`}
                    </p>
                    {lead.assignedToName && (
                      <div className="flex items-center mt-1 text-xs text-gray-600">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        <span>Assigned to: {lead.assignedToName}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center text-xs text-blue-600">
                        <div className="h-2 w-2 rounded-full bg-blue-600 mr-1.5"></div>
                        {getTimeAgo(lead)}
                      </div>

                      {lead.type === "receptoNet" ? (
                        <Badge
                          variant="outline"
                          className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs font-normal"
                        >
                          ReceptoNet
                        </Badge>
                      ) : (
                        <>
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-1">
                              <Avatar className="h-5 w-5 border border-white">
                                <AvatarFallback className="text-[10px] bg-orange-100 text-orange-800">O</AvatarFallback>
                              </Avatar>
                              <Avatar className="h-5 w-5 border border-white">
                                <AvatarFallback className="text-[10px] bg-green-100 text-green-800">N</AvatarFallback>
                              </Avatar>
                            </div>
                            <span className="text-xs text-gray-600">Org's Network</span>
                          </div>

                          {lead.groupName && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 hover:bg-green-100 text-xs font-normal"
                            >
                              Group name
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {!lead.unlocked ? (
                    <Button
                      onClick={() => handleUnlock(lead)}
                      className="flex items-center gap-1 bg-blue-600 rounded-full"
                      size="sm"
                    >
                      {lead.type === "receptoNet" ? (
                        <>
                          <Mail className="h-4 w-4 mr-1" /> Unlock
                        </>
                      ) : (
                        <>
                          <Phone className="h-4 w-4 mr-1" /> Unlock
                        </>
                      )}
                      <span className="flex items-center ml-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {lead.unlockCredits}
                      </span>
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openAssignDialog(lead)}
                        className="rounded-full"
                        size="sm"
                      >
                        Assign
                      </Button>
                      <Button variant="outline" className="rounded-full" size="sm">
                        View Details
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center font-medium ${lead.score >= 90 ? "bg-green-500" : "bg-blue-500"} text-white`}
                    >
                      {lead.score}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-full ${lead.liked ? "text-blue-500 bg-blue-50" : "text-gray-400"}`}
                      onClick={() => handleLike(lead)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-full ${lead.disliked ? "text-red-500 bg-red-50" : "text-gray-400"}`}
                      onClick={() => handleDislike(lead)}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Lead</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-2 p-2">
              {users
                .filter((user) => user.organization === currentUser?.organization)
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-md border p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      handleAssign(user.id)
                      setIsAssignDialogOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Assign
                    </Button>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Location</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Clear all filters
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search locations..." className="pl-10 pr-4" onClick={focusSearch} />
              </div>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="grid grid-cols-2 gap-4">
                {locations.map((loc) => (
                  <div key={loc.country} className="space-y-2">
                    <h4 className="font-medium text-sm">{loc.country}</h4>
                    {loc.cities.map((city) => (
                      <div key={`${loc.country}-${city}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${loc.country}-${city}`}
                          checked={selectedLocations.includes(`${city}, ${loc.country}`)}
                          onCheckedChange={() => toggleLocationFilter(`${city}, ${loc.country}`)}
                        />
                        <label
                          htmlFor={`${loc.country}-${city}`}
                          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {city}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
