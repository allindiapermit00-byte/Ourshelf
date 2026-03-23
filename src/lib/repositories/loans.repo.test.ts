import { describe, it, expect, beforeEach } from 'vitest'
import { Timestamp } from 'firebase/firestore'
import { clearFirestoreEmulator } from '@/lib/test-utils/firestore-helpers'
import {
  getLoan,
  listLoansForBorrower,
  listActiveLoansForGroup,
  createLoan,
  updateLoan,
} from './loans.repo'
import { LoanReturnState } from '@/lib/types'
import type { Loan } from '@/lib/types'

const ts = Timestamp.fromDate(new Date('2025-01-01'))
const due1 = Timestamp.fromDate(new Date('2025-02-01'))
const due2 = Timestamp.fromDate(new Date('2025-03-01'))

function makeLoan(overrides: Partial<Omit<Loan, 'id'>> = {}): Omit<Loan, 'id'> {
  return {
    groupId: 'group-1',
    itemId: 'item-1',
    requestId: 'req-1',
    ownerUserId: 'owner-1',
    borrowerUserId: 'borrower-1',
    returnState: LoanReturnState.Lent,
    lentAt: ts,
    createdAt: ts,
    updatedAt: ts,
    ...overrides,
  }
}

describe('loans.repo', () => {
  beforeEach(async () => {
    await clearFirestoreEmulator()
  })

  describe('getLoan', () => {
    it('returns null when the document does not exist', async () => {
      expect(await getLoan('nonexistent-id')).toBeNull()
    })

    it('returns a Loan when the document exists', async () => {
      const loan = await createLoan(makeLoan())
      const result = await getLoan(loan.id)
      expect(result?.groupId).toBe('group-1')
      expect(result?.returnState).toBe(LoanReturnState.Lent)
    })
  })

  describe('createLoan', () => {
    it('returns a Loan with an auto-generated id', async () => {
      const loan = await createLoan(makeLoan())
      expect(loan.id).toBeTruthy()
    })
  })

  describe('listLoansForBorrower', () => {
    it('returns all loans for the borrower', async () => {
      await createLoan(makeLoan({ borrowerUserId: 'b-1' }))
      await createLoan(makeLoan({ borrowerUserId: 'b-1' }))
      await createLoan(makeLoan({ borrowerUserId: 'b-2' }))

      const results = await listLoansForBorrower('b-1')
      expect(results).toHaveLength(2)
      expect(results.every((l) => l.borrowerUserId === 'b-1')).toBe(true)
    })

    it('returns empty array when borrower has no loans', async () => {
      expect(await listLoansForBorrower('nobody')).toHaveLength(0)
    })
  })

  describe('listActiveLoansForGroup', () => {
    it('returns lent and return_pending loans, excludes returned', async () => {
      await createLoan(makeLoan({ groupId: 'g-1', returnState: LoanReturnState.Lent }))
      await createLoan(makeLoan({ groupId: 'g-1', returnState: LoanReturnState.ReturnPending }))
      await createLoan(makeLoan({ groupId: 'g-1', returnState: LoanReturnState.Returned }))

      const results = await listActiveLoansForGroup('g-1')
      expect(results).toHaveLength(2)
      expect(results.every((l) => l.returnState !== LoanReturnState.Returned)).toBe(true)
    })

    it('sorts by dueAt ascending, nulls last', async () => {
      await createLoan(makeLoan({ groupId: 'g-1', dueAt: due2 }))
      await createLoan(makeLoan({ groupId: 'g-1', dueAt: due1 }))
      await createLoan(makeLoan({ groupId: 'g-1' })) // no dueAt

      const results = await listActiveLoansForGroup('g-1')
      expect(results).toHaveLength(3)
      expect(results[0].dueAt?.toMillis()).toBe(due1.toMillis())
      expect(results[1].dueAt?.toMillis()).toBe(due2.toMillis())
      expect(results[2].dueAt).toBeUndefined()
    })

    it('returns empty array when group has no active loans', async () => {
      await createLoan(makeLoan({ groupId: 'g-1', returnState: LoanReturnState.Returned }))
      expect(await listActiveLoansForGroup('g-1')).toHaveLength(0)
    })
  })

  describe('updateLoan', () => {
    it('updates only the specified field', async () => {
      const loan = await createLoan(makeLoan({ returnState: LoanReturnState.Lent }))
      await updateLoan(loan.id, { returnState: LoanReturnState.ReturnPending })
      const result = await getLoan(loan.id)
      expect(result?.returnState).toBe(LoanReturnState.ReturnPending)
      expect(result?.groupId).toBe('group-1')
    })
  })
})
