import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRoom } from './upload-room';

describe('UploadRoom', () => {
  let component: UploadRoom;
  let fixture: ComponentFixture<UploadRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadRoom],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
