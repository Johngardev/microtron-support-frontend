import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarlabTopicComponent } from './starlab-topic.component';

describe('StarlabTopicComponent', () => {
  let component: StarlabTopicComponent;
  let fixture: ComponentFixture<StarlabTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarlabTopicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarlabTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
