import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {IDayCalendarConfig} from 'ng2-date-picker';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {

  personalDetails!: FormGroup;
  educationalDetails!: FormGroup;
  skillDetails!: FormGroup;
  experienceDetails!: FormGroup;
  personal_step = false;
  education_step = false;
  skill_step = false;
  experience_step = false;
  step = 1;
  hobbyList = [
    'Cricket',
    'Reading'
  ];

  skillsList: any = [];
  educationList: any = [];
  experienceList: any = [];

  isLoading: boolean = false;

  selectedHobby: any;

  public dayPickerConfig = <IDayCalendarConfig> {
    format: 'MMM YYYY',
    monthFormat: 'MMMM YYYYY',
    firstDayOfWeek: 'mo',
  };


  constructor(private formBuilder: FormBuilder,
              private _commonService: CommonService,
              private modalService: NgbModal,
              private _route: ActivatedRoute) {

    this.personalDetails = this.formBuilder.group({
      profilePic: [''],
      name: ['', [Validators.required, Validators.pattern('^(\\w\\w+)\\s(\\w+)$')]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      hobbies: [[], [Validators.required]]
    });

    this.educationalDetails = this.formBuilder.group({
      institute: ['', [Validators.required]],
      degree: ['', [Validators.required]],
      percentage: ['', [Validators.required, Validators.pattern('^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$')]],
      pass_out_year: ['', [Validators.required]]
    });

    this.skillDetails = this.formBuilder.group({
      name: ['', [Validators.required]],
      experience: ['', [Validators.required, Validators.pattern('^([0-9]{2})?$')]]
    });

    this.experienceDetails = this.formBuilder.group({
      company: ['', [Validators.required]],
      project: ['', [Validators.required]],
      role: ['', [Validators.required]],
      team_size: ['', [Validators.required, Validators.pattern('^([0-9]{3})?$')]],
      duration_from: ['', [Validators.required]],
      duration_to: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getCandidateDetails();
  }

  ngAfterViewInit() {
  }

  getCandidateDetails() {
    let id = this._route.snapshot.paramMap.get('id');

    this.isLoading = true;
    this._commonService.apiCall('get', 'candidate/' + id).subscribe(response => {

      this.personalDetails.reset();


      this.personalDetails.controls.name.setValue(response['name']);
      this.personalDetails.controls.email.setValue(response['email']);
      this.personalDetails.controls.gender.setValue(response['gender']);
      this.personalDetails.controls.phone.setValue(response['phone']);

      this.personalDetails.get('hobbies').setValue(response['hobbies']);
      this.imageSrc = response['profile_picture']
      this.educationList = response['education'];
      this.skillsList = response['skills'];
      this.experienceList = response['experience'];


      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }

  get personal() {
    return this.personalDetails.controls;
  }

  get education() {
    return this.educationalDetails.controls;
  }

  get skills() {
    return this.skillDetails.controls;
  }

  get experience() {
    return this.experienceDetails.controls;
  }

  next() {
    if (this.step == 1) {
      this.personal_step = true;
      if (this.personalDetails.invalid) {
        return;
      }
      this.step++;
      return;
    }

    if (this.step == 2) {
      this.education_step = true;
      if (this.educationList.length == 0) {
        this._commonService.flashMessage('warning', '', 'Please add at least 1 item in education');
        return;
      }
      this.step++;
      return;
    }

    if (this.step == 3) {
      this.skill_step = true;
      if (this.skillsList.length == 0) {
        this._commonService.flashMessage('warning', '', 'Please add at least 1 item in Skill');
        return;
      }
      this.step++;
      return;
    }
  }

  previous() {
    this.step--;
    if (this.step == 1) {
      this.personal_step = false;
    }
    if (this.step == 2) {
      this.education_step = false;
    }

    if (this.step == 3) {
      this.skill_step = false;
    }

    if (this.step == 4) {
      this.experience_step = false;
    }
  }

  submit() {
    if (this.step == 4) {
      this.experience_step = true;

      if (this.experienceList.length == 0) {
        this._commonService.flashMessage('warning', '', 'Please add at least 1 item in experience');
        return;
      }
    }

    this.editCandidate();
  }

  editCandidate() {
    const {profilePic, name, email, gender, phone, hobbies} = this.personalDetails.value;

    let data = {};

    data['profile_picture'] = profilePic;
    data['name'] = name;
    data['email'] = email;
    data['gender'] = gender;
    data['phone'] = phone;
    data['hobbies'] = hobbies;
    data['education'] = this.educationList;
    data['skills'] = this.skillsList;
    data['experience'] = this.experienceList;
    let id = this._route.snapshot.paramMap.get('id');
    this._commonService.apiCall('put', 'candidate/' + id, data).subscribe(response => {
      this._commonService.navigateTo('', true);
    });
  }

  imageSrc: string;

  onFileChange(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.personalDetails.patchValue({
          profilePic: reader.result
        });
      };
    }
  }

  onAddSkill(addSkill) {

    if (this.skillsList.length >= 10) {
      this._commonService.flashMessage('warning', '', 'You can add 10 item in skills');
      return;
    }

    this.modalService.open(addSkill, {
      windowClass: 'myCustomModalClass',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
      centered: true
    }).result.then((result) => {
      if (result == 'ADD') {
        this.addSkill(addSkill);
        return;
      }

      if (result == 'CANCEL') {
        this.skillDetails.reset();
        this.skill_step = false;
        return;
      }
    }, (reason) => {
    });
  }

  addSkill(addSkill) {

    this.skill_step = true;
    if (this.skillDetails.invalid) {
      this.onAddSkill(addSkill);
      return;
    }

    const {name, experience} = this.skillDetails.value;
    let temp = {};
    temp['name'] = name;
    temp['experience'] = experience;
    this.skillsList.unshift(temp);
    this.skillDetails.reset();
    this.skill_step = false;
  }

  onAddEducation(addEdu) {

    if (this.educationList.length >= 10) {
      this._commonService.flashMessage('warning', '', 'You can add 10 item in education');
      return;
    }

    this.modalService.open(addEdu, {
      windowClass: 'myCustomModalClass',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
      centered: true
    }).result.then((result) => {
      if (result == 'ADD') {
        this.addEducation(addEdu);
        return;
      }
      if (result == 'CANCEL') {
        this.educationalDetails.reset();
        this.education_step = false;
        // this.educationalDetails.markAsUntouched();
        return;
      }
    }, (reason) => {
    });
  }

  addEducation(addEdu) {

    this.education_step = true;
    if (this.educationalDetails.invalid) {
      this.onAddEducation(addEdu);
      return;
    }

    const {institute, degree, percentage, pass_out_year} = this.educationalDetails.value;
    let temp = {};
    temp['institute'] = institute;
    temp['degree'] = degree;
    temp['percentage'] = percentage;
    temp['pass_out_year'] = pass_out_year;
    this.educationList.unshift(temp);
    this.educationalDetails.reset();
    this.education_step = false;
  }

  onAddExperience(addExp) {

    if (this.experienceList >= 10) {
      this._commonService.flashMessage('warning', '', 'You can add 10 item in experience');
      return;
    }

    this.modalService.open(addExp, {
      windowClass: 'myCustomModalClass',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
      centered: true
    }).result.then((result) => {
      if (result == 'ADD') {
        this.addExperience(addExp);
        return;
      }

      if (result == 'CANCEL') {
        this.experienceDetails.reset();
        this.experience_step = false;

        return;
      }
    }, (reason) => {
    });
  }

  addExperience(addExp) {

    this.experience_step = true;
    if (this.experienceDetails.invalid) {
      this.onAddExperience(addExp);
      return;
    }

    const {company, project, role, team_size, duration_from, duration_to} = this.experienceDetails.value;
    let temp = {};
    temp['company'] = company;
    temp['project'] = project;
    temp['role'] = role;
    temp['team_size'] = team_size;
    temp['duration_from'] = duration_from;
    temp['duration_to'] = duration_to;
    this.experienceList.unshift(temp);
    this.experienceDetails.reset();
    this.experience_step = false;
  }

  deleteListItem(listName, i) {
    this[listName].splice(i, 1);
  }

}
