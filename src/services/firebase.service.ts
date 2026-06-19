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

const scrubDocumentId = (value: string) =>
  value.replace(/[.#$[\]/]/g, '_').replace(/\s+/g, '_');

const createConversationTitle = (messages: ChatMessage[]) => {
  const firstUserMessage = messages
    .find((message) => message.type_user === 'user')
    ?.message?.trim();
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

  const existingConversation = await getDoc(conversationRef);
  const existingConversationId = existingConversation.exists()
    ? existingConversation.data().conversationId
    : null;
  const persistedConversationId =
    conversationId ??
    existingConversationId ??
    (!roomId ? conversationRef.id : null);

  const title = createConversationTitle(messages);
  const messageTimestamp = Timestamp.now();

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
        ? (existingConversation.data().createdAt ?? messageTimestamp)
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

export type InvoiceTrackerStatus = 'pending' | 'paid';

export interface InvoiceTrackerPaymentDetails {
  payee: string;
  bankName: string;
  bankAccountNumber: string;
  instructions: string;
}

export interface InvoiceTrackerEntry {
  id: string;
  userEmail: string;
  fileName: string;
  vendor: string;
  invoiceNumber: string;
  amount: number | null;
  currency: string;
  dueDate: string;
  paymentDetails: InvoiceTrackerPaymentDetails;
  status: InvoiceTrackerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceTrackerInput = Omit<
  InvoiceTrackerEntry,
  'createdAt' | 'updatedAt'
>;

const getInvoiceTrackersCollection = async () => {
  const db = getFirestoreDb();
  const firebaseUser = await waitForFirebaseUser();
  const userDoc = doc(db, 'users', firebaseUser.uid);

  return collection(userDoc, 'invoiceTrackers');
};

export const saveInvoiceTrackerEntriesToFirestore = async (
  entries: InvoiceTrackerInput[],
): Promise<void> => {
  if (!entries.length) return;

  const trackersCollection = await getInvoiceTrackersCollection();
  const timestamp = Timestamp.now();

  await Promise.all(
    entries.map((entry) =>
      setDoc(
        doc(trackersCollection, scrubDocumentId(entry.id)),
        {
          ...entry,
          paymentDetails: {
            payee: entry.paymentDetails.payee,
            bankName: entry.paymentDetails.bankName,
            bankAccountNumber: entry.paymentDetails.bankAccountNumber,
            instructions: entry.paymentDetails.instructions,
          },
          createdAt: timestamp,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ),
    ),
  );
};

export const loadInvoiceTrackerEntriesFromFirestore = async (
  userEmail: string,
): Promise<InvoiceTrackerEntry[]> => {
  try {
    const trackersCollection = await getInvoiceTrackersCollection();
    const q = query(trackersCollection, orderBy('dueDate', 'asc'), limit(100));
    const querySnapshot = await getDocs(q);
    const entries: InvoiceTrackerEntry[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();

      entries.push({
        id: docSnapshot.id,
        userEmail: data.userEmail ?? userEmail,
        fileName: data.fileName ?? '',
        vendor: data.vendor ?? '',
        invoiceNumber: data.invoiceNumber ?? '',
        amount:
          typeof data.amount === 'number' && Number.isFinite(data.amount)
            ? data.amount
            : null,
        currency: data.currency ?? 'USD',
        dueDate: data.dueDate ?? '',
        paymentDetails: {
          payee: data.paymentDetails?.payee ?? '',
          bankName: data.paymentDetails?.bankName ?? '',
          bankAccountNumber: data.paymentDetails?.bankAccountNumber ?? '',
          instructions: data.paymentDetails?.instructions ?? '',
        },
        status: data.status === 'paid' ? 'paid' : 'pending',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });

    return entries;
  } catch (error) {
    console.error(
      'Failed to load invoice tracker entries from Firestore:',
      error,
    );
    return [];
  }
};

export const updateInvoiceTrackerStatusInFirestore = async (
  entryId: string,
  status: InvoiceTrackerStatus,
): Promise<void> => {
  const trackersCollection = await getInvoiceTrackersCollection();

  await setDoc(
    doc(trackersCollection, scrubDocumentId(entryId)),
    {
      status,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const loadConversationsFromFirestore = async (
  userEmail: string,
): Promise<FirestoreConversation[]> => {
  try {
    const db = getFirestoreDb();
    const firebaseUser = await waitForFirebaseUser();
    const userId = firebaseUser.uid;
    const userDoc = doc(db, 'users', userId);
    const conversationsCollection = collection(userDoc, 'conversations');

    const q = query(
      conversationsCollection,
      orderBy('updatedAt', 'desc'),
      limit(50),
    );
    const querySnapshot = await getDocs(q);

    const conversations: FirestoreConversation[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      conversations.push({
        id: doc.id,
        userEmail: data.userEmail,
        roomId: data.roomId,
        conversationId: data.conversationId ?? doc.id,
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

    const q = query(
      conversationsCollection,
      where('roomId', '==', conversationId),
    );
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
        conversationId: data.conversationId ?? documentSnapshot.id,
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
      conversationId: data.conversationId ?? docSnapshot.id,
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
