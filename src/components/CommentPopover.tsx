import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/AuthContext';
import Comment from './Comment';
import { ref, onValue, off, push, remove } from 'firebase/database';
import { database } from '../services/firebaseService';
import UserMentionDropdown from './UserMentionDropdown';
import toast from 'react-hot-toast';
import userService from '../services/userService'; 

interface CommentPopoverProps {
  semester: number
  commentableType: string;
  commentableId: number;
  fieldName: string;
  row: number;
  onClose: () => void;
}

const CommentPopover: React.FC<CommentPopoverProps> = ({
  semester,
  commentableType,
  commentableId,
  fieldName,
  row,
  onClose,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [showUserMention, setShowUserMention] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!user) return;

    
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
    setCommentContent(value);

    
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const atSymbolIndex = textBeforeCursor.lastIndexOf('@');

    if (atSymbolIndex >= 0) {
      const query = textBeforeCursor.substring(atSymbolIndex + 1);
      mentionedUsers.forEach((mentionedUser, index) => {
        if(!textBeforeCursor.includes('@' + mentionedUser.name)) {
          if(index = mentionedUsers.length) mentionedUsers.pop();
          mentionedUsers.slice(index, index + 1);
        }
      })
    if(query.includes(' ') && (textBeforeCursor.split('@').length - 1 == mentionedUsers.length)){
      setShowUserMention(false);
      return;
    } 
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
    const textBeforeCursor = commentContent.substring(0, cursorPos);
    const atSymbolIndex = textBeforeCursor.lastIndexOf('@');

    if (atSymbolIndex >= 0) {
      const newText = 
        commentContent.substring(0, atSymbolIndex) + 
        `@${selectedUser.name} ` +
        commentContent.substring(cursorPos);

      setCommentContent(newText);
      setMentionedUsers([...mentionedUsers, selectedUser]);
      setShowUserMention(false);
      
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = atSymbolIndex + selectedUser.name.length + 2;
        textarea.selectionEnd = atSymbolIndex + selectedUser.name.length + 2;
      }, 0);
    }
  };

  const handleAddComment = async (semester: number) => {
    if (!commentContent.trim() || !user) return;

    const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}`;
    const commentsRef = ref(database, path);
    
    const newCommentData = {
      content: commentContent,
      createdAt: new Date().toISOString(),
      commenter: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        imageUrl: user.imageUrl
      },
      mentionedUsers: mentionedUsers
    };

    try {
      const commentRef = await push(commentsRef, newCommentData);
      setCommentContent('');
      setMentionedUsers([]);

      
      mentionedUsers.forEach(mentionedUser => {
        if (mentionedUser.id !== user.id) {
          const notificationPath = `notifications/${mentionedUser.id}`;
          const notificationRef = ref(database, notificationPath);
          push(notificationRef, {
            type: 'mention',
            message: `${user.name} mentioned you in a comment`,
            createdAt: new Date().toISOString(),
            read: false,
            data: {
              commentableType,
              commentableId,
              fieldName,
              row,
              commentId: commentRef.key,
              semester: semester
            }
          });
        }
      });

      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', error);
    }
  };

  const handleAddReply = async (commentId: string, content: string, mentionedUsers: any[], semester: number) => {
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
      mentionedUsers: mentionedUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name
      }))
    };

    try {
      const replyRef = await push(repliesRef, newReplyData);

      
      mentionedUsers.forEach(mentionedUser => {
        if (mentionedUser.id !== user.id) {
          const notificationPath = `notifications/${mentionedUser.id}`;
          const notificationRef = ref(database, notificationPath);
          push(notificationRef, {
            type: 'mention',
            message: `${user.name} mentioned you in a reply`,
            createdAt: new Date().toISOString(),
            read: false,
            data: {
              commentableType,
              commentableId,
              fieldName,
              row,
              commentId,
              replyId: replyRef.key,
              semester: semester
            }
          });
        }
      });

      toast.success('Reply added successfully');
    } catch (error) {
      toast.error('Failed to add reply');
      console.error('Error adding reply:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}`;
      const commentRef = ref(database, path);
      await remove(commentRef);
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
      console.error('Error deleting comment:', error);
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!user) return;

    try {
      const path = `comments/${commentableType}/${commentableId}/${fieldName}/${row}/${commentId}/replies/${replyId}`;
      const replyRef = ref(database, path);
      await remove(replyRef);
      toast.success('Reply deleted successfully');
    } catch (error) {
      toast.error('Failed to delete reply');
      console.error('Error deleting reply:', error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.id !== user?.id && 
    (u.email.toLowerCase().includes(mentionQuery.toLowerCase()) || 
     u.name.toLowerCase().includes(mentionQuery.toLowerCase()))
  );

  return (
    <div className="absolute z-50 w-80 bg-white shadow-xl rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">Comments</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="max-h-64 overflow-y-auto mb-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={user!}
              onAddReply={(commentFirebaseId, content, mentionedUsers, semster) => handleAddReply(commentFirebaseId, content, mentionedUsers, semester)}
              onDeleteComment={() => handleDeleteComment(comment.firebaseId)}
              onDeleteReply={(replyId) => handleDeleteReply(comment.firebaseId, replyId)}
              commentableType={commentableType}
              commentableId={commentableId}
              fieldName={fieldName}
              row={row}
              users={users}
            />
          ))
        )}
      </div>
      
      <div className="relative border-t border-gray-200 pt-3">
        <textarea
          ref={textareaRef}
          value={commentContent}
          onChange={handleTextareaChange}
          placeholder="Add a comment..."
          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
        {showUserMention && (
          <UserMentionDropdown
            users={filteredUsers}
            onSelect={handleUserSelect}
            onClose={() => setShowUserMention(false)}
          />
        )}
        <div className="flex justify-end mt-2">
          <button
            onClick={()=> handleAddComment(semester)}
            disabled={!commentContent.trim()}
            className={`px-3 py-1 text-sm rounded-md ${
              commentContent.trim()
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