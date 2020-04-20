import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  companies = ["Northrop Grumman", "Apple", "Google", "Anthem",
  "Cisco", "General Electric", "ASUS", "Tencent", "Microsoft", "Acer", "National Aeronautics and Space Administration"];
  curPage = 0;

  constructor(public dialog: MatDialog) {

  }

  ngOnInit(): void {
  }

  openDialog(company: String): void {
    const dialogRef = this.dialog.open(StudentComponentDialog, {
      width: '250px',
      data: company
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  pages(): any {
    while (this.companies.length % 9 != 0){
      //Fill empty slots so that the table looks the same
      this.companies.push("")
    }
    return Array(this.companies.length/9)
  }

  paginate(page: number): void{
    if (page < 0){
      page = 0
    }
    if (page > (this.companies.length/9)-1){
      page = (this.companies.length/9)-1
    }
    this.curPage = page
  }

}
@Component({
  selector: 'app-student-dialog',
  templateUrl: 'app-student-dialog.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponentDialog {

  submitted = false

  constructor(public dialogRef: MatDialogRef<StudentComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  validateNumber() {
    var obj = <HTMLInputElement>document.getElementById("txtStudentID");
    var start = obj.value.indexOf('9');

    if (start != -1 && obj.value.length >= 9) {
        obj.value = obj.value.substring(start, start + 9);
        return true;
    } else {
        return false;
    }
  }

  submit(event: Event){
    event.preventDefault();
    if (!this.validateNumber()){
      alert('The value you have entered is invalid.');
      return;
    }
    var id = (<HTMLInputElement>document.getElementById("txtStudentID")).value;
    var company = this.data
    //TODO
    this.submitted = true
  }
}
