import { describe, it, expect } from 'vitest'
import { MemberRole } from './group'
import { ItemType, ItemStatus } from './item'
import { RequestStatus } from './request'
import { LoanReturnState } from './loan'

// These tests are the source of truth for every enum string value.
// If a value changes here, it must also change in Firestore documents and Security Rules.

describe('MemberRole', () => {
  it('Admin equals "admin"', () => {
    expect(MemberRole.Admin).toBe('admin')
  })
  it('Member equals "member"', () => {
    expect(MemberRole.Member).toBe('member')
  })
})

describe('ItemType', () => {
  it('Book equals "book"', () => {
    expect(ItemType.Book).toBe('book')
  })
  it('BoardGame equals "board_game"', () => {
    expect(ItemType.BoardGame).toBe('board_game')
  })
})

describe('ItemStatus', () => {
  it('Available equals "available"', () => {
    expect(ItemStatus.Available).toBe('available')
  })
  it('Requested equals "requested"', () => {
    expect(ItemStatus.Requested).toBe('requested')
  })
  it('Lent equals "lent"', () => {
    expect(ItemStatus.Lent).toBe('lent')
  })
  it('Archived equals "archived"', () => {
    expect(ItemStatus.Archived).toBe('archived')
  })
})

describe('RequestStatus', () => {
  it('Pending equals "pending"', () => {
    expect(RequestStatus.Pending).toBe('pending')
  })
  it('Approved equals "approved"', () => {
    expect(RequestStatus.Approved).toBe('approved')
  })
  it('Declined equals "declined"', () => {
    expect(RequestStatus.Declined).toBe('declined')
  })
  it('Cancelled equals "cancelled"', () => {
    expect(RequestStatus.Cancelled).toBe('cancelled')
  })
})

describe('LoanReturnState', () => {
  it('Lent equals "lent"', () => {
    expect(LoanReturnState.Lent).toBe('lent')
  })
  it('ReturnPending equals "return_pending"', () => {
    expect(LoanReturnState.ReturnPending).toBe('return_pending')
  })
  it('Returned equals "returned"', () => {
    expect(LoanReturnState.Returned).toBe('returned')
  })
})

describe('State machine — valid ItemStatus transitions', () => {
  // Encodes the allowed transitions for documentation and future guard use
  const allowedTransitions: Record<ItemStatus, ItemStatus[]> = {
    [ItemStatus.Available]: [ItemStatus.Requested, ItemStatus.Archived],
    [ItemStatus.Requested]: [ItemStatus.Lent, ItemStatus.Available],
    [ItemStatus.Lent]: [ItemStatus.Available],
    [ItemStatus.Archived]: [],
  }

  it('Available can transition to Requested or Archived', () => {
    expect(allowedTransitions[ItemStatus.Available]).toContain(ItemStatus.Requested)
    expect(allowedTransitions[ItemStatus.Available]).toContain(ItemStatus.Archived)
  })

  it('Lent can only transition back to Available', () => {
    expect(allowedTransitions[ItemStatus.Lent]).toEqual([ItemStatus.Available])
  })

  it('Archived has no outgoing transitions', () => {
    expect(allowedTransitions[ItemStatus.Archived]).toHaveLength(0)
  })
})

describe('State machine — valid LoanReturnState transitions', () => {
  const allowedTransitions: Record<LoanReturnState, LoanReturnState[]> = {
    [LoanReturnState.Lent]: [LoanReturnState.ReturnPending],
    [LoanReturnState.ReturnPending]: [LoanReturnState.Returned],
    [LoanReturnState.Returned]: [],
  }

  it('Lent can only transition to ReturnPending', () => {
    expect(allowedTransitions[LoanReturnState.Lent]).toEqual([LoanReturnState.ReturnPending])
  })

  it('ReturnPending can only transition to Returned', () => {
    expect(allowedTransitions[LoanReturnState.ReturnPending]).toEqual([LoanReturnState.Returned])
  })

  it('Returned has no outgoing transitions', () => {
    expect(allowedTransitions[LoanReturnState.Returned]).toHaveLength(0)
  })
})
