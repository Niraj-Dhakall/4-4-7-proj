import { findDupeGroup, createGroup, getGroupByName, checkStudentInGroup } from '../groups'
import prisma from '../prisma'

// Mock Prisma client
jest.mock('../prisma', () => ({
  __esModule: true,
  default: {
    groups: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    section: {
      update: jest.fn(),
    },
  },
}))

describe('Groups Library Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('findDupeGroup', () => {
    it('should return true if a group with the same name exists', async () => {
      const mockGroup = { id: '1', name: 'Test Group' }
      ;(prisma.groups.findFirst as jest.Mock).mockResolvedValue(mockGroup)

      const result = await findDupeGroup({ name: 'Test Group' })

      expect(result).toBe(true)
      expect(prisma.groups.findFirst).toHaveBeenCalledWith({
        where: { name: 'Test Group' },
      })
    })

    it('should return false if no group with the same name exists', async () => {
      ;(prisma.groups.findFirst as jest.Mock).mockResolvedValue(null)

      const result = await findDupeGroup({ name: 'Unique Group' })

      expect(result).toBe(false)
    })

    it('should throw an error if database query fails', async () => {
      ;(prisma.groups.findFirst as jest.Mock).mockRejectedValue(new Error('DB Error'))

      await expect(findDupeGroup({ name: 'Test Group' })).rejects.toThrow(
        'Error finding duplicate groups'
      )
    })
  })

  describe('createGroup', () => {
    const mockGroupData = {
      name: 'New Group',
      group_master_id: 'student-123',
      section_id: 'section-456',
    }

    it('should create a group successfully', async () => {
      const mockCreatedGroup = {
        id: 'group-789',
        name: 'New Group',
        group_master_id: 'student-123',
        members: ['student-123'],
        member_count: 1,
      }

      ;(prisma.groups.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.groups.create as jest.Mock).mockResolvedValue(mockCreatedGroup)
      ;(prisma.section.update as jest.Mock).mockResolvedValue({})

      const result = await createGroup(mockGroupData)

      expect(result).toEqual({ success: true, data: mockCreatedGroup })
      expect(prisma.groups.create).toHaveBeenCalledWith({
        data: {
          name: 'New Group',
          group_master_id: 'student-123',
          members: ['student-123'],
          member_count: 1,
        },
      })
      expect(prisma.section.update).toHaveBeenCalledWith({
        where: { id: 'section-456' },
        data: {
          groups: { push: 'group-789' },
          group_count: { increment: 1 },
        },
      })
    })

    it('should return error if group name already exists', async () => {
      ;(prisma.groups.findFirst as jest.Mock).mockResolvedValue({ id: '1', name: 'New Group' })

      const result = await createGroup(mockGroupData)

      expect(result).toEqual({
        success: false,
        error: 'GROUP_EXISTS',
        message: 'A group with this name already exists',
      })
      expect(prisma.groups.create).not.toHaveBeenCalled()
    })

    it('should throw error if required fields are missing', async () => {
      await expect(
        createGroup({ name: '', group_master_id: 'student-123', section_id: 'section-456' })
      ).rejects.toThrow('Name, group leader id, and section id needed.')
    })
  })

  describe('getGroupByName', () => {
    it('should return group details when found', async () => {
      const mockGroup = {
        id: 'group-123',
        name: 'Test Group',
        member_count: 3,
        members: ['student-1', 'student-2', 'student-3'],
        group_master: {
          id: 'student-1',
          name: 'John Doe',
          email: 'john@example.com',
        },
      }

      ;(prisma.groups.findFirst as jest.Mock).mockResolvedValue(mockGroup)

      const result = await getGroupByName({ name: 'Test Group' })

      expect(result).toEqual(mockGroup)
      expect(prisma.groups.findFirst).toHaveBeenCalledWith({
        where: { name: 'Test Group' },
        select: {
          id: true,
          name: true,
          member_count: true,
          members: true,
          group_master: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })

    it('should throw error if name is not provided', async () => {
      await expect(getGroupByName({ name: '' })).rejects.toThrow('Name required')
    })
  })

  describe('checkStudentInGroup', () => {
    it('should return true if student is in group', async () => {
      ;(prisma.groups.findUnique as jest.Mock).mockResolvedValue({
        members: ['student-1', 'student-2', 'student-3'],
      })

      const result = await checkStudentInGroup({
        studentID: 'student-2',
        groupID: 'group-123',
      })

      expect(result).toBe(true)
    })

    it('should return false if student is not in group', async () => {
      ;(prisma.groups.findUnique as jest.Mock).mockResolvedValue({
        members: ['student-1', 'student-2'],
      })

      const result = await checkStudentInGroup({
        studentID: 'student-999',
        groupID: 'group-123',
      })

      expect(result).toBe(false)
    })

    it('should return false if group does not exist', async () => {
      ;(prisma.groups.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await checkStudentInGroup({
        studentID: 'student-1',
        groupID: 'non-existent',
      })

      expect(result).toBe(false)
    })
  })
})
