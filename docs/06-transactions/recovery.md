# Recovery and Logging

Recovery mechanisms ensure durability and enable restoration after failures.

## Transaction Log

All changes logged before committing to disk.

## Recovery Process

1. **Undo**: Rollback uncommitted transactions
2. **Redo**: Replay committed transactions

## Checkpoints

Periodic save points reduce recovery time.

---

**Next Chapter**: [NoSQL Databases](../07-nosql/index.md)
