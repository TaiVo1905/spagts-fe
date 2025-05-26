import React, { useState, useEffect } from 'react';
import { User } from '../interface/Interface';
import Reply from './Reply';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../services/firebaseService';

interface CommentProps {
  comment: {
    id: string;
    firebaseId: string;
    content: string;
    createdAt: string;
    commenter: User;
    replies?: Array<{
      id: string;
      content: string;
      createdAt: string;
      replier: User;
    }>;
  };
  currentUser: User;
  onAddReply: (content: string) => void;
  onDeleteComment: () => void;
  onDeleteReply: (replyId: string) => void;
  commentableType: string;
  commentableId: number;
  fieldName: string;
  row: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  currentUser,
  onAddReply,
  onDeleteComment,
  onDeleteReply,
  commentableType,
  commentableId,
  fieldName,
  row,
}) => {
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState<Array<{
    id: string;
    content: string;
    createdAt: string;
    replier: User;
  }>>([]);

  useEffect(() => {
    if (!comment.firebaseId) return;
    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${comment.firebaseId}/replies`;
    const repliesRef = ref(database, path);
    
    const unsubscribe = onValue(repliesRef, (snapshot) => {
      const repliesData = snapshot.val();
      if (!repliesData) {
        setReplies([]);
        return;
      }

      
      const repliesArray = Object.entries(repliesData).map(([id, reply]: [string, any]) => {
        const replier = reply.replier || {};
        return {
          id,
          content: reply.content,
          createdAt: reply.createdAt,
          replier: {
            id: replier.id || 'unknown',
            name: replier.name || 'Unknown User',
            email: replier.email || '',
            roles: replier.roles || [],
            imageUrl: replier.imageUrl || ''
          }
        };
      });

      setReplies(repliesArray);
    });

    return () => {
      off(repliesRef);
      unsubscribe();
    };
  }, [comment.firebaseId, commentableType, commentableId, fieldName, row]);

  const handleAddReply = () => {
    if (replyContent.trim()) {
      onAddReply(replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  
  const commenter = comment?.commenter || {};
  const commenterName = commenter.name || 'Unknown User';
  const commenterInitial = commenterName.charAt(0);

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-2">
            {commenterInitial}
          </div>
          <div>
            <p className="text-sm font-semibold">{commenterName}</p>
            <p className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {commenter.id === currentUser?.id && (
          <button
            onClick={onDeleteComment}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
      <p className="ml-10 text-sm mb-3">{comment.content}</p>
      
      <div className="ml-10">
        {replies.map((reply) => (
          <Reply
            key={reply.id}
            reply={reply}
            currentUser={currentUser}
            onDeleteReply={onDeleteReply}
          />
        ))}
        
        {!isReplying ? (
          <button
            onClick={() => setIsReplying(true)}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Reply
          </button>
        ) : (
          <div className="mt-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="flex justify-end space-x-2 mt-1">
              <button
                onClick={() => setIsReplying(false)}
                className="px-3 py-1 text-xs bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReply}
                disabled={!replyContent.trim()}
                className={`px-3 py-1 text-xs rounded-md ${
                  replyContent.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;