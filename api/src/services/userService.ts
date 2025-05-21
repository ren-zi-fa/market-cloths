import { db } from '../config/firebase'
import { Role } from '../types'

export async function createUser({
   email,
   username,
   password,
   role,
   makanan_favorite
}: {
   email: string
   username: string
   password: string
   role: Role
   makanan_favorite: string
}) {
   return db.collection('user').add({
      email,
      username,
      role,
      password,
      makanan_favorite
   })
}
export async function findUserByLoginName(login_name: string) {
   const isEmail = /@(gmail|yahoo|outlook|icloud)\.com$/.test(login_name)
   let userQuery

   if (isEmail) {
      userQuery = db
         .collection('user')
         .where('email', '==', login_name)
         .limit(1)
   } else {
      userQuery = db
         .collection('user')
         .where('username', '==', login_name)
         .limit(1)
   }
   const userSnapshot = await userQuery.get()
   if (userSnapshot.empty) return null

   const userDoc = userSnapshot.docs[0]
   return { userId: userDoc.id, user: userDoc.data() }
}

export async function isUserExist(email: string, username: string) {
   const emailSnap = await db
      .collection('user')
      .where('email', '==', email)
      .limit(1)
      .get()
   if (!emailSnap.empty) return true
   const usernameSnap = await db
      .collection('user')
      .where('username', '==', username)
      .limit(1)
      .get()
   return !usernameSnap.empty
}

export async function saveRefreshToken(refresh_token: string, userId: string) {
   const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
   const createdAt = new Date()

   await db.collection('refresh_tokens').add({
      token: refresh_token,
      userId,
      expiresAt,
      revoke: false,
      createdAt
   })
}

export async function revokeRefreshToken(refresh_token: string) {
   const tokenSnap = await db
      .collection('refresh_tokens')
      .where('token', '==', refresh_token)
      .limit(1)
      .get()
   if (!tokenSnap.empty) {
      const docId = tokenSnap.docs[0].id
      await db.collection('refresh_tokens').doc(docId).update({ revoke: true })
      return true
   }
   return false
}

export async function findValidRefreshToken(token: string) {
   const snap = await db
      .collection('refresh_tokens')
      .where('token', '==', token)
      .where('revoke', '==', false)
      .limit(1)
      .get()
   if (snap.empty) return null
   return snap.docs[0].data()
}

export async function checkRefreshToken(userId: string): Promise<boolean> {
   const snap = await db
      .collection('refresh_tokens')
      .where('userId', '==', userId)
      .where('revoke', '==', false)
      .limit(1)
      .get()

   return !snap.empty
}
export async function deleteRefreshToken(
   userId: string,
   revoke: boolean
): Promise<void> {
   if (revoke === false) {
      const snap = await db
         .collection('refresh_tokens')
         .where('userId', '==', userId)
         .where('revoke', '==', false)
         .get()

      const batch = db.batch()

      snap.docs.forEach((doc) => {
         batch.delete(doc.ref)
      })

      await batch.commit()
   }
}

export async function findUserById(userId: string) {
   const userSnap = await db.collection('user').doc(userId).get()
   if (!userSnap.exists) return null
   const userData = userSnap.data()
   if (!userData) return null
   // Hilangkan password sebelum dikirim
   const { password, ...userWithoutPassword } = userData
   return { userId: userSnap.id, user: userWithoutPassword }
}

export async function getAllUser() {
   const userSnapshot = await db
      .collection('user')
      .where('role', '==', 'user')
      .get()
   const users = userSnapshot.docs.map((doc) => {
      const { password, ...userWithoutPassword } = doc.data()
      return { userId: doc.id, ...userWithoutPassword }
   })
   return users
}
