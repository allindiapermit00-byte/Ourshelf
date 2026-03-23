import { describe, it, expect, beforeEach } from 'vitest'
import { Timestamp } from 'firebase/firestore'
import { clearFirestoreEmulator } from '@/lib/test-utils/firestore-helpers'
import {
  getRequest,
  listRequestsForOwner,
  listRequestsForRequester,
  createRequest,
  updateRequest,
} from './requests.repo'
import { RequestStatus } from '@/lib/types'
import type { BorrowRequest } from '@/lib/types'

const ts = Timestamp.fromDate(new Date('2025-01-01'))

function makeRequest(
  overrides: Partial<Omit<BorrowRequest, 'id'>> = {}
): Omit<BorrowRequest, 'id'> {
  return {
    groupId: 'group-1',
    itemId: 'item-1',
    ownerUserId: 'owner-1',
    requesterUserId: 'requester-1',
    status: RequestStatus.Pending,
    requestedAt: ts,
    updatedAt: ts,
    ...overrides,
  }
}

describe('requests.repo', () => {
  beforeEach(async () => {
    await clearFirestoreEmulator()
  })

  describe('getRequest', () => {
    it('returns null when the document does not exist', async () => {
      expect(await getRequest('nonexistent-id')).toBeNull()
    })

    it('returns a BorrowRequest when the document exists', async () => {
      const req = await createRequest(makeRequest())
      const result = await getRequest(req.id)
      expect(result?.groupId).toBe('group-1')
      expect(result?.status).toBe(RequestStatus.Pending)
    })
  })

  describe('createRequest', () => {
    it('returns a BorrowRequest with an auto-generated id', async () => {
      const req = await createRequest(makeRequest())
      expect(req.id).toBeTruthy()
    })
  })

  describe('listRequestsForOwner', () => {
    it('returns all requests for owner with no status filter', async () => {
      await createRequest(makeRequest({ ownerUserId: 'o-1', status: RequestStatus.Pending }))
      await createRequest(makeRequest({ ownerUserId: 'o-1', status: RequestStatus.Approved }))
      await createRequest(makeRequest({ ownerUserId: 'o-2', status: RequestStatus.Pending }))

      const results = await listRequestsForOwner('o-1')
      expect(results).toHaveLength(2)
    })

    it('filters by status', async () => {
      await createRequest(makeRequest({ ownerUserId: 'o-1', status: RequestStatus.Pending }))
      await createRequest(makeRequest({ ownerUserId: 'o-1', status: RequestStatus.Approved }))

      const results = await listRequestsForOwner('o-1', RequestStatus.Pending)
      expect(results).toHaveLength(1)
      expect(results[0].status).toBe(RequestStatus.Pending)
    })

    it('returns empty array when owner has no requests', async () => {
      expect(await listRequestsForOwner('nobody')).toHaveLength(0)
    })
  })

  describe('listRequestsForRequester', () => {
    it('returns requests made by the requester', async () => {
      await createRequest(makeRequest({ requesterUserId: 'r-1' }))
      await createRequest(makeRequest({ requesterUserId: 'r-2' }))

      const results = await listRequestsForRequester('r-1')
      expect(results).toHaveLength(1)
      expect(results[0].requesterUserId).toBe('r-1')
    })

    it('filters by status', async () => {
      await createRequest(makeRequest({ requesterUserId: 'r-1', status: RequestStatus.Cancelled }))
      await createRequest(makeRequest({ requesterUserId: 'r-1', status: RequestStatus.Pending }))

      const results = await listRequestsForRequester('r-1', RequestStatus.Cancelled)
      expect(results).toHaveLength(1)
      expect(results[0].status).toBe(RequestStatus.Cancelled)
    })
  })

  describe('updateRequest', () => {
    it('updates only the specified fields', async () => {
      const req = await createRequest(makeRequest({ status: RequestStatus.Pending }))
      await updateRequest(req.id, { status: RequestStatus.Approved })
      const result = await getRequest(req.id)
      expect(result?.status).toBe(RequestStatus.Approved)
      expect(result?.groupId).toBe('group-1')
    })
  })
})
