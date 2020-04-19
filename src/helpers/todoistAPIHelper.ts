import * as vscode from 'vscode';
import axios from 'axios';
import settingsHelper from './settingsHelper';
import project from '../models/project';
import task from '../models/task';

export default class todoistAPIHelper {

    private todoistAPIUrl: String = 'https://api.todoist.com/rest/v1/';
    private apiToken: String;
    private state: vscode.Memento;

    constructor(context: vscode.Memento) {
        this.apiToken = settingsHelper.getTodoistAPIToken(context)!;
        this.state = context;
    }

    public getProjects(): Promise<project[]> {
        const url = this.todoistAPIUrl;
        const jwt = this.apiToken;
        let state = this.state;

        return new Promise(function (resolve, reject) {
            axios.get(encodeURI(url + 'projects'), {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }).then(response => {
                if (response.status === 200) {
                    let projects: project[] = [];
                    response.data.forEach((element: any) => {
                        projects.push(project.deserialize(element));
                    });
                    let data = settingsHelper.getTodoistData(state);
                    data.projects = projects;
                    settingsHelper.setTodoistData(state, data);
                    resolve(projects);
                }
                else {
                    reject(Error(response.statusText))
                }
            }).catch(error => {
                reject(Error(error));
            });
        });
    }

    public getActiveTasks(): Promise<task[]> {
        const url = this.todoistAPIUrl;
        const jwt = this.apiToken;
        let state = this.state;

        return new Promise(function (resolve, reject) {
            axios.get(encodeURI(url + 'tasks'), {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }).then(response => {
                if (response.status === 200) {
                    let tasks: task[] = [];
                    response.data.forEach((element: any) => {
                        tasks.push(task.deserialize(element));
                    });
                    let data = settingsHelper.getTodoistData(state);
                    data.tasks = tasks;
                    settingsHelper.setTodoistData(state, data);
                    resolve(tasks);
                }
                else {
                    reject(Error(response.statusText))
                }
            }).catch(error => {
                reject(Error(error));
            });
        });
    }
}