import { renderUI, clearUI } from 'applicationRoot/renderUI';
import { store, getNewReducer } from 'applicationRoot/store';
import { createElement } from 'react';
import queryString from 'query-string';
import ajaxUtil from 'util/ajaxUtil';
import 'react-loadable';
import 'immutability-helper';

import {setDesktop, setMobile, setModule, setLoggedIn, setPublicInfo, setRequestDesktop, setIsTouch} from './applicationRoot/rootReducerActionCreators';
import 'util/ajaxUtil';

import createHistory from 'history/createBrowserHistory'

declare global {
  interface System {
    import (request: string): Promise<any>
  }
  var System: System
}


let currentModule;
let currentModuleObject;
let publicUserCache = {};

const history = createHistory()
export {history};


export function loadCurrentModule(){
    loadModule(history.location);
}

loadModule('books');
function loadModule(location) {
    let modulePromise = (() => {
        switch(location.toLowerCase()){
            case 'activate': return System.import(/* webpackChunkName: "small-modules" */ './modules/activate/activate');
            case 'authenticate': return System.import(/* webpackChunkName: "small-modules" */ './modules/authenticate/authenticate');
            case 'books': return System.import(/* webpackChunkName: "books-module" */ './modules/books/books');
            case 'home': return System.import(/* webpackChunkName: "home-module" */ './modules/home/home');
            case 'scan': return System.import(/* webpackChunkName: "scan-module" */ './modules/scan/scan');
            case 'subjects': return System.import(/* webpackChunkName: "subject-module" */ './modules/subjects/subjects');
            case 'settings': return System.import(/* webpackChunkName: "small-modules" */ './modules/settings/settings');
        }
    })();

    Promise.all([
        modulePromise
    ]).then(([{ default: moduleObject }]) => {
        renderUI(createElement(moduleObject.component));
    });
}

export function isLoggedIn(){
    let logged_in = getCookie('logged_in'),
        userId = getCookie('userId');
    return {logged_in, userId};
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}

export function goto(module, search?){
    if (currentModule !== module) {
        history.push({pathname: `/${module}`, search: search || undefined});
    }
}

export function getCurrentHistoryState(){
    let location = history.location;
    return {
        pathname: location.pathname,
        searchState: queryString.parse(location.search)
    };
}

export function setSearchValues(state){
    let {pathname, searchState: existingSearchState} = getCurrentHistoryState();
    let newState = {...existingSearchState, ...state};
    newState = Object.keys(newState).filter(k => newState[k]).reduce((hash, prop) => (hash[prop] = newState[prop], hash), {});

    history.push({
        pathname: history.location.pathname, 
        search: queryString.stringify(newState)
    });
}

function fetchPublicUserInfo(userId){
    return new Promise((res, rej) => {
        ajaxUtil.post('/user/getPubliclyAvailableUsersName', { _id: userId }, resp => {
            res({...resp})
        })
    });
}