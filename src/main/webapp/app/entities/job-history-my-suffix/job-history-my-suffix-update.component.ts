import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IJobHistoryMySuffix, JobHistoryMySuffix } from 'app/shared/model/job-history-my-suffix.model';
import { JobHistoryMySuffixService } from './job-history-my-suffix.service';
import { IJobMySuffix } from 'app/shared/model/job-my-suffix.model';
import { JobMySuffixService } from 'app/entities/job-my-suffix';
import { IDepartmentMySuffix } from 'app/shared/model/department-my-suffix.model';
import { DepartmentMySuffixService } from 'app/entities/department-my-suffix';
import { IEmployeeMySuffix } from 'app/shared/model/employee-my-suffix.model';
import { EmployeeMySuffixService } from 'app/entities/employee-my-suffix';

@Component({
  selector: 'jhi-job-history-my-suffix-update',
  templateUrl: './job-history-my-suffix-update.component.html'
})
export class JobHistoryMySuffixUpdateComponent implements OnInit {
  jobHistory: IJobHistoryMySuffix;
  isSaving: boolean;

  jobs: IJobMySuffix[];

  departments: IDepartmentMySuffix[];

  employees: IEmployeeMySuffix[];

  editForm = this.fb.group({
    id: [],
    startDate: [],
    endDate: [],
    language: [],
    jobId: [],
    departmentId: [],
    employeeId: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected jobHistoryService: JobHistoryMySuffixService,
    protected jobService: JobMySuffixService,
    protected departmentService: DepartmentMySuffixService,
    protected employeeService: EmployeeMySuffixService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ jobHistory }) => {
      this.updateForm(jobHistory);
      this.jobHistory = jobHistory;
    });
    this.jobService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IJobMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<IJobMySuffix[]>) => response.body)
      )
      .subscribe(
        (res: IJobMySuffix[]) => {
          if (!this.jobHistory.jobId) {
            this.jobs = res;
          } else {
            this.jobService
              .find(this.jobHistory.jobId)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IJobMySuffix>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IJobMySuffix>) => subResponse.body)
              )
              .subscribe(
                (subRes: IJobMySuffix) => (this.jobs = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.departmentService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IDepartmentMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDepartmentMySuffix[]>) => response.body)
      )
      .subscribe(
        (res: IDepartmentMySuffix[]) => {
          if (!this.jobHistory.departmentId) {
            this.departments = res;
          } else {
            this.departmentService
              .find(this.jobHistory.departmentId)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IDepartmentMySuffix>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IDepartmentMySuffix>) => subResponse.body)
              )
              .subscribe(
                (subRes: IDepartmentMySuffix) => (this.departments = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.employeeService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployeeMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployeeMySuffix[]>) => response.body)
      )
      .subscribe(
        (res: IEmployeeMySuffix[]) => {
          if (!this.jobHistory.employeeId) {
            this.employees = res;
          } else {
            this.employeeService
              .find(this.jobHistory.employeeId)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IEmployeeMySuffix>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IEmployeeMySuffix>) => subResponse.body)
              )
              .subscribe(
                (subRes: IEmployeeMySuffix) => (this.employees = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(jobHistory: IJobHistoryMySuffix) {
    this.editForm.patchValue({
      id: jobHistory.id,
      startDate: jobHistory.startDate != null ? jobHistory.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: jobHistory.endDate != null ? jobHistory.endDate.format(DATE_TIME_FORMAT) : null,
      language: jobHistory.language,
      jobId: jobHistory.jobId,
      departmentId: jobHistory.departmentId,
      employeeId: jobHistory.employeeId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const jobHistory = this.createFromForm();
    if (jobHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.jobHistoryService.update(jobHistory));
    } else {
      this.subscribeToSaveResponse(this.jobHistoryService.create(jobHistory));
    }
  }

  private createFromForm(): IJobHistoryMySuffix {
    const entity = {
      ...new JobHistoryMySuffix(),
      id: this.editForm.get(['id']).value,
      startDate:
        this.editForm.get(['startDate']).value != null ? moment(this.editForm.get(['startDate']).value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate']).value != null ? moment(this.editForm.get(['endDate']).value, DATE_TIME_FORMAT) : undefined,
      language: this.editForm.get(['language']).value,
      jobId: this.editForm.get(['jobId']).value,
      departmentId: this.editForm.get(['departmentId']).value,
      employeeId: this.editForm.get(['employeeId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobHistoryMySuffix>>) {
    result.subscribe((res: HttpResponse<IJobHistoryMySuffix>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackJobById(index: number, item: IJobMySuffix) {
    return item.id;
  }

  trackDepartmentById(index: number, item: IDepartmentMySuffix) {
    return item.id;
  }

  trackEmployeeById(index: number, item: IEmployeeMySuffix) {
    return item.id;
  }
}
