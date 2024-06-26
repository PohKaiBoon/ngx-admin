import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Observable } from "rxjs";
import { Mnemonic } from "../../@core/data/general-iota-model";
import { error } from "console";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: ["./auth-page.component.scss"],
})
export class AuthPageComponent implements OnInit {
  secondForm: UntypedFormGroup;
  thirdForm: UntypedFormGroup;
  apiUrl: string = "http://localhost:3000";
  generatedMnemonic: string[];
  mnemonicError: boolean = false;
  checked: boolean = false;
  showPassword: boolean = true;
  loadingLargeGroup: boolean = false;
  passwordValidated: boolean = false;
  hasApiError: boolean = false;
  hasApiErrorMessage: string = "";

  constructor(private fb: UntypedFormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.secondForm = this.fb.group(
      {
        accountName: ["", Validators.required],
        password: ["", Validators.required],
        password2: ["", Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    this.thirdForm = this.fb.group({
      thirdCtrl: ["", Validators.required],
    });

    this.generateMnemonic();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
    if (this.secondForm.invalid) {
      this.secondForm.setErrors({
        error: "Complete or correct the highlighted fields.",
      });
    } else {
      this.loadingLargeGroup = true;
      this.passwordValidated = true;
      this.createWallet();
    }
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  generateMnemonic() {
    this.http
      .get<Mnemonic>(this.apiUrl + "/api/v1/generateMnemonic")
      .subscribe({
        next: (data: Mnemonic) => {
          this.generatedMnemonic = data?.mnemonic;
          console.log(this.generatedMnemonic);
        },
        error: (err) => {
          this.mnemonicError = true;
          console.error("Error generating mnemonic:", err);
        },
      });
  }

  toggle(checked: boolean) {
    this.checked = checked;
  }

  getInputType() {
    if (this.showPassword) {
      return "text";
    }
    return "password";
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get("password");
    const password2 = control.get("password2");
    console.log(password.value, password2.value);

    return password && password2 && password.value === password2.value
      ? null
      : { error: "Passwords do not match." };
  };

  createWallet() {
    const modifiedFormValues = {
      accountName: this.secondForm.value.accountName,
      password: this.secondForm.value.password,
      passwordIsValidated: this.passwordValidated,
    };
    const headers = { "Content-Type": "application/json" };
    this.http
      .post(
        this.apiUrl + "/api/v1/createWallet",
        JSON.stringify({
          account: modifiedFormValues,
          mnemonic: this.generatedMnemonic,
        }),
        { headers }
      )
      .subscribe({
        next: (response) => {
          console.log("Form submitted successfully:", response);
          this.loadingLargeGroup = false;
          setTimeout(() => this.loadingLargeGroup = false, 5000);
          this.router.navigate(["/"]);
        },
        error: (err) => {
          this.loadingLargeGroup = false;
          this.hasApiError = true;
          this.hasApiErrorMessage = err?.error?.error;
          console.error("Error submitting form:", err);
        },
      });
  }
}
