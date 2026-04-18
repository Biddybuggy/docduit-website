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
import { firebaseFirestore } from '@/lib/firebase';
import { ChatMessage } from '@/context/ChatContext';

const scrubId = (value: string) =>
  value.replace(/[.#$[\]/]/g, '_').replace(/\s+/g, '_').toLowerCase();

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

export const saveConversationToFirestore = async (
  userEmail: string,
  messages: ChatMessage[],
  roomId?: string | null,
  conversationId?: string | null,
): Promise<string> => {
  const db = getFirestoreDb();
  const userId = scrubId(userEmail);
  const userDoc = doc(db, 'users', userId);
  const conversationsCollection = collection(userDoc, 'conversations');

  const conversationDocId = roomId
    ? scrubId(roomId)
    : conversationId
    ? scrubId(conversationId)
    : undefined;

  const conversationRef: DocumentReference = conversationDocId
    ? doc(conversationsCollection, conversationDocId)
    : doc(conversationsCollection);

  const title = createConversationTitle(messages);
  const messageTimestamp = Timestamp.now();
  const existingConversation = await getDoc(conversationRef);

  await setDoc(
    conversationRef,
    {
      userEmail,
      roomId: roomId ?? null,
      conversationId: conversationId ?? null,
      title: title ?? null,
      messages: messages.map((message) => ({
        type_user: message.type_user,
        message: message.message,
        conversation_id: message.conversation_id ?? null,
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
    const userId = scrubId(userEmail);
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
    const userId = scrubId(userEmail);
    const userDocRef = doc(db, 'users', userId);
    const conversationsCollection = collection(userDocRef, 'conversations');

    const q = query(conversationsCollection, where('roomId', '==', conversationId));
    let querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      const documentRef = doc(conversationsCollection, scrubId(conversationId));
      const documentSnapshot = await getDoc(documentRef);

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
