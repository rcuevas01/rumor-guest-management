"use client";

import { useState } from 'react';
import { useGuestStore } from '@/store/useGuestStore';
import Drawer from '@/components/ui/Drawer';

interface TagsModalProps {
  guestIds: string[];
  onClose: () => void;
}

export function TagsModal({ guestIds, onClose }: TagsModalProps) {
  const { tags, updateGuestTags, addTag } = useGuestStore();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (selectedTags.length === 0) return;
    
    try {
      setIsSubmitting(true);
      // Pass an empty array as tagsToRemove to ensure the API call is properly formatted
      await updateGuestTags(guestIds, selectedTags, []);
      onClose();
    } catch (error) {
      console.error('Error updating tags:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    
    // Check if tag already exists
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.trim().toLowerCase())) {
      // If it does, just select it
      const existingTagName = tags.find(tag => 
        tag.name.toLowerCase() === newTagName.trim().toLowerCase()
      )?.name;
      
      if (existingTagName && !selectedTags.includes(existingTagName)) {
        setSelectedTags(prev => [...prev, existingTagName]);
      }
      
      setNewTagName('');
      return;
    }
    
    const newTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
    };
    
    addTag(newTag);
    setSelectedTags([...selectedTags, newTag.name]);
    setNewTagName('');
  };
  
  const drawerContent = (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6">
        <p className="text-text-secondary mb-4">
          Add tags to {guestIds.length} selected guest{guestIds.length !== 1 ? 's' : ''}
        </p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Select Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-3 border border-border rounded-md bg-background-subtle">
              {tags.length === 0 ? (
                <p className="text-sm text-text-secondary italic">No tags available</p>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      if (selectedTags.includes(tag.name)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag.name));
                      } else {
                        setSelectedTags([...selectedTags, tag.name]);
                      }
                    }}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTags.includes(tag.name)
                        ? 'bg-primary text-text-inverted'
                        : 'bg-background-muted text-text-secondary hover:bg-background-hover'
                    }`}
                    style={selectedTags.includes(tag.name) ? {} : { backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.name}
                  </button>
                ))
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Create New Tag
            </label>
            <div className="flex">
              <input
                type="text"
                className="flex-1 border-border rounded-l-md shadow-sm focus:border-primary focus:ring-primary dark:bg-background-subtle"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTagName.trim()) {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleCreateTag}
                disabled={!newTagName.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-text-inverted bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-primary-muted disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md shadow-sm text-text-secondary bg-background hover:bg-background-subtle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedTags.length === 0 || isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-text-inverted ${
            selectedTags.length === 0 || isSubmitting
              ? 'bg-primary-muted cursor-not-allowed'
              : 'bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Applying...
            </>
          ) : (
            'Apply Tags'
          )}
        </button>
      </div>
    </div>
  );
  
  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title="Manage Tags"
    >
      {drawerContent}
    </Drawer>
  );
}