/*
 * Data Model
 * debts are collected in a one way direction, A owes B
 *
 * MemDB: {
 *   id: Debt,
 *   id2: Debt,
 *   id3: Debt,
 * }
 *
 * Debt: {
 *   other_id: num
 *   other_id2: num,
 *   other_id3: num,
 * }
*/

class Debt {
  constructor() {
    this.owes = new Map() // k: id, v: num
  }

  addOwes(other) {
    if (this.owes.has(other)) {
      this.owes.set(other, this.owes.get(other) + 1)
    } else {
      this.owes.set(other, 1)
    }
  }

  decrOwes(other) {
    if (this.owes.has(other)) {
      const num = this.owes.get(other) - 1
      if (num <= 0) {
        this.owes.delete(other)
      } else {
        this.owes.set(other, num)
      }
    }
  }

  get(other) {
    return this.owes.get(other)
  }
}

export default class MemDB {
  constructor() {
    this.db = new Map() // k: id, v: Debt
  }

  // ower owes owee, plus 1
  updateOwes({ower, owee}) {
    if (!this.db.has(ower)) {
      this.db.set(ower, new Debt())
    }

    this.db.get(ower).addOwes(owee)
  }

  // ower pays owee, minus 1
  updateOwed({ower, owee}) {
    if (this.db.has(ower)) {
      this.db.get(ower).decrOwes(owee)
    }
  }

  get({me, other}) {
    const results = {}
    if (this.db.has(other)) results.owed = this.db.get(other).get(me)
    if (this.db.has(me)) results.owes = this.db.get(me).get(other)
    return results
  }
}
