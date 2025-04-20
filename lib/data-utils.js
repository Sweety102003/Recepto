"use client"

// Generate random ID
const generateId = () => Math.random().toString(36).substring(2, 10)

// Initialize users if they don't exist
export const initializeUsers = () => {
  if (!localStorage.getItem("users")) {
    const users = [
      {
        id: generateId(),
        name: "Olivia Rhye",
        username: "olivia",
        password: "password",
        role: "Admin",
        status: "Active",
        organization: "Acme Inc",
        email: "olivia@example.com",
      },
      {
        id: generateId(),
        name: "Jane Smith",
        username: "jane",
        password: "password",
        role: "Manager",
        status: "Active",
        organization: "Acme Inc",
        email: "jane@example.com",
      },
      {
        id: generateId(),
        name: "Bob Johnson",
        username: "bob",
        password: "password",
        role: "Member",
        status: "Active",
        organization: "Acme Inc",
        email: "bob@example.com",
      },
      {
        id: generateId(),
        name: "Alice Brown",
        username: "alice",
        password: "password",
        role: "Member",
        status: "Active",
        organization: "Acme Inc",
        email: "alice@example.com",
      },
      {
        id: generateId(),
        name: "Anand Kumar",
        username: "anand",
        password: "password",
        role: "Admin",
        status: "Active",
        organization: "Beta Corp",
        email: "anand@example.com",
      },
    ]

    localStorage.setItem("users", JSON.stringify(users))
  }
}

// List of locations for random assignment
const locations = [
  "Mumbai, India",
  "Bangalore, India",
  "Delhi, India",
  "New York, United States of America",
  "San Francisco, United States of America",
  "London, United Kingdom",
  "Berlin, Germany",
  "Paris, France",
  "Tokyo, Japan",
  "Singapore, Singapore",
]

// Generate random leads
const generateLeads = () => {
  const leads = []
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Group users by organization
  const orgUsers = {}
  users.forEach((user) => {
    if (!orgUsers[user.organization]) {
      orgUsers[user.organization] = []
    }
    orgUsers[user.organization].push(user)
  })

  // Generate ReceptoNet leads
  for (let i = 0; i < 10; i++) {
    leads.push({
      id: generateId(),
      type: "receptoNet",
      name: `Lead ${i + 1}`,
      description: `Looking for recommendations on product analytics tools for our B2B SaaS platform. Currently evaluating options for a team of 50 developers.`,
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      unlockCredits: Math.floor(Math.random() * 3) + 1, 
      unlocked: Math.random() > 0.7,
      liked: false,
      disliked: false,
      location: locations[Math.floor(Math.random() * locations.length)],
    })
  }

  // Generate Organization leads
  Object.entries(orgUsers).forEach(([org, orgUsersList]) => {
    for (let i = 0; i < 10; i++) {
      const people = orgUsersList
        .slice(0, Math.min(orgUsersList.length, Math.floor(Math.random() * 3) + 1))
        .map((user) => ({ id: user.id, name: user.name }))

      leads.push({
        id: generateId(),
        type: "organization",
        name: `${org} Lead ${i + 1}`,
        description: `A team from *company name mentioned* is seeking a highly motivated Business Development Executive to outreach and secure business opportunities.`,
        score: Math.floor(Math.random() * 30) + 70,
        unlockCredits: Math.floor(Math.random() * 4) + 1,
        unlocked: Math.random() > 0.7,
        liked: false,
        disliked: false,
        groupName: ["Enterprise", "SMB", "Startup", "Agency", "Retail"][i % 5],
        people,
        location: locations[Math.floor(Math.random() * locations.length)],
      })
    }
  })

  return leads
}

// Initialize data
export const initializeData = () => {
  initializeUsers()

  if (!localStorage.getItem("leads")) {
    const leads = generateLeads()
    localStorage.setItem("leads", JSON.stringify(leads))
  }
}

// Get leads
export const getLeads = () => {
  return JSON.parse(localStorage.getItem("leads") || "[]")
}

// Update lead
export const updateLead = (updatedLead) => {
  const leads = getLeads()
  const index = leads.findIndex((lead) => lead.id === updatedLead.id)

  if (index !== -1) {
    leads[index] = updatedLead
    localStorage.setItem("leads", JSON.stringify(leads))
  }
}

// Get users
export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users") || "[]")
}

// Update user
export const updateUser = (userId, updates) => {
  const users = getUsers()
  const index = users.findIndex((user) => user.id === userId)

  if (index !== -1) {
    users[index] = { ...users[index], ...updates }
    localStorage.setItem("users", JSON.stringify(users))
  }
}
