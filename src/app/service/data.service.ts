import { Injectable } from '@angular/core';
import { startOfWeek, getDay, isValid, nextMonday, isFriday, isWeekend } from 'date-fns';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  constructor() { }

  getFirstDayOfWeek(date: Date): Date{
    return startOfWeek(date, {weekStartsOn: 1});
  }

  getDayOfWeek(date: Date){
    return getDay(date);
  }

  isValidDate(date): boolean{
    return isValid(date);
  }

  convertDateToString(date: Date): string{
    return (date.getDate().toString() + this.months[date.getMonth()] + date.getFullYear().toString());
  }

  getNextMonday(){
    return this.convertDateToString(nextMonday(new Date()));
  }

  isAbleToSubmit(date: Date){
    return (isFriday(date) || isWeekend(date));
  }
}
