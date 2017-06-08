import {BooksModuleType, appType, booksType, bookSearchType, booksSubjectMofificationType, booksTagModificationType, editBookType, subjectsType, tagsType} from 'modules/books/reducers/reducer';

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import GV from './bookViewList-grid';
const GridView : any = GV;

import BLV from './bookViewList-basicList';
const BasicListView : any = BLV;

import BMB from './booksMenuBar';
const BooksMenuBar : any = BMB;

import * as actionCreatorsEditBook from '../reducers/editBook/actionCreators';
import * as actionCreatorsSearch from '../reducers/bookSearch/actionCreators';
import Loading from 'applicationRoot/components/loading';
import Loadable from 'react-loadable';

import {booksListType, selectBookList} from '../reducers/books/reducer';
import {selectModifyingBooks as subjectsBooksModifyingSelector, modifyingBooksType as subjectsBooksModifyingType} from '../reducers/booksSubjectModification/reducer';
import {selectModifyingBooks as tagsBooksModifyingSelector, modifyingBooksType as tagsBooksModifyingType} from '../reducers/booksTagModification/reducer';
import {selectBookSearchUiView, bookSearchUiViewType} from '../reducers/bookSearch/reducer';

import ComponentLoading from 'applicationRoot/components/componentLoading';

const ManualBookEntry = Loadable({
    loader: () => System.import('applicationRoot/components/manualBookEntry'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const BookSubjectSetter = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './bookSubjectSetter'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const BookTagSetter = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './bookTagSetter'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const SubjectEditModal = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './subjectEditModal'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const TagEditModal = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './tagEditModal'),
    LoadingComponent: ComponentLoading,
    delay: 500
});

const BookSearchModal = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './bookSearchModal'),
    LoadingComponent: ComponentLoading,
    delay: 500
});


export default class BookViewingList extends Component<any, any> {
    render() {
        return (
            <div style={{position: 'relative'}}>
                <h1>HELLO</h1>
            </div>
        );
    }
}