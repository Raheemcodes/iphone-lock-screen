import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicControlComponent } from './music-control.component';

describe('MusicControlComponent', () => {
  let component: MusicControlComponent;
  let fixture: ComponentFixture<MusicControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
