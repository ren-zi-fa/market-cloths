import { db } from '../config/firebase'
import { Role } from '../types'

export async function createUser({
   email,
   username,
   password,
   role
}: {
   email: string
   username: string
   password: string
   role: Role
}) {
   return db.collection('user').add({
      email,
      username,
      role,
      password
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
