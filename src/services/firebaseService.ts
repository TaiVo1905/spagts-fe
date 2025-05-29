import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, push, set, remove, get } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCX80cGEqOFNrUglvAYre7YQ3MEZY1GPa4",
  authDomain: "spagts-app.firebaseapp.com",
  databaseURL: "https://spagts-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spagts-app",
  storageBucket: "spagts-app.firebasestorage.app",
  messagingSenderId: "774889920045",
  appId: "1:774889920045:web:06eb70b27e3ef644904aa4",
  measurementId: "G-F8X0V4K9SJ"
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
