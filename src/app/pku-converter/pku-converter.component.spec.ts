import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PkuConverterComponent } from './pku-converter.component';

describe('PkuConverterComponent', () => {
  let component: PkuConverterComponent;
  let fixture: ComponentFixture<PkuConverterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PkuConverterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PkuConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
