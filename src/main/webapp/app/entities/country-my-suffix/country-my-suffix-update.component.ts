import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICountryMySuffix, CountryMySuffix } from 'app/shared/model/country-my-suffix.model';
import { CountryMySuffixService } from './country-my-suffix.service';
import { IRegionMySuffix } from 'app/shared/model/region-my-suffix.model';
import { RegionMySuffixService } from 'app/entities/region-my-suffix';

@Component({
  selector: 'jhi-country-my-suffix-update',
  templateUrl: './country-my-suffix-update.component.html'
})
export class CountryMySuffixUpdateComponent implements OnInit {
  country: ICountryMySuffix;
  isSaving: boolean;

  regions: IRegionMySuffix[];

  editForm = this.fb.group({
    id: [],
    countryName: [],
    regionId: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected countryService: CountryMySuffixService,
    protected regionService: RegionMySuffixService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ country }) => {
      this.updateForm(country);
      this.country = country;
    });
    this.regionService
      .query({ filter: 'country-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IRegionMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRegionMySuffix[]>) => response.body)
      )
      .subscribe(
        (res: IRegionMySuffix[]) => {
          if (!this.country.regionId) {
            this.regions = res;
          } else {
            this.regionService
              .find(this.country.regionId)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IRegionMySuffix>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IRegionMySuffix>) => subResponse.body)
              )
              .subscribe(
                (subRes: IRegionMySuffix) => (this.regions = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(country: ICountryMySuffix) {
    this.editForm.patchValue({
      id: country.id,
      countryName: country.countryName,
      regionId: country.regionId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const country = this.createFromForm();
    if (country.id !== undefined) {
      this.subscribeToSaveResponse(this.countryService.update(country));
    } else {
      this.subscribeToSaveResponse(this.countryService.create(country));
    }
  }

  private createFromForm(): ICountryMySuffix {
    const entity = {
      ...new CountryMySuffix(),
      id: this.editForm.get(['id']).value,
      countryName: this.editForm.get(['countryName']).value,
      regionId: this.editForm.get(['regionId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICountryMySuffix>>) {
    result.subscribe((res: HttpResponse<ICountryMySuffix>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackRegionById(index: number, item: IRegionMySuffix) {
    return item.id;
  }
}
