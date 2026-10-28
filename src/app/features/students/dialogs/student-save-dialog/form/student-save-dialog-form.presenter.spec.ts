import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { StudentSaveDialogFormPresenter } from './student-save-dialog-form.presenter';
import { PersonService } from '../../../services/person.service';

describe('StudentSaveDialogFormPresenter', () => {
  let presenter: StudentSaveDialogFormPresenter;
  let mockPersonService: jasmine.SpyObj<PersonService>;

  beforeEach(() => {
    mockPersonService = jasmine.createSpyObj('PersonService', ['checkDni', 'getPersonByDni']);
    mockPersonService.checkDni.and.returnValue(Promise.resolve({ exists: false, isStudent: false }));

    TestBed.configureTestingModule({
      providers: [
        StudentSaveDialogFormPresenter,
        FormBuilder,
        { provide: PersonService, useValue: mockPersonService }
      ]
    });

    presenter = TestBed.inject(StudentSaveDialogFormPresenter);
  });

  it('should initialize in create mode with one guardian marked as primary', () => {
    presenter.initialize();

    expect(presenter.form).toBeDefined();
    expect(presenter.guardiansArray.length).toBe(1);
    expect(presenter.guardiansArray.at(0).get('isPrimary')?.value).toBeTrue();
  });

  it('should add additional guardians to the form array', () => {
    presenter.initialize();
    expect(presenter.guardiansArray.length).toBe(1);

    presenter.addGuardian({ dni: '44556677', firstName: 'María', lastName: 'Gómez', isPrimary: false });

    expect(presenter.guardiansArray.length).toBe(2);
    expect(presenter.guardiansArray.at(1).get('dni')?.value).toBe('44556677');
    expect(presenter.guardiansArray.at(1).get('isPrimary')?.value).toBeFalse();
  });

  it('should not remove the last remaining guardian', () => {
    presenter.initialize();
    expect(presenter.guardiansArray.length).toBe(1);

    presenter.removeGuardian(0);

    // Debe conservar al menos 1 apoderado
    expect(presenter.guardiansArray.length).toBe(1);
  });

  it('should reassign primary guardian if the primary guardian is removed', () => {
    presenter.initialize();
    presenter.addGuardian({ dni: '44556677', firstName: 'María', isPrimary: false });
    expect(presenter.guardiansArray.length).toBe(2);
    expect(presenter.guardiansArray.at(0).get('isPrimary')?.value).toBeTrue();

    // Eliminar el primer apoderado (que era el principal)
    presenter.removeGuardian(0);

    expect(presenter.guardiansArray.length).toBe(1);
    expect(presenter.guardiansArray.at(0).get('isPrimary')?.value).toBeTrue();
  });

  it('should exclusively set primary guardian when calling setPrimaryGuardian', () => {
    presenter.initialize();
    presenter.addGuardian({ dni: '44556677', firstName: 'María', isPrimary: false });

    presenter.setPrimaryGuardian(1);

    expect(presenter.guardiansArray.at(0).get('isPrimary')?.value).toBeFalse();
    expect(presenter.guardiansArray.at(1).get('isPrimary')?.value).toBeTrue();
  });

  it('should reject validation if student is their own guardian (RN-ACT-02)', () => {
    presenter.initialize();
    presenter.form.patchValue({
      dni: '78945612',
      firstName: 'Mateo',
      lastName: 'Quispe',
      personalEmail: 'mateo@colegio.edu.pe',
      gender: 'M',
      entryYear: '2026'
    });

    // Asignar el mismo DNI al apoderado
    presenter.guardiansArray.at(0).patchValue({
      dni: '78945612',
      firstName: 'Mateo',
      lastName: 'Quispe',
      relationship: 'PADRE'
    });

    const valid = presenter.isValid();
    expect(valid).toBeFalse();
  });

  it('should construct clean payload with trimmed values', () => {
    presenter.initialize();
    presenter.form.patchValue({
      dni: '78945612  ',
      firstName: '  Mateo  ',
      lastName: '  Quispe  ',
      gender: 'M',
      personalEmail: '  mateo@colegio.edu.pe  ',
      entryYear: '2026'
    });

    presenter.guardiansArray.at(0).patchValue({
      dni: '  40112233  ',
      firstName: '  Juan  ',
      lastName: '  Quispe  ',
      relationship: 'PADRE',
      isPrimary: true
    });

    const payload = presenter.getPayload();

    expect(payload.dni).toBe('78945612');
    expect(payload.firstName).toBe('Mateo');
    expect(payload.lastName).toBe('Quispe');
    expect(payload.guardians[0].dni).toBe('40112233');
    expect(payload.guardians[0].firstName).toBe('Juan');
    expect(payload.guardians[0].isPrimary).toBeTrue();
  });
});
