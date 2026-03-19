export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
}

export const mockStaff: StaffMember[] = [
  { id: "s1", name: "Maria Chen",   role: "Food Runner",     avatar: "", initials: "MC" },
  { id: "s2", name: "James Park",   role: "Waiter",          avatar: "", initials: "JP" },
  { id: "s3", name: "Sofia Reyes",  role: "Kitchen Staff",   avatar: "", initials: "SR" },
  { id: "s4", name: "Tom Adler",    role: "Food Runner",     avatar: "", initials: "TA" },
  { id: "s5", name: "Nina Osei",    role: "F&B Supervisor",  avatar: "", initials: "NO" },
  { id: "s6", name: "David Kim",    role: "Waiter",          avatar: "", initials: "DK" },
];
