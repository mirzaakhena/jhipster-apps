import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IJobMySuffix, JobMySuffix } from 'app/shared/model/job-my-suffix.model';
import { JobMySuffixService } from './job-my-suffix.service';
import { IEmployeeMySuffix } from 'app/shared/model/employee-my-suffix.model';
import { EmployeeMySuffixService } from 'app/entities/employee-my-suffix';
import { ITaskMySuffix } from 'app/shared/model/task-my-suffix.model';
import { TaskMySuffixService } from 'app/entities/task-my-suffix';

@Component({
  selector: 'jhi-job-my-suffix-update',
  templateUrl: './job-my-suffix-update.component.html'
})
export class JobMySuffixUpdateComponent implements OnInit {
  job: IJobMySuffix;
  isSaving: boolean;

  employees: IEmployeeMySuffix[];

  tasks: ITaskMySuffix[];

  editForm = this.fb.group({
    id: [],
    jobTitle: [],
    minSalary: [],
    maxSalary: [],
    employeeId: [],
    tasks: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected jobService: JobMySuffixService,
    protected employeeService: EmployeeMySuffixService,
    protected taskService: TaskMySuffixService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ job }) => {
      this.updateForm(job);
      this.job = job;
    });
    this.employeeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployeeMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployeeMySuffix[]>) => response.body)
      )
      .subscribe((res: IEmployeeMySuffix[]) => (this.employees = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.taskService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ITaskMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<ITaskMySuffix[]>) => response.body)
      )
      .subscribe((res: ITaskMySuffix[]) => (this.tasks = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(job: IJobMySuffix) {
    this.editForm.patchValue({
      id: job.id,
      jobTitle: job.jobTitle,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      employeeId: job.employeeId,
      tasks: job.tasks
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const job = this.createFromForm();
    if (job.id !== undefined) {
      this.subscribeToSaveResponse(this.jobService.update(job));
    } else {
      this.subscribeToSaveResponse(this.jobService.create(job));
    }
  }

  private createFromForm(): IJobMySuffix {
    const entity = {
      ...new JobMySuffix(),
      id: this.editForm.get(['id']).value,
      jobTitle: this.editForm.get(['jobTitle']).value,
      minSalary: this.editForm.get(['minSalary']).value,
      maxSalary: this.editForm.get(['maxSalary']).value,
      employeeId: this.editForm.get(['employeeId']).value,
      tasks: this.editForm.get(['tasks']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobMySuffix>>) {
    result.subscribe((res: HttpResponse<IJobMySuffix>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackEmployeeById(index: number, item: IEmployeeMySuffix) {
    return item.id;
  }

  trackTaskById(index: number, item: ITaskMySuffix) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
