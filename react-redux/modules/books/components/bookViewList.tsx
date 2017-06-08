

import React, {Component} from 'react';

import Loadable from 'react-loadable';


const ManualBookEntry = Loadable({
    loader: () => System.import('applicationRoot/components/manualBookEntry'),
    LoadingComponent: <div />,
    delay: 500
});

const BookSubjectSetter = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './bookSubjectSetter'),
    LoadingComponent: <div />,
    delay: 500
});

const BookTagSetter = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './bookTagSetter'),
    LoadingComponent: <div />,
    delay: 500
});

const SubjectEditModal = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './subjectEditModal'),
    LoadingComponent: <div />,
    delay: 500
});

const TagEditModal = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './tagEditModal'),
    LoadingComponent: <div />,
    delay: 500
});

const BookSearchModal = Loadable({
    loader: () => System.import(/* webpackChunkName: "book-list-modals" */ './bookSearchModal'),
    LoadingComponent: <div />,
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