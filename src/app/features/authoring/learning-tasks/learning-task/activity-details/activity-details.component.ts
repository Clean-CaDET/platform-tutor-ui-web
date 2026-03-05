import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Activity } from '../../../../learning/task/model/activity.model';
import { RequestStatus } from '../../../../../shared/model/request-status.model';
import { CcMarkdownComponent } from '../../../../../shared/markdown/cc-markdown.component';
import { MarkdownEditorComponent } from '../../../../../shared/markdown/markdown-editor/markdown-editor.component';

@Component({
  selector: 'cc-activity-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatTooltipModule,
    CcMarkdownComponent, MarkdownEditorComponent,
  ],
  templateUrl: './activity-details.component.html',
  styleUrl: './activity-details.component.scss',
})
export class ActivityDetailsComponent {
  protected readonly RequestStatus = RequestStatus;

  readonly activity = input.required<Activity>();
  readonly activities = input.required<Activity[]>();
  readonly updateStatus = input(RequestStatus.None);
  readonly activitySaved = output<Activity>();

  editMode = signal(false);
  guidance = signal('');
  guidelines = signal('');
  activityForm!: FormGroup;

  constructor() {
    effect(() => {
      const activity = this.activity();
      const status = this.updateStatus();
      if (status === RequestStatus.Started || status === RequestStatus.Error) return;
      this.createForm(activity);
      if (activity.id || activity.name) {
        this.setInitialValues(activity);
        this.view();
      } else {
        this.guidance.set('');
        this.setGuidelines();
        this.edit();
      }
    });
  }

  private createForm(activity: Activity): void {
    this.activityForm = new FormGroup({
      code: new FormControl('', { nonNullable: true, validators: [Validators.required, this.uniqueCode()] }),
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      examples: new FormArray<FormGroup>([]),
    });

    if (!activity.parentId) {
      this.activityForm.addControl('submissionFormat', new FormGroup({
        type: new FormControl('Code', { nonNullable: true, validators: [Validators.required] }),
        validationRule: new FormControl('^.{1,500}$', { nonNullable: true }),
      }));
      this.activityForm.addControl('standards', new FormArray<FormGroup>([]));
    }
  }

