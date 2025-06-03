import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, push, set, remove, get } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);

export const listenToComments = (
  commentableType: string,
  commentableId: number,
  fieldName: string,
  row: number,
  callback: (comments: any) => void
) => {
  const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}`;
  const commentsRef = ref(database, path);
  
  const unsubscribe = onValue(commentsRef, (snapshot) => {
    const commentsData = snapshot.val();
    callback(commentsData);
  });

  return unsubscribe;
};

export const addComment = async (
  commentableType: string,
  commentableId: number,
  fieldName: string,
  row: number,
  comment: any
) => {
  const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}`;
  const commentsRef = ref(database, path);
  const newCommentRef = push(commentsRef);
  await set(newCommentRef, comment);
  return newCommentRef.key;
};

export const deleteComment = async (
  commentableType: string,
  commentableId: number,
  fieldName: string,
  row: number,
  commentId: string
) => {
  const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}`;
  const commentRef = ref(database, path);
  await remove(commentRef);
};

export const listenToReplies = (
  commentableType: string,
  commentableId: number,
  fieldName: string,
  row: number,
  commentId: string,
  callback: (replies: any) => void
) => {
  const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}/replies`;
  const repliesRef = ref(database, path);
  
  return onValue(repliesRef, (snapshot) => {
    const repliesData = snapshot.val();
    callback(repliesData || {});
  });
};

export const addReply = async (
  commentableType: string,
  commentableId: number,
  fieldName: string,
  row: number,
  commentId: string,
  reply: any
) => {
  const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}/replies`;
  const repliesRef = ref(database, path);
  const newReplyRef = push(repliesRef);
  await set(newReplyRef, reply);
  return newReplyRef.key;
};

export const deleteReply = async (
  commentableType: string,
  commentableId: number,
  fieldName: string,
  row: number,
  commentId: string,
  replyId: string
) => {
  const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}/replies/${replyId}`;
  const replyRef = ref(database, path);
  await remove(replyRef);
};

export const getComment = async (
  commentableType: string,
  commentableId: number,
  fieldName: string,
  row: number,
  commentId: string
) => {
  const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}`;
  const commentRef = ref(database, path);
  const snapshot = await get(commentRef);
  return snapshot.val();
};

export const getReply = async (
  commentableType: string,
  commentableId: number,
  fieldName: string,
  row: number,
  commentId: string,
  replyId: string
) => {
  const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}/replies/${replyId}`;
  const replyRef = ref(database, path);
  const snapshot = await get(replyRef);
  return snapshot.val();
};
