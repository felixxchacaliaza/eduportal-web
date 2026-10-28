import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentsPresenter } from './students.presenter';
import { StudentService } from './services/student.service';
import { IStudent } from './models';

describe('StudentsPresenter', () => {
  let presenter: StudentsPresenter;
  let mockStudentService: jasmine.SpyObj<StudentService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  const mockStudents: IStudent[] = [
    {
      id: 'stu-1',
      code: 'STU-2026-001',
      entryYear: '2026',
      enabled: true,
      person: {
        id: 'per-1',
        dni: '71829304',
        firstName: 'Carlos',
        lastName: 'Mendoza',
        gender: 'M',
        personalEmail: 'carlos.mendoza@colegio.edu.pe',
        phone: '987654321',
        address: 'Av. Las Flores 123'
      },
      guardians: [
        {
          person: {
            id: 'per-g1',
            dni: '40556677',
            firstName: 'Roberto',
            lastName: 'Mendoza',
            personalEmail: 'roberto@gmail.com'
          },
          relationship: 'PADRE',
          isPrimary: true
        }
      ]
    },
    {
      id: 'stu-2',
      code: 'STU-2026-002',
      entryYear: '2026',
      enabled: false,
      person: {
        id: 'per-2',
        dni: '72930415',
        firstName: 'Ana Sofía',
        lastName: 'Flores',
        gender: 'F',
        personalEmail: 'ana.flores@colegio.edu.pe',
        phone: '912345678'
      },
      guardians: []
    }
  ];

  beforeEach(() => {
    mockStudentService = jasmine.createSpyObj('StudentService', ['getStudents', 'deleteStudent']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        StudentsPresenter,
        { provide: StudentService, useValue: mockStudentService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });

    presenter = TestBed.inject(StudentsPresenter);
  });

  it('should initialize with empty state and zero counts', () => {
    expect(presenter.students()).toEqual([]);
    expect(presenter.totalCount()).toBe(0);
    expect(presenter.activeCount()).toBe(0);
    expect(presenter.isLoading()).toBeFalse();
    expect(presenter.searchTerm()).toBe('');
  });

  it('should load students and update computed signals', async () => {
    mockStudentService.getStudents.and.returnValue(Promise.resolve(mockStudents));

    await presenter.loadStudents();

    expect(presenter.students().length).toBe(2);
    expect(presenter.totalCount()).toBe(2);
    expect(presenter.activeCount()).toBe(1); // 1 activo, 1 inactivo
    expect(presenter.isLoading()).toBeFalse();
  });

  it('should filter students reactively by DNI', async () => {
    mockStudentService.getStudents.and.returnValue(Promise.resolve(mockStudents));
    await presenter.loadStudents();

    presenter.setSearchTerm('71829304');

    expect(presenter.filteredStudents().length).toBe(1);
    expect(presenter.filteredStudents()[0].person.firstName).toBe('Carlos');
  });

  it('should filter students reactively by studentCode', async () => {
    mockStudentService.getStudents.and.returnValue(Promise.resolve(mockStudents));
    await presenter.loadStudents();

    presenter.setSearchTerm('STU-2026-002');

    expect(presenter.filteredStudents().length).toBe(1);
    expect(presenter.filteredStudents()[0].person.lastName).toBe('Flores');
  });

  it('should return all students if search term is empty or whitespace', async () => {
    mockStudentService.getStudents.and.returnValue(Promise.resolve(mockStudents));
    await presenter.loadStudents();

    presenter.setSearchTerm('   ');

    expect(presenter.filteredStudents().length).toBe(2);
  });
});
