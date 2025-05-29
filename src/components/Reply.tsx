import React from 'react';
import { User } from '../interface/Interface';

interface ReplyProps {
  reply: {
    id: string;
    content: string;
    createdAt: string;
    replier: User;
    mentionedUsers?: Array<{
      id: string;
      name: string;
      email: string;
    }>;
  };
  currentUser: User;
  onDeleteReply: (replyId: string) => void;
}

const Reply: React.FC<ReplyProps> = ({ reply, currentUser, onDeleteReply }) => {
  const replierInitial = reply.replier.name.charAt(0);
  const replierName = reply.replier.name;
  const replier = reply.replier;

  return (
    <div 
      className="ml-8 mt-2 p-2 bg-white rounded-lg border border-gray-200"
      data-reply-id={reply.id}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center mb-1">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold mr-2">
            {replierInitial}
          </div>
          <div>
            <p className="text-xs font-semibold">{replierName}</p>
            <p className="text-xs text-gray-500">
              {new Date(reply.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {replier.id === currentUser.id && (
          <button
            onClick={() => onDeleteReply(reply.id)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
      <p className="ml-8 text-sm">{reply.content}</p>
      
      {reply.mentionedUsers && reply.mentionedUsers.length > 0 && (
        <div className="ml-8 mt-1 flex flex-wrap gap-1">
          <span className="text-xs text-gray-500">Mentioned:</span>
          {reply.mentionedUsers.map(user => (
            <span key={user.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              @{user.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reply;