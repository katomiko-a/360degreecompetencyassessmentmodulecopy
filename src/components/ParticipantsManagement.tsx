import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Users, User, Trash2, Plus, UserPlus } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar?: string;
  managerId?: string;
}

interface Department {
  id: string;
  name: string;
  expanded: boolean;
  employees: Employee[];
  children: Department[];
}

interface AssessorAssignment {
  participantId: string;
  self: boolean;
  manager?: Employee;
  peers: Employee[];
  subordinates: Employee[];
  clients: Employee[];
}

const mockDepartments: Department[] = [
  {
    id: 'dev',
    name: 'Разработка',
    expanded: true,
    employees: [
      { id: 'e1', name: 'Иванов Иван Иванович', position: 'Team Lead', department: 'Разработка' },
      { id: 'e2', name: 'Петров Петр Петрович', position: 'Senior Developer', department: 'Разработка' },
      { id: 'e3', name: 'Сидорова Анна Сергеевна', position: 'Middle Developer', department: 'Разработка' },
    ],
    children: [
      {
        id: 'frontend',
        name: 'Frontend команда',
        expanded: false,
        employees: [
          { id: 'e4', name: 'Смирнов Алексей Иванович', position: 'Frontend Developer', department: 'Frontend команда' },
          { id: 'e5', name: 'Кузнецова Мария Петровна', position: 'Frontend Developer', department: 'Frontend команда' },
        ],
        children: []
      },
      {
        id: 'backend',
        name: 'Backend команда',
        expanded: false,
        employees: [
          { id: 'e6', name: 'Попов Дмитрий Сергеевич', position: 'Backend Developer', department: 'Backend команда' },
          { id: 'e7', name: 'Васильева Елена Александровна', position: 'Backend Developer', department: 'Backend команда' },
        ],
        children: []
      }
    ]
  },
  {
    id: 'sales',
    name: 'Отдел продаж',
    expanded: true,
    employees: [
      { id: 'e8', name: 'Михайлов Михаил Михайлович', position: 'Sales Manager', department: 'Отдел продаж' },
      { id: 'e9', name: 'Николаева Ольга Ивановна', position: 'Sales Representative', department: 'Отдел продаж' },
    ],
    children: []
  },
  {
    id: 'hr',
    name: 'HR и администрация',
    expanded: true,
    employees: [
      { id: 'e10', name: 'Козлова Анна Владимировна', position: 'HR Manager', department: 'HR и администрация' },
      { id: 'e11', name: 'Федорова Светлана Петровна', position: 'HR Specialist', department: 'HR и администрация' },
    ],
    children: []
  }
];

const ItemTypes = {
  EMPLOYEE: 'employee'
};

interface DraggableEmployeeProps {
  employee: Employee;
}

function DraggableEmployee({ employee }: DraggableEmployeeProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EMPLOYEE,
    item: employee,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-purple-600 text-sm">
          {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-gray-900 text-sm truncate">{employee.name}</div>
        <div className="text-gray-500 text-xs truncate">{employee.position}</div>
      </div>
    </div>
  );
}

interface DropZoneProps {
  role: 'manager' | 'peers' | 'subordinates' | 'clients';
  employees: Employee[];
  onDrop: (employee: Employee, role: string) => void;
  onRemove: (employeeId: string, role: string) => void;
  label: string;
  color: string;
  multiple?: boolean;
}

