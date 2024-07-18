import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BatchDetails } from "../../@core/data/batch-model";

@Component({
  selector: "ngx-track-trace",
  templateUrl: "./track-trace.component.html",
  styleUrls: ["./track-trace.component.scss"],
})
export class TrackTraceComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  batchDetails: BatchDetails;
  address: string;
  loadingLargeGroup: boolean = false;
  showErrorPage: boolean = false;
  apiUrl: string = "http://localhost:3000";

  traceabilityInfo = [];
  processerIsVerified: boolean = false;
  retailerIsVerified: boolean = false;
  retailerInfo = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.address = params?.address;
    });

    this.getHarvestDetails();
  }

  getHarvestDetails(): void {
    this.loadingLargeGroup = true;
    const url = `http://localhost:3000/api/v1/details`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append("address", this.address);

    this.http.get<BatchDetails>(url, { params: queryParams }).subscribe(
      (data: BatchDetails) => {
        this.batchDetails = data;

        if (data.traceabilityInfo.length > 0) {
          data.traceabilityInfo.forEach((element) => {
            let vc = element.vcString;
            let issuer = element.issuer;
            const headers = { "Content-Type": "application/json" };
            this.http
              .post(
                this.apiUrl + "/api/v1/verifyCredential",
                JSON.stringify({
                  issuerDid: `did:iota:snd:${issuer}`,
                  credentialJwt: vc,
                }),
                { headers }
              )
              .subscribe({
                next: (response: any) => {
                  this.loadingLargeGroup = false;
                  this.processerIsVerified = true;
                  this.traceabilityInfo.push(response);
                },
                error: (err) => {
                  this.loadingLargeGroup = false;
                  this.showErrorPage = true;
                  console.log(err);
                },
              });
          });
        }
        if (data.retailerTraceabilityInfo.length > 0) {
          data.retailerTraceabilityInfo.forEach((element) => {
            let vc = element.vcString;
            let issuer = element.issuer;
            const headers = { "Content-Type": "application/json" };
            this.http
              .post(
                this.apiUrl + "/api/v1/verifyCredential",
                JSON.stringify({
                  issuerDid: `did:iota:snd:${issuer}`,
                  credentialJwt: vc,
                }),
                { headers }
              )
              .subscribe({
                next: (response: any) => {
                  this.loadingLargeGroup = false;
                  this.retailerIsVerified = true;
                  this.retailerInfo.push(response);
                },
                error: (err) => {
                  this.loadingLargeGroup = false;
                  this.showErrorPage = true;
                  console.log(err);
                },
              });
          });
        }
      },
      (error) => {
        console.error("Error fetching harvest details", error);
        this.showErrorPage = true;
      }
    );

    console.log(this.traceabilityInfo, this.retailerInfo);
  }
}
