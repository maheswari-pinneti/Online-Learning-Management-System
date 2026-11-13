import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Star,
  BookOpen,
  Edit,
  Trash2,
  Mail,
  Award,
  Link2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useInstructors } from '@/context/InstructorContext';
import { useAuth } from '@/context/AuthContext';
import { Instructor } from '@/types';
import { InstructorFormData } from '@/utils/validators';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Modal } from '@/components/common/Modal';
import { InstructorModal } from './InstructorModal';
import { AssignCourseModal } from './AssignCourseModal';

export const InstructorList: React.FC = () => {
  const { instructors, addInstructor, updateInstructor, deleteInstructor, assignCourseToInstructor } =
    useInstructors();
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [deletingInstructorId, setDeletingInstructorId] = useState<string | null>(null);
  const [assigningInstructor, setAssigningInstructor] = useState<Instructor | null>(null);

  const filteredInstructors = useMemo(() => {
    return instructors.filter((inst) => {
      return (
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [instructors, searchQuery]);

  const handleAddSubmit = (data: InstructorFormData) => {
    addInstructor(data);
    toast.success(`Instructor "${data.name}" added to faculty!`);
  };

  const handleEditSubmit = (data: InstructorFormData) => {
    if (!editingInstructor) return;
    updateInstructor(editingInstructor.id, data);
    setEditingInstructor(null);
    toast.success('Instructor credentials updated!');
  };

  const confirmDelete = () => {
    if (deletingInstructorId) {
      deleteInstructor(deletingInstructorId);
      setDeletingInstructorId(null);
      toast.success('Instructor removed from faculty.');
    }
  };

  const handleAssignCourse = (instructorId: string, courseId: string) => {
    assignCourseToInstructor(instructorId, courseId);
    toast.success('Course assigned to instructor successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Faculty & Instructors
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse our subject matter experts, assign courses, and inspect faculty credentials
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Instructor
          </Button>
        )}
      </div>

      {/* Search Input */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by instructor name, domain, or email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </Card>

      {/* Instructor Grid */}
      {filteredInstructors.length === 0 ? (
        <EmptyState
          title="No instructors found"
          description="No faculty members matched your criteria. You can register a new instructor profile."
          actionText="Clear Filter"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((inst) => (
            <Card key={inst.id} className="p-5 flex flex-col justify-between group" hover>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={inst.profileImage}
                    alt={inst.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/30 flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <Link to={`/instructors/${inst.id}`}>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate hover:text-brand-600 transition-colors">
                          {inst.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{inst.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-brand-600 dark:text-brand-400 font-medium truncate mt-0.5">
                      {inst.specialization}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{inst.email}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {inst.bio}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                    <Award className="w-3.5 h-3.5 text-brand-600" />
                    <span>{inst.experienceYears} yrs experience</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>{inst.assignedCourseIds?.length || 0} courses</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link to={`/instructors/${inst.id}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5"
                      onClick={() => setAssigningInstructor(inst)}
                      title="Assign Courses"
                    >
                      <Link2 className="w-4 h-4 text-emerald-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5"
                      onClick={() => setEditingInstructor(inst)}
                      title="Edit Instructor"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5"
                      onClick={() => setDeletingInstructorId(inst.id)}
                      title="Delete Instructor"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <InstructorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      {/* Edit Modal */}
      <InstructorModal
        isOpen={!!editingInstructor}
        onClose={() => setEditingInstructor(null)}
        onSubmit={handleEditSubmit}
        initialInstructor={editingInstructor}
      />

      {/* Assign Course Modal */}
      <AssignCourseModal
        isOpen={!!assigningInstructor}
        onClose={() => setAssigningInstructor(null)}
        instructor={assigningInstructor}
        onAssign={handleAssignCourse}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingInstructorId}
        onClose={() => setDeletingInstructorId(null)}
        title="Confirm Faculty Removal"
        description="Are you sure you want to remove this instructor? Their assigned courses will remain in the catalog."
      >
        <div className="flex justify-end gap-2.5 pt-4">
          <Button variant="outline" onClick={() => setDeletingInstructorId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Remove Instructor
          </Button>
        </div>
      </Modal>
    </div>
  );
};
