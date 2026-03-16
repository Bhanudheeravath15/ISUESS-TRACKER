import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesList } from './issues-list';

describe('IssuesList', () => {
  let component: IssuesList;
  let fixture: ComponentFixture<IssuesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuesList],
    }).compileComponents();

    fixture = TestBed.createComponent(IssuesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
