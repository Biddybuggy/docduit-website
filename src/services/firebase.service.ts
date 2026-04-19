import {
  collection,
  doc,
  DocumentReference,
  Timestamp,
  serverTimestamp,
  setDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { firebaseAuth, firebaseFirestore } from '@/lib/firebase';
import { ChatMessage } from '@/context/ChatContext';

const scrubUserId = (value: string) =>
  value.replace(/[.#$[\]/]/g, '_').replace(/\s+/g, '_').toLowerCase();

const scrubDocumentId = (value: string) =>
  value.replace(/[.#$[\]/]/g, '_').replace(/\s+/g, '_');

const createConversationTitle = (messages: ChatMessage[]) => {
  const firstUserMessage = messages.find((message) => message.type_user === 'user')?.message?.trim();
  if (!firstUserMessage) return null;
  return firstUserMessage.length > 50
    ? `${firstUserMessage.substring(0, 50).trim()}...`
    : firstUserMessage;
};

const getFirestoreDb = () => {
  if (!firebaseFirestore) {
    throw new Error('Firebase Firestore is not available in this environment.');
  }
  return firebaseFirestore;
};

const waitForFirebaseUser = async (): Promise<User> => {
  const authInstance = firebaseAuth;

  if (!authInstance) {
    throw new Error('Firebase Auth is not available in this environment.');
  }

  if (authInstance.currentUser) {
    return authInstance.currentUser;
  }

  return new Promise<User>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      unsubscribe();
      reject(new Error('Timed out waiting for Firebase Auth user.'));
    }, 15000);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (!user) return;
      clearTimeout(timeoutId);
      unsubscribe();
      resolve(user);
    });
  });
};

export const saveConversationToFirestore = async (
  userEmail: string,
  messages: ChatMessage[],
  roomId?: string | null,
  conversationId?: string | null,
): Promise<string> => {
  const db = getFirestoreDb();
  const firebaseUser = await waitForFirebaseUser();
  const userId = firebaseUser.uid;
  const userDoc = doc(db, 'users', userId);
  const conversationsCollection = collection(userDoc, 'conversations');

  const conversationDocId = roomId
    ? scrubDocumentId(roomId)
    : conversationId
    ? scrubDocumentId(conversationId)
    : undefined;

  const conversationRef: DocumentReference = conversationDocId
    ? doc(conversationsCollection, conversationDocId)
    : doc(conversationsCollection);

  const persistedConversationId =
    conversationId ?? (!roomId ? conversationRef.id : null);

  const title = createConversationTitle(messages);
  const messageTimestamp = Timestamp.now();
  const existingConversation = await getDoc(conversationRef);

  await setDoc(
    conversationRef,
    {
      firebaseUid: firebaseUser.uid,
      userEmail,
      roomId: roomId ?? null,
      conversationId: persistedConversationId,
      title: title ?? null,
      messages: messages.map((message) => ({
        type_user: message.type_user,
        message: message.message,
        conversation_id:
          message.conversation_id ?? persistedConversationId ?? null,
        room_id: message.room_id ?? null,
        createdAt: messageTimestamp,
      })),
      updatedAt: serverTimestamp(),
      createdAt: existingConversation.exists()
        ? existingConversation.data().createdAt ?? messageTimestamp
        : serverTimestamp(),
    },
    { merge: true },
  );

  return conversationRef.id;
};

export interface FirestoreConversation {
  id: string;
  userEmail: string;
  roomId: string | null;
  conversationId: string | null;
  title?: string | null;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export const loadConversationsFromFirestore = async (
  userEmail: string,
): Promise<FirestoreConversation[]> => {
  try {
    const db = getFirestoreDb();
    const firebaseUser = await waitForFirebaseUser();
    const userId = firebaseUser.uid;
    const userDoc = doc(db, 'users', userId);
    const conversationsCollection = collection(userDoc, 'conversations');

    const q = query(conversationsCollection, orderBy('updatedAt', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);

    const conversations: FirestoreConversation[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      conversations.push({
        id: doc.id,
        userEmail: data.userEmail,
        roomId: data.roomId,
        conversationId: data.conversationId,
        title: data.title ?? null,
        messages: data.messages.map((msg: any) => ({
          type_user: msg.type_user,
          message: msg.message,
          conversation_id: msg.conversation_id,
          room_id: msg.room_id,
        })),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });

    return conversations;
  } catch (error) {
    console.error('Failed to load conversations from Firestore:', error);
    return [];
  }
};

export const loadConversationFromFirestore = async (
  userEmail: string,
  conversationId: string,
): Promise<FirestoreConversation | null> => {
  try {
    const db = getFirestoreDb();
    const firebaseUser = await waitForFirebaseUser();
    const userId = firebaseUser.uid;
    const userDocRef = doc(db, 'users', userId);
    const conversationsCollection = collection(userDocRef, 'conversations');

    const q = query(conversationsCollection, where('roomId', '==', conversationId));
    let querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const conversationQuery = query(
        conversationsCollection,
        where('conversationId', '==', conversationId),
      );
      querySnapshot = await getDocs(conversationQuery);
    }

    if (querySnapshot.empty) {
      const exactDocumentRef = doc(conversationsCollection, conversationId);
      let documentSnapshot = await getDoc(exactDocumentRef);

      if (!documentSnapshot.exists()) {
        const sanitizedConversationId = scrubDocumentId(conversationId);
        if (sanitizedConversationId !== conversationId) {
          const sanitizedDocumentRef = doc(
            conversationsCollection,
            sanitizedConversationId,
          );
          documentSnapshot = await getDoc(sanitizedDocumentRef);
        }
      }

      if (!documentSnapshot.exists()) {
        return null;
      }

      const data = documentSnapshot.data();
      return {
        id: documentSnapshot.id,
        userEmail: data.userEmail,
        roomId: data.roomId,
        conversationId: data.conversationId,
        title: data.title ?? null,
        messages: data.messages.map((msg: any) => ({
          type_user: msg.type_user,
          message: msg.message,
          conversation_id: msg.conversation_id,
          room_id: msg.room_id,
        })),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }

    const docSnapshot = querySnapshot.docs[0];
    const data = docSnapshot.data();

    return {
      id: docSnapshot.id,
      userEmail: data.userEmail,
      roomId: data.roomId,
      conversationId: data.conversationId,
      title: data.title ?? null,
      messages: data.messages.map((msg: any) => ({
        type_user: msg.type_user,
        message: msg.message,
        conversation_id: msg.conversation_id,
        room_id: msg.room_id,
      })),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error('Failed to load conversation from Firestore:', error);
    return null;
  }
};
