"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreVertical, ThumbsUp, Users, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getUsers, updateUser } from "@/lib/data-utils"
import { User } from "@/lib/types"

// Generate random data for lead influx
const generateLeadInfluxData = (total, color) => {
  const data = []
  const months = ["Jan", "Mar", "May"]

  let value = Math.floor(Math.random() * 200) + 100

  for (let i = 0; i < 3; i++) {
    // Generate a value that trends upward
    value = Math.max(100, Math.min(400, value + Math.floor(Math.random() * 60) - 20))

    data.push({
      name: months[i],
      value: value,
      color: color,
    })
  }

  // Make sure the last value matches the total
  data[data.length - 1].value = total

  return data
}

export function AnalyticsDashboard() {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [receptoNetLeads] = useState({
    total: 404,
    unlocked: 179,
    toUnlock: 394,
    liked: 23400,
    assigned: 23400,
    data: generateLeadInfluxData(404, "#4F46E5"),
  })
  const [orgNetworkLeads] = useState({
    total: 594,
    contacted: 179,
    toContact: 394,
    liked: 23400,
    assigned: 23400,
    data: generateLeadInfluxData(594, "#F97316"),
  })

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      setCurrentUser(JSON.parse(userString))
    }

    loadUsers()
  }, [])

  const loadUsers = () => {
    const usersData = getUsers()
    setUsers(usersData)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setEditEmail(user.email || "")
    setEditRole(user.role)
    setIsEditDialogOpen(true)
  }

  const handleSaveUser = () => {
    if (editingUser) {
      const updatedUser = {
        ...editingUser,
        email: editEmail,
        role: editRole,
      }

      updateUser(editingUser.id, { email: editEmail, role: editRole })
      setUsers(users.map((user) => (user.id === editingUser.id ? updatedUser : user)))
      setIsEditDialogOpen(false)
    }
  }

  const handleRemoveFromTeam = (userId) => {
    updateUser(userId, { status: "Removed" })
    loadUsers()
  }

  const itemsPerPage = 5
  const totalPages = Math.ceil(
    users.filter((user) => user.organization === currentUser?.organization).length / itemsPerPage,
  )

  const paginatedUsers = users
    .filter((user) => user.organization === currentUser?.organization)
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6">
      {/* ReceptoNet Leads Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 text-blue-600">
                <span className="text-xl font-bold">A</span>
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">ReceptoNet Leads</h3>
                  <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold">{receptoNetLeads.total}</span>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
              </div>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={receptoNetLeads.data}>
                  <defs>
                    <linearGradient id="colorReceptoNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#4F46E5" fillOpacity={1} fill="url(#colorReceptoNet)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: "45%" }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-gray-600">Unlocked</span>
                  <span className="text-sm font-semibold">{receptoNetLeads.unlocked} users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-300"></div>
                  <span className="text-sm text-gray-600">Yet to Unlock</span>
                  <span className="text-sm font-semibold">{receptoNetLeads.toUnlock} users</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-rows-2 gap-6">
            <Card className="border-0 shadow-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <ThumbsUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Liked Leads</h3>
                  <div className="text-2xl font-bold">{(receptoNetLeads.liked / 1000).toFixed(1)}K</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Assigned Leads</h3>
                  <div className="text-2xl font-bold">{(receptoNetLeads.assigned / 1000).toFixed(1)}K</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Org Network Leads Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">Org Network Leads</h3>
                  <HelpCircle className="h-4 w-4 text-gray-400 ml-1" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold">{orgNetworkLeads.total}</span>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
              </div>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={orgNetworkLeads.data}>
                  <defs>
                    <linearGradient id="colorOrgNetwork" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#F97316" fillOpacity={1} fill="url(#colorOrgNetwork)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: "30%" }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-600">Contacted</span>
                  <span className="text-sm font-semibold">{orgNetworkLeads.contacted} users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-300"></div>
                  <span className="text-sm text-gray-600">Yet to Contact</span>
                  <span className="text-sm font-semibold">{orgNetworkLeads.toContact} users</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-rows-2 gap-6">
            <Card className="border-0 shadow-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <ThumbsUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Liked Leads</h3>
                  <div className="text-2xl font-bold">{(orgNetworkLeads.liked / 1000).toFixed(1)}K</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-none">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Assigned Leads</h3>
                  <div className="text-2xl font-bold">{(orgNetworkLeads.assigned / 1000).toFixed(1)}K</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="text-gray-500 font-medium">Team</TableHead>
                <TableHead className="text-gray-500 font-medium w-[100px]">
                  <div className="flex items-center">
                    Role <HelpCircle className="h-3 w-3 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-gray-500 font-medium w-[100px] text-center">
                  <div className="flex items-center justify-center">
                    Generated <HelpCircle className="h-3 w-3 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-gray-500 font-medium w-[100px] text-center">
                  <div className="flex items-center justify-center">
                    Unlocked <HelpCircle className="h-3 w-3 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="text-gray-500 font-medium w-[100px] text-center">
                  <div className="flex items-center justify-center">
                    Assigned <HelpCircle className="h-3 w-3 ml-1" />
                  </div>
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="border-b border-gray-100">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">Last active 2min ago</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{Math.floor(Math.random() * 100) + 10}</TableCell>
                  <TableCell className="text-center">{Math.floor(Math.random() * 100) + 10}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">
                        {Math.floor(Math.random() * 20) + 5}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Manage Role
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemoveFromTeam(user.id)}>
                          <div className="flex items-center text-red-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remove from team
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            {totalPages > 5 && (
              <>
                <span className="mx-1">...</span>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-500 mb-4">Make changes to team member information</div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
