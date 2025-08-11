# WoltFlow Version Roadmap

## Current Version: V0.1

### Current Workflow

1. **User Authentication**: Users authenticate with their personal Google accounts
2. **Wolt Account Integration**: Each user provides their personal Wolt access tokens
3. **Gift Card Purchase**: Uses user's Cibus credentials to purchase gift cards
4. **Code Retrieval**: Gmail API accesses each user's personal Gmail to extract gift card codes
5. **Code Application**: Applies retrieved codes to user's personal Wolt account

### Current Limitations

- **Gmail API Cost**: Requires CASA certificates which are expensive

---

## Next Version: V0.2

### Redesigned Workflow

1. **User Authentication**: Users authenticate via Google OAuth2 for platform access
2. **Centralized Wolt Integration**: Single WoltFlow service account handles all Wolt operations
3. **Gift Card Purchase**: Still uses individual user Cibus credentials
4. **Centralized Code Retrieval**: WoltFlow service Gmail receives and processes all codes
5. **Code Distribution**: Intelligent routing applies codes to correct user Wolt accounts

### Key Changes

#### Before (V0.1): Decentralized Model

```
User A: Login to User A's Wolt → Buy Gift Card via User A's Cibus →
        Retrieve Code from User A's Gmail → Apply Code to User A's Wolt

User B: Login to User B's Wolt → Buy Gift Card via User B's Cibus →
        Retrieve Code from User B's Gmail → Apply Code to User B's Wolt

User C: Login to User C's Wolt → Buy Gift Card via User C's Cibus →
        Retrieve Code from User C's Gmail → Apply Code to User C's Wolt
```

#### After (V0.2): Centralized Model

```
User A: Login to WoltFlow Wolt → Buy Gift Card via User A's Cibus →
        Get Code from WoltFlow Email → Apply Code to User A's Wolt

User B: Login to WoltFlow Wolt → Buy Gift Card via User B's Cibus →
        Get Code from WoltFlow Email → Apply Code to User B's Wolt

User C: Login to WoltFlow Wolt → Buy Gift Card via User C's Cibus →
        Get Code from WoltFlow Email → Apply Code to User C's Wolt
```

### Benefits

- **Cost Elimination**: no CASA certificates needed

### Risk Mitigation

- **Purchase Tracking**: Comprehensive logging of all purchase requests with timestamps
- **Code Attribution**: Multi-factor matching using purchase time, amount, and user metadata
- **Verification Systems**: Multiple validation steps to prevent code misallocation
- **Error Recovery**: Documented processes for handling incorrect code applications

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Next Review**: Q1 2025
