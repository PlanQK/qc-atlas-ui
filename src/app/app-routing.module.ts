import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SoftwarePlatformViewComponent } from './components/execution-environments/software-platforms/software-platform-view/software-platform-view.component';
import { CloudServiceViewComponent } from './components/execution-environments/cloud-services/cloud-service-view/cloud-service-view.component';
import { AlgorithmListComponent } from './components/algorithms/algorithm-list/algorithm-list.component';
import { PublicationListComponent } from './components/publications/publication-list/publication-list.component';
import { ImplementationViewComponent } from './components/algorithms/implementation-view/implementation-view.component';
import { AlgorithmViewComponent } from './components/algorithms/algorithm-view/algorithm-view.component';

const routes: Routes = [
  { path: 'algorithms', component: AlgorithmListComponent },
  { path: 'algorithms/:algoId', component: AlgorithmViewComponent },
  {
    path: 'algorithms/:algoId/implementations/:implId',
    component: ImplementationViewComponent,
  },
  { path: 'software-platforms', component: SoftwarePlatformViewComponent },
  { path: 'cloud-services', component: CloudServiceViewComponent },
  { path: 'publications', component: PublicationListComponent },
  {
    path: '',
    redirectTo: '/algorithms',
    pathMatch: 'full',
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
