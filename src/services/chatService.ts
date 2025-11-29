// src/services/chatService.ts
import { db } from '@/firebaseConfig';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  roomId: string;
}

export const sendMessage = async (roomId: string, senderId: string, content: string): Promise<void> => {
  try {
    await addDoc(collection(db, 'messages'), {
      senderId,
      content,
      timestamp: Timestamp.now(),
      roomId
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const subscribeToMessages = (
  roomId: string,
  onMessagesUpdate: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('roomId', '==', roomId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId,
        content: data.content,
        timestamp: data.timestamp?.toDate() || new Date(),
        roomId: data.roomId
      } as Message;
    });
    onMessagesUpdate(messages);
  });
};