  private uniqueCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const activities = this.activities();
      const currentId = this.activity().id;
      for (const a of activities) {
        if (a.code === control.value && a.id !== currentId) return { notUnique: true };
      }
      return null;
    };
  }

  private setInitialValues(activity: Activity): void {
    this.activityForm.get('code')!.setValue(activity.code);
    this.activityForm.get('name')!.setValue(activity.name);
    this.guidance.set(activity.guidance ?? '');
    this.setExamples(activity);
    if (!activity.parentId) {
      this.setStandards(activity);
      const sf = this.activityForm.get('submissionFormat')!;
      sf.get('type')!.setValue(activity.submissionFormat?.type ?? 'Code');
      sf.get('validationRule')!.setValue(activity.submissionFormat?.validationRule ?? '');
      this.guidelines.set(activity.submissionFormat?.guidelines ?? '');
    }
  }

  edit(): void {
    this.editMode.set(true);
    this.activityForm.get('submissionFormat')?.get('type')?.enable();
  }

  view(): void {
    this.editMode.set(false);
    this.activityForm.get('submissionFormat')?.get('type')?.disable();
  }

  get examples(): FormArray { return this.activityForm.get('examples') as FormArray; }

  private setExamples(activity: Activity): void {
    const arr = new FormArray<FormGroup>([]);
    for (const ex of activity.examples ?? []) {
      arr.push(new FormGroup({
        code: new FormControl(ex.code, { nonNullable: true, validators: [Validators.required] }),
        url: new FormControl(ex.url, { nonNullable: true, validators: [Validators.required] }),
      }));
    }
    this.activityForm.setControl('examples', arr);
  }

  addExample(): void {
    this.examples.push(new FormGroup({
      code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      url: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }));
  }

  deleteExample(index: number): void { this.examples.removeAt(index); }

  get standards(): FormArray { return this.activityForm.get('standards') as FormArray; }

  private setStandards(activity: Activity): void {
    const arr = new FormArray<FormGroup>([]);
    const sorted = [...(activity.standards ?? [])].sort((a, b) => a.name > b.name ? 1 : -1);
    for (const s of sorted) {
      arr.push(new FormGroup({
        id: new FormControl(s.id),
        name: new FormControl(s.name, { nonNullable: true, validators: [Validators.required] }),
        description: new FormControl(s.description, { nonNullable: true, validators: [Validators.required] }),
        maxPoints: new FormControl(s.maxPoints, { nonNullable: true, validators: [Validators.required] }),
      }));
    }
    this.activityForm.setControl('standards', arr);
  }

  addStandard(): void {
    this.standards.push(new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      maxPoints: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    }));
  }

  deleteStandard(index: number): void { this.standards.removeAt(index); }

  submit(): void {
    if (!this.activityForm.valid) return;
    if (!this.activity().parentId && !this.guidelines()?.trim()) return;
    const value = this.activityForm.getRawValue();
    const changed: Activity = {
      ...value,
      id: this.activity().id,
      parentId: this.activity().parentId,
      order: this.activity().order,
      guidance: this.guidance(),
    };
    if (changed.submissionFormat) {
      changed.submissionFormat.guidelines = this.guidelines();
    }
    this.activitySaved.emit(changed);
  }

  discardChanges(): void {
    if (this.activity().id) {
      this.setInitialValues(this.activity());
      this.view();
    } else {
      this.createForm(this.activity());
      this.guidance.set('');
      this.guidelines.set('');
    }
  }

  typeSelected(): void {
    this.setValidationRule();
    if (this.guidelines()) return;
    this.setGuidelines();
  }

  private setValidationRule(): void {
    const sf = this.activityForm.get('submissionFormat');
    if (!sf) return;
    const type = sf.get('type')!.value;
    const ctrl = sf.get('validationRule')!;
    switch (type) {
      case 'Text': ctrl.setValue('^.{1,1000}$'); break;
      case 'Link': ctrl.setValue(''); break;
      case 'Code': ctrl.setValue(''); break;
      case 'GitPR': ctrl.setValue('^https:\\/\\/github\\.com\\/([a-zA-Z0-9_.-]+)\\/([a-zA-Z0-9_.-]+)\\/pull\\/([0-9]{1,4})$'); break;
      case 'GitCommit': ctrl.setValue('^https:\\/\\/github\\.com\\/([a-zA-Z0-9_.-]+)\\/([a-zA-Z0-9_.-]+)\\/commit\\/([a-fA-F0-9]{40})$'); break;
      case 'TrelloCard': ctrl.setValue('^https:\\/\\/trello\\.com\\/c\\/.*'); break;
    }
  }

  private setGuidelines(): void {
    const sf = this.activityForm.get('submissionFormat');
    if (!sf) return;
    const type = sf.get('type')!.value;
    switch (type) {
      case 'Code': this.guidelines.set('Nalepi kompletan sadržaj programa koji si iskucao (u editor Ctrl+A da se sve odabere, Ctrl+C da se kopira i onda ovde Ctrl+V da se nalepi).'); break;
      case 'GitPR': this.guidelines.set('Navedi link do pull requesta koji sabira sve izmene koje si napravio.\nPrimer: https://github.com/Clean-CaDET/tutor/pull/106'); break;
      case 'GitCommit': this.guidelines.set('Navedi link do commita na GitHubu koji uključuje naziv repozitorijuma i heš kod commita.\nPrimer: https://github.com/Clean-CaDET/tutor/commit/9d3f671042e91bda63e20dfdbe9c31204f9d6b12'); break;
      case 'TrelloCard': this.guidelines.set('Navedi link do kartice na Trello tabli koji se dobija otvaranjem kartice u browseru i kopiranjem linka.\nPrimer: https://trello.com/c/GXSjvfIs/test'); break;
    }
  }
}
