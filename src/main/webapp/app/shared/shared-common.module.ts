import { NgModule } from '@angular/core';

import { JhipsterAppsSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [JhipsterAppsSharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [JhipsterAppsSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class JhipsterAppsSharedCommonModule {}