function DropZone({ role, employees, onDrop, onRemove, label, color, multiple = false }: DropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.EMPLOYEE,
    drop: (item: Employee) => {
      if (!multiple && employees.length > 0) return;
      onDrop(item, role);
    },
    canDrop: (item: Employee) => {
      if (!multiple && employees.length > 0) return false;
      return !employees.some(e => e.id === item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }));

  return (
    <div
      ref={drop}
      className={`border-2 border-dashed rounded-lg p-4 min-h-[120px] transition-all ${
        isOver && canDrop
          ? `border-${color}-500 bg-${color}-50`
          : canDrop
          ? `border-${color}-300 bg-${color}-50/50`
          : 'border-gray-300 bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
        <span className="text-gray-700 text-sm">{label}</span>
        {!multiple && employees.length > 0 && (
          <span className="text-xs text-gray-500">(1/1)</span>
        )}
        {multiple && (
          <span className="text-xs text-gray-500">({employees.length})</span>
        )}
      </div>

      {employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <UserPlus className={`w-8 h-8 text-${color}-400 mb-2`} />
          <p className="text-gray-500 text-sm">
            Перетащите сотрудника сюда
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg group"
            >
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-xs">
                  {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 text-xs truncate">{employee.name}</div>
                <div className="text-gray-500 text-xs truncate">{employee.position}</div>
              </div>
              <button
                onClick={() => onRemove(employee.id, role)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface DepartmentTreeProps {
  department: Department;
  level: number;
  selectedEmployees: string[];
  onToggleEmployee: (employeeId: string) => void;
  onToggleDepartment: (departmentId: string) => void;
}

function DepartmentTree({ department, level, selectedEmployees, onToggleEmployee, onToggleDepartment }: DepartmentTreeProps) {
  return (
    <div className={`${level > 0 ? 'ml-6' : ''}`}>
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
        onClick={() => onToggleDepartment(department.id)}
      >
        {department.expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
        <Users className="w-4 h-4 text-purple-600" />
        <span className="text-gray-900">{department.name}</span>
        <span className="text-gray-500 text-sm">
          ({department.employees.length})
        </span>
      </div>

      {department.expanded && (
        <div className="ml-6 mt-1 space-y-1">
          {department.employees.map((employee) => (
            <label
              key={employee.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedEmployees.includes(employee.id)}
                onChange={() => onToggleEmployee(employee.id)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-sm">
                  {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-gray-900 text-sm">{employee.name}</div>
                <div className="text-gray-500 text-xs">{employee.position}</div>
              </div>
            </label>
          ))}

          {department.children.map((child) => (
            <DepartmentTree
              key={child.id}
              department={child}
              level={level + 1}
              selectedEmployees={selectedEmployees}
              onToggleEmployee={onToggleEmployee}
              onToggleDepartment={onToggleDepartment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ParticipantsManagement() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(['e1', 'e2', 'e8']);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentParticipant, setCurrentParticipant] = useState<Employee | null>(null);
  const [assignments, setAssignments] = useState<Record<string, AssessorAssignment>>({
    e1: {
      participantId: 'e1',
      self: true,
      manager: undefined,
      peers: [],
      subordinates: [],
      clients: []
    }
  });

  const toggleDepartment = (departmentId: string) => {
    const updateDepartment = (depts: Department[]): Department[] => {
      return depts.map(dept => {
        if (dept.id === departmentId) {
          return { ...dept, expanded: !dept.expanded };
        }
        if (dept.children.length > 0) {
          return { ...dept, children: updateDepartment(dept.children) };
        }
        return dept;
      });
    };
    setDepartments(updateDepartment(departments));
  };

  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const getAllEmployees = (depts: Department[]): Employee[] => {
    let employees: Employee[] = [];
    depts.forEach(dept => {
      employees = [...employees, ...dept.employees];
      if (dept.children.length > 0) {
        employees = [...employees, ...getAllEmployees(dept.children)];
      }
    });
    return employees;
  };

  const allEmployees = getAllEmployees(departments);
  const selectedEmployeeObjects = allEmployees.filter(e => selectedEmployees.includes(e.id));

  const handleDropEmployee = (employee: Employee, role: string) => {
    if (!currentParticipant) return;

    setAssignments(prev => {
      const current = prev[currentParticipant.id] || {
        participantId: currentParticipant.id,
        self: true,
        peers: [],
        subordinates: [],
        clients: []
      };

      if (role === 'manager') {
        return {
          ...prev,
          [currentParticipant.id]: { ...current, manager: employee }
        };
      } else {
        const roleKey = role as 'peers' | 'subordinates' | 'clients';
        if (!current[roleKey].some(e => e.id === employee.id)) {
          return {
            ...prev,
            [currentParticipant.id]: {
              ...current,
              [roleKey]: [...current[roleKey], employee]
            }
          };
        }
      }
      return prev;
    });
  };

  const handleRemoveEmployee = (employeeId: string, role: string) => {
    if (!currentParticipant) return;

    setAssignments(prev => {
      const current = prev[currentParticipant.id];
      if (!current) return prev;

      if (role === 'manager') {
        return {
          ...prev,
          [currentParticipant.id]: { ...current, manager: undefined }
        };
      } else {
        const roleKey = role as 'peers' | 'subordinates' | 'clients';
        return {
          ...prev,
          [currentParticipant.id]: {
            ...current,
            [roleKey]: current[roleKey].filter(e => e.id !== employeeId)
          }
        };
      }
    });
  };

  const availableAssessors = allEmployees.filter(e => !selectedEmployees.includes(e.id));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Шапка */}
        <div>
          <h1 className="text-gray-900 text-2xl mb-2">Управление участниками</h1>
          <p className="text-gray-600">
            Выберите участников оценки и назначьте им оценивающих
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Левая панель - Древо организации */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900">Организационная структура</h2>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                  {selectedEmployees.length} выбрано
                </span>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск сотрудников..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 max-h-[600px] overflow-y-auto">
                {departments.map((dept) => (
                  <DepartmentTree
                    key={dept.id}
                    department={dept}
                    level={0}
                    selectedEmployees={selectedEmployees}
                    onToggleEmployee={toggleEmployee}
                    onToggleDepartment={toggleDepartment}
                  />
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Быстрые действия:</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedEmployees(allEmployees.map(e => e.id))}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    Выбрать всех
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => setSelectedEmployees([])}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    Снять всё
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Средняя панель - Выбранные участники */}
          <div className="col-span-4 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-4">Участники оценки</h2>

              {selectedEmployeeObjects.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Выберите участников из организационной структуры
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {selectedEmployeeObjects.map((employee) => {
                    const assignment = assignments[employee.id];
                    const assessorsCount = (assignment?.manager ? 1 : 0) +
                                          (assignment?.peers.length || 0) +
                                          (assignment?.subordinates.length || 0) +
                                          (assignment?.clients.length || 0);

                    return (
                      <div
                        key={employee.id}
                        onClick={() => setCurrentParticipant(employee)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          currentParticipant?.id === employee.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-600">
                              {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-900">{employee.name}</div>
                            <div className="text-gray-500 text-sm">{employee.position}</div>
                          </div>
                          {currentParticipant?.id === employee.id && (
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-gray-600">
                              Руководитель: {assignment?.manager ? '1' : '0'}
                            </span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-gray-600">
                              Коллеги: {assignment?.peers.length || 0}
                            </span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span className="text-gray-600">
                              Подчиненные: {assignment?.subordinates.length || 0}
                            </span>
                          </div>
                        </div>

                        {assessorsCount === 0 && (
                          <div className="mt-2 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                            Требуется назначить оценивающих
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Правая панель - Назначение оценивающих */}
          <div className="col-span-4 space-y-4">
            {currentParticipant ? (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600">
                        {currentParticipant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-gray-900">{currentParticipant.name}</h2>
                      <p className="text-gray-600 text-sm">{currentParticipant.position}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <input
                        type="checkbox"
                        checked={assignments[currentParticipant.id]?.self !== false}
                        onChange={(e) => {
                          setAssignments(prev => ({
                            ...prev,
                            [currentParticipant.id]: {
                              ...(prev[currentParticipant.id] || {
                                participantId: currentParticipant.id,
                                peers: [],
                                subordinates: [],
                                clients: []
                              }),
                              self: e.target.checked
                            }
                          }));
                        }}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <div className="text-gray-900 text-sm">Включить самооценку</div>
                        <div className="text-gray-500 text-xs">Сотрудник оценит себя сам</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 mb-2">Назначьте оценивающих:</div>

                    <DropZone
                      role="manager"
                      employees={assignments[currentParticipant.id]?.manager ? [assignments[currentParticipant.id].manager!] : []}
                      onDrop={handleDropEmployee}
                      onRemove={handleRemoveEmployee}
                      label="Руководитель"
                      color="blue"
                      multiple={false}
                    />

                    <DropZone
                      role="peers"
                      employees={assignments[currentParticipant.id]?.peers || []}
                      onDrop={handleDropEmployee}
                      onRemove={handleRemoveEmployee}
                      label="Коллеги (минимум 3)"
                      color="green"
                      multiple={true}
                    />

                    <DropZone
                      role="subordinates"
                      employees={assignments[currentParticipant.id]?.subordinates || []}
                      onDrop={handleDropEmployee}
                      onRemove={handleRemoveEmployee}
                      label="Подчиненные"
                      color="orange"
                      multiple={true}
                    />

                    <DropZone
                      role="clients"
                      employees={assignments[currentParticipant.id]?.clients || []}
                      onDrop={handleDropEmployee}
                      onRemove={handleRemoveEmployee}
                      label="Внешние клиенты"
                      color="pink"
                      multiple={true}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-gray-900 mb-3">Доступные сотрудники</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Перетащите сотрудников в зоны выше для назначения ролей
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableAssessors.map((employee) => (
                      <DraggableEmployee key={employee.id} employee={employee} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">Выберите участника</h3>
                  <p className="text-gray-600 text-sm">
                    Выберите участника из списка слева, чтобы назначить ему оценивающих
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Панель действий */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div className="text-gray-600">
            Участников выбрано: <span className="text-purple-600">{selectedEmployees.length}</span>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Отмена
            </button>
            <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
