import { Component, computed, effect,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  

  tasks= signal<Task[]>([]);

  

  newTaskControl=new FormControl('',{
    nonNullable: true,
    validators:[
      Validators.required,
      Validators.minLength(5),
     
      
    ]
  });

  addTasks(){
    if (this.newTaskControl.valid && this.newTaskControl.value.trim().length>0) {
      const value=this.newTaskControl.value;
      this.addTarea(value);
      this.newTaskControl.setValue('');
    }
    
  }

  addTarea(title:string){
    const newtask:Task={
      id:Date.now(),
      title,
      completed:false,
      
    };
    this.tasks.update((task) => [... task , newtask]);
  }

  deleteTaskCompleted(){
    this.tasks.update((tasks)=> tasks.filter((task,position)=> !task.completed));
    console.log(this.tasks());
  }

  deleteTask(index: number){
    this.tasks.update((tasks)=> tasks.filter((task,position)=> position!== index));
    console.log(this.tasks());
  }

  updateTask(index:number){
    this.tasks.update((tasks) => {
        return tasks.map((task2,position)=>{
          if(position===index){
              return{
                ...task2,
                completed:!task2.completed
              }
          } 
          return task2
        });

    })
  }


  editTask(index:number){
    this.tasks.update((task3) => {
      return task3.map((task3,position)=>{
        if(position===index){
            return{
              ...task3,
              editing:true
            
            }
        } 
        return {
          ...task3,
          editing:false
        }
      });

    })

  }

  editSaveTask(index:number,event:Event){
    let input =event.target as HTMLInputElement;

    this.tasks.update(taskprev => {
      return taskprev.map((task4,position)=>{
        if(position===index){
            return{
              ...task4,
              title:input.value,
              editing:false
            }
        } 
        return task4;
      })

    });

  }

  filter=signal<'all'|'pednin'|'completed'>('all');
  
  tasksByFilter=computed(()=>{
    const filter=this.filter();
    const tasks=this.tasks();
    if(filter=='pednin'){
      return tasks.filter(task=>!task.completed)
    }
    if(filter=='completed'){
      return tasks.filter(task=>task.completed)
    }
    return tasks;

  });

  changeFilter(filter:'all'|'pednin'|'completed'){
    this.filter.set(filter);
  }

  constructor(){
    effect(()=>{
      const tasks=this.tasks();
      console.log(tasks);
      localStorage.setItem('tasks',JSON.stringify(tasks))
    })
  }
  ngOnInit(){
    const storage=localStorage.getItem('tasks');
    if (storage) {
      const tasks=JSON.parse(storage);
      this.tasks.set(tasks);
    }
  }
}
