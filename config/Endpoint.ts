export const ENDPOINTS = {
  createserver: '/api/servers/servers',
  updateserver: (serverId: string) => `/api/servers/${serverId}`,
  deleteserver: (serverId: string) => `/api/servers/${serverId}`,
  updateinvitecode: (serverId: string) => `/api/servers/${serverId}/invite-codes`,
  alterRoleuser: (memberId: string) => `/api/members/${memberId}`,
  kickoutuser: (memberId: string) => `/api/members/${memberId}`,
  createchannel: `/api/channels`,
  leaveserver: (serverId: string) => `/api/servers/${serverId}/leave`,
}
