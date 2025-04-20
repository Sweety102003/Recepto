/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {"receptoNet" | "organization"} type
 * @property {string} name
 * @property {string} description
 * @property {number} score
 * @property {number} unlockCredits
 * @property {boolean} unlocked
 * @property {boolean} liked
 * @property {boolean} disliked
 * @property {string} [assignedTo]
 * @property {string} [assignedToName]
 * @property {string} [groupName]
 * @property {{ id: string, name: string }[]} [people]
 * @property {string} [location]
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} username
 * @property {string} password
 * @property {string} role
 * @property {string} status
 * @property {string} organization
 * @property {string} [email]
 */

// Example usage:
const exampleLead = {
    id: "123",
    type: "receptoNet",
    name: "Lead Name",
    description: "Lead description",
    score: 85,
    unlockCredits: 10,
    unlocked: false,
    liked: false,
    disliked: false,
    assignedTo: "user123",
    assignedToName: "John Doe",
    groupName: "Group A",
    people: [{ id: "p1", name: "Person One" }],
    location: "New York"
  };
  
  /** @type {User} */
  const exampleUser = {
    id: "u1",
    name: "Jane Doe",
    username: "janedoe",
    password: "securepassword",
    role: "admin",
    status: "active",
    organization: "Acme Corp",
    email: "jane@example.com"
  };
  