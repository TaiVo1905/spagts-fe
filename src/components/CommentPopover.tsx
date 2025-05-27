import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/AuthContext';
import Comment from './Comment';
import { ref, onValue, off, push, remove } from 'firebase/database';
import { database } from '../services/firebaseService';
import UserMentionDropdown from './UserMentionDropdown';
import toast from 'react-hot-toast';
import userService from '../services/userService'; // Import your user service

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
  const [showUserMention, setShowUserMention] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!user) return;

    // Load comments
    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}`;
    const commentsRef = ref(database, path);
    
    const unsubscribeComments = onValue(commentsRef, (snapshot) => {
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
        },
        mentionedUsers: comment.mentionedUsers || []
      }));

      setComments(commentsArray);
    });

    return () => {
      off(commentsRef);
      unsubscribeComments();
    };
  }, [commentableType, commentableId, fieldName, row, user]);

  // Load users from API when component mounts or user changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      setIsLoadingUsers(true);
      try {
        const usersData = await userService.getUsers();
        setUsers(usersData.data.data);
      } catch (error) {
        toast.error('Failed to load users');
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Check for @ mention
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const atSymbolIndex = textBeforeCursor.lastIndexOf('@');

    if (atSymbolIndex >= 0) {
      const query = textBeforeCursor.substring(atSymbolIndex + 1);
      setMentionQuery(query);
      setShowUserMention(true);
    } else {
      setShowUserMention(false);
    }
  };

  const handleUserSelect = (selectedUser: any) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = newComment.substring(0, cursorPos);
    const atSymbolIndex = textBeforeCursor.lastIndexOf('@');

    if (atSymbolIndex >= 0) {
      const newText = 
        newComment.substring(0, atSymbolIndex) + 
        `@${selectedUser.name}` + 
        newComment.substring(cursorPos);

      setNewComment(newText);
      setMentionedUsers([...mentionedUsers, selectedUser]);
      setShowUserMention(false);
      
      // Focus back on textarea and set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = atSymbolIndex + selectedUser.name.length + 1;
        textarea.selectionEnd = atSymbolIndex + selectedUser.name.length + 1;
      }, 0);
    }
  };

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
      },
      mentionedUsers: mentionedUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name
      }))
    };

    try {
      const commentRef = await push(commentsRef, newCommentData);
      setNewComment('');
      setMentionedUsers([]);

      // Send notifications to mentioned users
      mentionedUsers.forEach(mentionedUser => {
        if (mentionedUser.id !== user.id) {
          sendNotification(
            mentionedUser.id,
            'mention',
            `${user.name} mentioned you in a comment`,
            {
              commentableType,
              commentableId,
              fieldName,
              row,
              commentId: commentRef.key
            }
          );
        }
      });

      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error(error);
    }
  };

  const handleDeleteComment = async (firebaseId: string) => {
    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${firebaseId}`;
    const commentRef = ref(database, path);
    await remove(commentRef);
    toast.success('Comment deleted successfully');
  };

  const handleAddReply = async (commentId: string, content: string, replyMentionedUsers: any[] = []) => {
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
      },
      mentionedUsers: replyMentionedUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name
      }))
    };

    try {
      const replyRef = await push(repliesRef, newReplyData);

      // Send notifications to mentioned users
      replyMentionedUsers.forEach(mentionedUser => {
        if (mentionedUser.id !== user.id) {
          sendNotification(
            mentionedUser.id,
            'mention',
            `${user.name} mentioned you in a reply`,
            {
              commentableType,
              commentableId,
              fieldName,
              row,
              commentId,
              replyId: replyRef.key
            }
          );
        }
      });

      toast.success('Reply added successfully');
    } catch (error) {
      toast.error('Failed to add reply');
      console.error(error);
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}/replies/${replyId}`;
    const replyRef = ref(database, path);
    await remove(replyRef);
    toast.success('Reply deleted successfully');
  };

  const sendNotification = async (userId: string, type: string, message: string, data: any) => {
    const notificationsRef = ref(database, `notifications/${userId}`);
    await push(notificationsRef, {
      type,
      message,
      data,
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  if (!user) return null;

  // Filter users for mention dropdown
  const filteredUsers = users.filter(u => 
    u.id !== user.id && // Don't show current user
    (u.email.toLowerCase().includes(mentionQuery.toLowerCase()) || 
     u.name.toLowerCase().includes(mentionQuery.toLowerCase()))
  );

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
            onAddReply={handleAddReply}
            onDeleteComment={() => handleDeleteComment(comment.firebaseId)}
            onDeleteReply={(replyId) => handleDeleteReply(comment.firebaseId, replyId)}
            commentableType={commentableType}
            commentableId={commentableId}
            fieldName={fieldName}
            row={row}
            users={users}
          />
        ))}
      </div>

      <div className="mt-4 relative">
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleTextareaChange}
          placeholder="Write a comment..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        {showUserMention && (
          <UserMentionDropdown
            users={filteredUsers}
            onSelect={handleUserSelect}
            onClose={() => setShowUserMention(false)}
            isLoading={isLoadingUsers}
          />
        )}
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