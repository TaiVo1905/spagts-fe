import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, push, set, remove, get } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBZ_GyuBSDEocEE22R0_NdPopk6lKjvrAI",
  authDomain: "stagts-app2.firebaseapp.com",
  databaseURL: "https://stagts-app2-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "stagts-app2",
  storageBucket: "stagts-app2.firebasestorage.app",
  messagingSenderId: "444869712574",
  appId: "1:444869712574:web:db6d8b2c1b9965ad7f1cef",
  measurementId: "G-0FXFWE29R9"
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
