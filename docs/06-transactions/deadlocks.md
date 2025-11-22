# Deadlocks

A deadlock occurs when two transactions wait for each other's locks.

## Example

Transaction A locks row 1, wants row 2
Transaction B locks row 2, wants row 1
→ Deadlock!

## Prevention

- Lock resources in consistent order
- Use timeout mechanisms
- Deadlock detection and resolution

---

**Next**: [Recovery and Logging](recovery.md)
