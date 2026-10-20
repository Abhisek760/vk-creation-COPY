import { TeamMember, TaskAssignment } from '@/types/team';

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Aman Sharma',
    role: 'Admin',
    phone: '+91 9876543210',
    email: 'aman@vkcreation.com',
    dailyRate: 0,
    status: 'Active',
    assignedShootsCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tm-2',
    name: 'Vikram Singh',
    role: 'Candid Master',
    phone: '+91 9876500001',
    email: 'vikram@vkcreation.com',
    dailyRate: 15000,
    status: 'On Shoot',
    assignedShootsCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tm-3',
    name: 'Rohan Mehta',
    role: 'Video Editor',
    phone: '+91 9876500002',
    email: 'rohan@vkcreation.com',
    dailyRate: 12000,
    status: 'Active',
    assignedShootsCount: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tm-4',
    name: 'Suresh Kumar',
    role: 'Drone Operator',
    phone: '+91 9876500003',
    email: 'suresh@vkcreation.com',
    dailyRate: 10000,
    status: 'Active',
    assignedShootsCount: 6,
    createdAt: new Date().toISOString(),
  },
];

export class TeamRepository {
  static getAllMembers(): TeamMember[] {
    if (typeof window === 'undefined') return DEFAULT_TEAM;
    const saved = localStorage.getItem('vk_studio_team');
    if (!saved) {
      localStorage.setItem('vk_studio_team', JSON.stringify(DEFAULT_TEAM));
      return DEFAULT_TEAM;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_TEAM;
    }
  }

  static saveMember(member: TeamMember): void {
    if (typeof window === 'undefined') return;
    const members = this.getAllMembers();
    const index = members.findIndex((m) => m.id === member.id);
    if (index >= 0) {
      members[index] = member;
    } else {
      members.unshift(member);
    }
    localStorage.setItem('vk_studio_team', JSON.stringify(members));
  }

  static deleteMember(id: string): void {
    if (typeof window === 'undefined') return;
    const members = this.getAllMembers().filter((m) => m.id !== id);
    localStorage.setItem('vk_studio_team', JSON.stringify(members));
  }
}