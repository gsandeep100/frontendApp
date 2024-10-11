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

  it('should load CasesTabComponent if default route is hit', () => {
    const route = routes.find((r) => r.path === '');
    expect(route?.component).toBe(CasesTabComponent);
  });

  it('should redirect to NotFoundComponent if any other route is hit', () => {
    const route = routes.find((r) => r.path === '**');
    expect(route?.component).toBe(NotFoundComponent);
  });
});
