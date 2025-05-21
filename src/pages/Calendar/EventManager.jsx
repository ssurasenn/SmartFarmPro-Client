import React from 'react';
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Dialog from "../../components/ui/Dialog";
import Label from "../../components/ui/Label";
import { MdDeleteForever } from "react-icons/md";

const EventManager = ({ formData, setFormData, onSave, onDelete, isEditing }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded shadow-md w-full md:max-w-sm">
      <h2 className="text-lg font-semibold mb-4">{isEditing ? '✏️ Edit Event' : '➕ New Event'}</h2>

      <div className="space-y-2 text-sm">
        <div>
          <Label>Title</Label>
          <Input name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div>
          <Label>Start</Label>
          <Input name="start" type="datetime-local" value={formData.start} onChange={handleChange} />
        </div>

        <div>
          <Label>End</Label>
          <Input name="end" type="datetime-local" value={formData.end} onChange={handleChange} />
        </div>

        <div>
          <Label>Type</Label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">-- Select Type --</option>
            <option value="meeting">📅 Meeting</option>
            <option value="task">✅ Task</option>
            <option value="personal">👤 Personal</option>
            <option value="other">✨ Other</option>
          </select>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full" onClick={onSave}>
            {isEditing ? '✏️ Update' : '⬆️ Add'}
          </Button>
          {isEditing && (
            <Button variant="destructive" onClick={onDelete} className="px-3">
              <MdDeleteForever size={20} className="mr-2" /> Delete
            </Button>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default EventManager;
