import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
//import { ChilddetailComponent } from '@components/childdetail/childdetail';
import { ChilddetailComponent } from "@core/courses/components/childdetail/childdetail";

import { CoreSitesProvider } from '@providers/sites';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { child } from './child.model';


/**
 * Generated class for the MychildrenComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mychildren',
  templateUrl: 'mychildren.html'
})
export class MychildrenComponent {

  text: string;
  errorMessage: any;
  loading: boolean;
  children: child[] = [];

  constructor(
    private navCtrl: NavController,
    private sitesProvider: CoreSitesProvider,
    private http: HttpClient
    ) {
    console.log('Hello MychildrenComponent Component');
    this.text = 'Hello World';
  }

  ngOnInit(): void {
    this.get_children();
  }

  openChildDetail(child: child){
    this.navCtrl.push(ChilddetailComponent, {child: child});
  }

  async get_children(){
    this.get_children_data().subscribe(
      (response) => {   
        debugger;
        var json = JSON.parse(response);                        //next() callback

      

      for(var child_key in json){
        if(json.hasOwnProperty(child_key)){
            debugger;
            var child_obj: child = {
              child_email: json[child_key]['child_email'],
              child_id: json[child_key]['child_id'],
              child_image_url:  this.check_image_URL(json[child_key]['child_image_url']),
              child_name: json[child_key]['child_name'],
              child_courses_ids: "",
              child_courses: []
            }
            let child_courses_ids = [];
            for(var child_course_key in json[child_key]['child_courses']){
              child_obj.child_courses.push(
                {
                  id: json[child_key]['child_courses'][child_course_key]['id'],
                  course_image_url: "",
                  name:json[child_key]['child_courses'][child_course_key]['name'],
                }
              )
              child_courses_ids.push(json[child_key]['child_courses'][child_course_key]['id'])
            }

            child_obj.child_courses_ids = child_courses_ids.toString();
            console.log("Course Ids: ", child_obj.child_courses_ids);
            this.children.push(child_obj);
        }
      }


        console.log(json)
      },
      (error) => {                              //error() callback
        console.error('Request failed with error')
        this.errorMessage = error;
        this.loading = false;
      },
      () => {                                   //complete() callback
        console.error('Request completed')      //This is actually not needed 
        this.loading = false; 
      }
    )
  }

  get_children_data(): Observable<any>{
    let userid = this.sitesProvider.getCurrentSiteUserId();;
    let url = `https://national.future-schools.co/webservice/rest/server.php?wstoken=6cfa7f60bf579ba0d59b779bad638364&wsfunction=get_child&moodlewsrestformat=json&parentid=${userid}`
    return this.http.get(url);
  }

   check_image_URL(url: string) : string{
      var image_url = "";
      if(url.match(/\.(jpeg|jpg|gif|png)$/) != null){
        image_url = url;
      }
      else{
        image_url = "https://ionicframework.com/docs/demos/api/avatar/avatar.svg";
      }

      return image_url;
  }

}
