import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import Comment from './Comment';
import { ref, onValue, off, push, remove } from 'firebase/database';
import { database } from '../services/firebaseService';

interface CommentPopoverProps {
  commentableType: string;
  commentableId: number;
  fieldName: string;
  row: number;
  onClose: () => void;
}

const CommentPopover: React.FC<CommentPopoverProps> = ({
  commentableType,
  commentableId,
  fieldName,
  row,
  onClose,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!user) return;

    
    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}`;
    const commentsRef = ref(database, path);
    
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const commentsData = snapshot.val();
      if (!commentsData) {
        setComments([]);
        return;
      }

      
      const commentsArray = Object.entries(commentsData).map(([firebaseId, comment]: [string, any]) => ({
        id: `${commentableId}-${fieldName}-${row}-${firebaseId}`,
        firebaseId,
        content: comment.content || '',
        createdAt: comment.createdAt || new Date().toISOString(),
        commenter: {
          id: comment.commenter?.id || 'unknown',
          name: comment.commenter?.name || 'Unknown User',
          email: comment.commenter?.email || '',
          roles: comment.commenter?.roles || [],
          imageUrl: comment.commenter?.imageUrl || ''
        }
      }));

      setComments(commentsArray);
    });

    return () => {
      off(commentsRef);
      unsubscribe();
    };
  }, [commentableType, commentableId, fieldName, row, user]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}`;
    const commentsRef = ref(database, path);
    
    const newCommentData = {
      content: newComment,
      createdAt: new Date().toISOString(),
      commenter: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        imageUrl: user.imageUrl
      }
    };

    await push(commentsRef, newCommentData);
    setNewComment('');
  };

  const handleDeleteComment = async (firebaseId: string) => {
    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${firebaseId}`;
    const commentRef = ref(database, path);
    await remove(commentRef);
  };

  const handleAddReply = async (commentId: string, content: string) => {
    if (!content.trim() || !user) return;

    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}/replies`;
    const repliesRef = ref(database, path);
    
    const newReplyData = {
      content,
      createdAt: new Date().toISOString(),
      replier: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        imageUrl: user.imageUrl
      }
    };

    await push(repliesRef, newReplyData);
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!user) return;

    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}/replies/${replyId}`;
    const replyRef = ref(database, path);
    await remove(replyRef);
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-96 max-h-[400px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={user}
            onAddReply={(content) => handleAddReply(comment.firebaseId, content)}
            onDeleteComment={() => handleDeleteComment(comment.firebaseId)}
            onDeleteReply={(replyId) => handleDeleteReply(comment.firebaseId, replyId)}
            commentableType={commentableType}
            commentableId={commentableId}
            fieldName={fieldName}
            row={row}
          />
        ))}
      </div>

      <div className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className={`px-4 py-2 rounded-md ${
              newComment.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentPopover;