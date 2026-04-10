# Firestore schema

**`users/{userId}`** — `userId` = Firebase Auth UID (or primary key you use for `orders.userId`)  
| Field | Type |
|-------|------|
| name | string |
| phone | string — E.164 (e.g. **`+917010838732`**) — must match login normalization |
| role | string (`admin` \| `user`) — login allows only **`user`** |
| isBlocked | boolean — if `true`, login is rejected |
| createdAt | timestamp |
| updatedAt | timestamp |
| loanSettings | map |

**`loanSettings` (map)**  
| Field | Type |
|-------|------|
| minLimit | number |
| maxLimit | number |
| selectedAmount | number |

---

**`orders/{orderId}`**  
| Field | Type |
|-------|------|
| userId | string (same as `users` doc id) |
| userName | string |
| phone | string |
| loanAmount | number |
| totalDueAmount | number |
| loanDate | timestamp |
| dueDate | timestamp |
| createdAt | timestamp |
| updatedAt | timestamp |
| paymentUrl | string |
| isCompleted | boolean |

The app queries `where('userId', '==', …)` for the signed-in user (session from login/OTP).

---

**`blocked_users/{docId}`**  
| Field | Type |
|-------|------|
| phone | string (E.164, same as `users.phone`) |
| blockedAt | timestamp |

A number is treated as blocked if **`blocked_users/{+91…}`** exists **or** any document has **`phone ==`** that E.164 string.

---

**`admin_settings/config`** (single doc)  
| Field | Type |
|-------|------|
| minLimit | number |
| maxLimit | number |
| defaultInterestRate | number (optional) |
| updatedAt | timestamp |

---

Auth custom claim for admins: `role` = `"admin"`.  
Deploy **`firestore.rules`** with your project. Rules currently allow **open read** on `users`, `orders`, and `blocked_users` for the phone-only client login + order listing — **tighten** when you add Firebase Authentication (`request.auth.uid`).
