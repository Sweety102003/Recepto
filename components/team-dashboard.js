"use client"

import { useState, useEffect } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts"
import { getUsers, updateUser, getLeads } from "@/lib/data-utils"

// Generate random data for lead influx
const generateLeadInfluxData = () => {
  const data = []
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  for (let i = 0; i < 12; i++) {
    data.push({
      name: months[i],
      leads: Math.floor(Math.random() * 50) + 10,
    })
  }

  return data
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function TeamDashboard() {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [leadStats, setLeadStats] = useState({
    total: 0,
    unlocked: 0,
    assigned: 0,
    liked: 0,
    disliked: 0,
  })
  const [leadInfluxData] = useState(generateLeadInfluxData())

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      setCurrentUser(JSON.parse(userString))
    }

    loadUsers()
    calculateLeadStats()
  }, [])

  const loadUsers = () => {
    const usersData = getUsers()
    setUsers(usersData)
  }

  const calculateLeadStats = () => {
    const leads = getLeads()
    const stats = {
      total: leads.length,
      unlocked: leads.filter((lead) => lead.unlocked).length,
      assigned: leads.filter((lead) => lead.assignedTo).length,
      liked: leads.filter((lead) => lead.liked).length,
      disliked: leads.filter((lead) => lead.disliked).length,
    }
    setLeadStats(stats)
  }

  const handleRoleChange = (userId, role) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, role }
      }
      return user
    })

    setUsers(updatedUsers)
    updateUser(userId, { role })
  }

  const handleStatusChange = (userId, status) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, status }
      }
      return user
    })

    setUsers(updatedUsers)
    updateUser(userId, { status })
  }

  const pieData = [
    { name: "Liked", value: leadStats.liked },
    { name: "Disliked", value: leadStats.disliked },
    { name: "Neutral", value: leadStats.total - leadStats.liked - leadStats.disliked },
  ].filter((item) => item.value > 0)

  const barData = [
    { name: "Total", value: leadStats.total },
    { name: "Unlocked", value: leadStats.unlocked },
    { name: "Assigned", value: leadStats.assigned },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unlocked Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.unlocked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.assigned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Liked/Disliked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leadStats.liked}/{leadStats.disliked}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead Influx</CardTitle>
            <CardDescription>Monthly lead generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={leadInfluxData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lead Status</CardTitle>
            <CardDescription>Unlocked and assigned leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Sentiment</CardTitle>
          <CardDescription>Liked vs disliked leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage team members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Organization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .filter((user) => user.organization === currentUser?.organization)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={user.status} onValueChange={(value) => handleStatusChange(user.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.organization}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
