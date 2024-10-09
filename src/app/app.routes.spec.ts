import { routes } from './app.routes';
import { CasesTabComponent } from './components/cases-tab/cases-tab.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

describe('App Routing', () => {
  it('should have a default route that loads CasesTabComponent', () => {
    expect(routes).toContain({ path: '', component: CasesTabComponent });
  });

  it('should have a wildcard route that loads NotFoundComponent', () => {
    expect(routes).toContain({ path: '**', component: NotFoundComponent });
  });
});
