import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../model/user';
import {AuthService} from '../../auth/service/auth.service';
import {GenderService} from '../../core/data-service/gender.service';
import {CustomValidators} from 'ng2-validation';
import {CityService} from '../../core/data-service/city.service';
import {Neighborhood} from '../../model/neighborhood';
import {Address} from '../../model/address';
import {City} from '../../model/city';

@Component({
  selector: 'utfpr-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  genders$;
  cities$;
  neighborhoods$;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private genderService: GenderService,
              private cityService: CityService) {
  }

  ngOnInit() {
    this.genders$ = this.genderService.all();
    this.cities$ = this.cityService.all();
    this.buildForm();
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.signUp(this.mountModel()).subscribe(res => {
        JSON.stringify(res, null, 3);
      });
    }
  }

  onCityChose(city: City) {
    console.log(JSON.stringify(city, null, 3));
    this.neighborhoods$ = this.cityService.neighborhoods(city);
  }

  private resetForm(): void {
    this.form.reset();
  }

  private mountModel(): User {
    const model = new User();
    model.name = this.form.value.name;
    model.gender = this.form.value.gender;
    model.dateOfBirth = this.form.value.dateOfBirth;
    model.password = this.form.value.password;
    model.email = this.form.value.email;
    model.address = new Address();
    model.address.neighborhood = new Neighborhood();
    model.address.neighborhood = this.form.value.neighborhood;
    return model;
  }

  private buildForm(): void {
    const pwd = new FormControl('', Validators.required);
    const certainPassword = new FormControl('', [
      CustomValidators.equalTo(pwd),
      Validators.required
    ]);

    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      city: [null, Validators.required],
      neighborhood: [null, Validators.required],
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      gender: [null, Validators.required],
      dateOfBirth: [null, [
        Validators.required
      ]],
      password: pwd,
      confirmPassword: certainPassword,
    });
  }
}
