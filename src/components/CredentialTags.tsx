import React, { useState } from 'react';
import { Tag, Plus, X, Hash } from 'lucide-react';

interface CredentialTagsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: string[];
}

export const CredentialTags: React.FC<CredentialTagsProps> = ({
  tags,
  onTagsChange,
  availableTags = []
}) => {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setNewTag('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(newTag);
    }
  };

  const suggestedTags = availableTags.filter(tag => 
    !tags.includes(tag) && 
    tag.toLowerCase().includes(newTag.toLowerCase())
  );

  const commonTags = [
    'production', 'staging', 'development', 'testing',
    'frontend', 'backend', 'database', 'api',
    'critical', 'temporary', 'readonly', 'admin'
  ];

  const filteredCommonTags = commonTags.filter(tag => 
    !tags.includes(tag) && 
    tag.toLowerCase().includes(newTag.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
          >
            <Hash size={12} />
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 ml-1"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-gray-400" />
          <input
            type="text"
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(newTag.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Add tags (press Enter or comma to add)"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          />
          <button
            onClick={() => addTag(newTag)}
            disabled={!newTag.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {showSuggestions && (suggestedTags.length > 0 || filteredCommonTags.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {suggestedTags.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Previously Used</div>
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Hash size={12} className="inline mr-2" />
                    {tag}
                  </button>
                ))}
              </div>
            )}
            
            {filteredCommonTags.length > 0 && (
              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Common Tags</div>
                {filteredCommonTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Hash size={12} className="inline mr-2" />
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};