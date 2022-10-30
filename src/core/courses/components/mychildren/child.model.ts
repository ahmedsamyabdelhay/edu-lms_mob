import { child_course } from './child_courses.model';

export class child {
    child_email: string;
    child_id: string;
    child_image_url: string;
    child_name: string;
    child_courses_ids: string;
    child_courses: child_course[];
    child_report_link: string;
}