import React, { useState, useMemo } from 'react';
import { Search, UserPlus, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { useStudents } from '@/context/StudentContext';
import { Student } from '@/types';
import { StudentFormData } from '@/utils/validators';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Modal } from '@/components/common/Modal';
import { StudentModal } from './StudentModal';
import { formatDate } from '@/utils/formatters';

export const StudentList: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  // Paginated Students
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handleAddSubmit = (data: StudentFormData) => {
    addStudent(data);
    toast.success(`Student "${data.fullName}" registered successfully!`);
  };

  const handleEditSubmit = (data: StudentFormData) => {
    if (!editingStudent) return;
    updateStudent(editingStudent.id, data);
    setEditingStudent(null);
    toast.success('Student record updated successfully!');
  };

  const confirmDelete = () => {
    if (deletingStudentId) {
      deleteStudent(deletingStudentId);
      setDeletingStudentId(null);
      toast.success('Student removed from system.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Student Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain learner records, qualifications, contact profiles, and enrollment history
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Add Student
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by full name, email, qualification, or phone..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Learner Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Student Table */}
      {paginatedStudents.length === 0 ? (
        <EmptyState
          title="No students found"
          description="No student profiles matched your active query. You can add a new student using the button above."
          actionText="Clear Filter"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('All');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/80 uppercase font-semibold text-[10px] text-slate-500 tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Qualification</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Enrollment Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={
                          s.avatarUrl ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            s.fullName
                          )}`
                        }
                        alt=""
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {s.fullName}
                        </p>
                        <p className="text-[11px] text-slate-400">ID: {s.id.slice(-6)}</p>
                      </div>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{s.mobileNumber}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-[180px] truncate text-slate-700 dark:text-slate-300">
                      {s.qualification}
                    </td>

                    <td className="py-3 px-4 max-w-[160px] truncate text-slate-500">
                      {s.address}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(s.enrollmentDate)}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          s.status === 'Active'
                            ? 'emerald'
                            : s.status === 'Graduated'
                            ? 'purple'
                            : 'slate'
                        }
                        size="sm"
                        dot
                      >
                        {s.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5"
                          onClick={() => setEditingStudent(s)}
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5"
                          onClick={() => setDeletingStudentId(s.id)}
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredStudents.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Add Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      {/* Edit Modal */}
      <StudentModal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        onSubmit={handleEditSubmit}
        initialStudent={editingStudent}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingStudentId}
        onClose={() => setDeletingStudentId(null)}
        title="Confirm Student Removal"
        description="Are you sure you want to delete this student record? This will also remove associated active enrollment seats."
      >
        <div className="flex justify-end gap-2.5 pt-4">
          <Button variant="outline" onClick={() => setDeletingStudentId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Student
          </Button>
        </div>
      </Modal>
    </div>
  );
};
