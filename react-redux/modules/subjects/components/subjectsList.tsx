import React, {Component} from 'react';
import {connect} from 'react-redux';
import {editingSubjectHashSelector, pendingSubjectsSelector, draggingSubjectSelector} from 'modules/subjects/reducers/reducer';
import {subjectChildMapSelector, topLevelSubjectsSortedSelector, getChildSubjectsSorted} from 'applicationRoot/rootReducer';
import * as actionCreators from 'modules/subjects/reducers/actionCreators';
import BootstrapButton, {AjaxButton} from 'applicationRoot/components/bootstrapButton';
import ColorsPalette from 'applicationRoot/components/colorsPalette';
import { store } from 'applicationRoot/store';
import {subjectType} from 'modules/subjects/reducers/reducer';
import Dragula from 'react-dragula';

type dragLayerType = {
    item: any;
    currentOffset: {x: number, y: number};
    isDragging: boolean
};

type dropTargetType = {
    isOver: boolean;
    canDrop: boolean;
}

type subjectDisplayProps = {
    subject: subjectType & {candidateMove: boolean};
    subjectDraggingOver: any;
    noDrop: boolean;
};

@connect((state, ownProps) => {
    return {
        isCurrentDropTarget: state.subjectsModule.currentDropCandidateId == ownProps.subject._id
    }
}, { ...actionCreators })
class SubjectDisplay extends Component<subjectDisplayProps & {isCurrentDropTarget: boolean} & dropTargetType, any> {
    componentDidUpdate(prevProps){
        let wasOver = prevProps.isOver && prevProps.canDrop,
            isOver = this.props.isOver && this.props.canDrop,
            canDrop = this.props.canDrop,
            notOverAtAll = !this.props.isOver,
            {subject} = this.props,
            {_id} = subject;

        if (!wasOver && isOver){
            this.props.subjectDraggingOver(_id);
        } else if ((notOverAtAll || !canDrop) && this.props.isCurrentDropTarget){
            this.props.subjectDraggingOver(null);
        }
    }
    render(){
        let {subject} = this.props,
            {_id, candidateMove} = subject,
            pendingSubjectDrop = this.props.isOver && this.props.canDrop,
            style: any = {},
            noDrop = candidateMove || this.props.noDrop;

        if (candidateMove) {
            style.backgroundColor = 'lavender';
        }

        return (
            <li className={`list-group-item ${pendingSubjectDrop ? 'pending-subject-drop' : ''}`} key={_id} style={{...style, paddingTop: 0, paddingBottom: 0}}>
                <SubjectDisplayContent noDrop={noDrop} subject={subject} />
            </li>
        );
    }
}

@connect((state, ownProps) => {
    let subjectsModule = state.subjectsModule,
        editingSubjectsHash = subjectsModule.editingSubjectsHash,
        pendingDeleteHash = subjectsModule.pendingDeleteHash,
        deletingHash = subjectsModule.deletingHash,
        pendingSubjectsLookup = pendingSubjectsSelector(state),
        childSubjectsMap = subjectChildMapSelector(state),
        draggingSubject = draggingSubjectSelector(state),
        currentDropCandidateId = subjectsModule.currentDropCandidateId,
        subject = ownProps.subject,
        {_id} = subject,
        dropCandidateSubject = currentDropCandidateId == _id ? draggingSubject : null,
        subjectsSaving = state.subjectsModule.subjectsSaving,
        subjectsSaved = state.subjectsModule.subjectsSaved,
        {editingSubjectsHash: shapedEditingSubjectHash} = editingSubjectHashSelector(state);

    return {
        isEditingSubject: !!editingSubjectsHash[_id],
        isPendingDelete: pendingDeleteHash[_id],
        isDeleting: deletingHash[_id],
        isSubjectSaving: !!subjectsSaving[ownProps.subject._id],
        isSubjectSaved: !!subjectsSaved[ownProps.subject._id],
        pendingChildren: pendingSubjectsLookup[_id],
        childSubjects: childSubjectsMap[_id],
        dropCandidateSubject,
        editingSubject: shapedEditingSubjectHash[ownProps.subject._id],
        colors: state.app.colors
    }
}, {...actionCreators})
class SubjectDisplayContent extends Component<any, any> {
    render(){
        let {
                subject,
                noDrop,
                isPendingDelete,
                isDeleting,
                childSubjects = [],
                pendingChildren = [],
                isEditingSubject,
                dropCandidateSubject,
                isSubjectSaving,
                isSubjectSaved,
                editingSubject,
                colors
            } = this.props,
            effectiveChildren = pendingChildren.concat(childSubjects),
            deleteMessage = childSubjects.length ? 'Confirm - child subjects will also be deleted' : 'Confirm Delete';

        if (dropCandidateSubject){
            effectiveChildren.unshift(dropCandidateSubject);
        }

        let classToPass = 'row padding-top padding-bottom';
        return (
            <div>
                {isEditingSubject ? <EditingSubjectDisplay className={classToPass} subject={subject} isSubjectSaving={isSubjectSaving} editingSubject={editingSubject} colors={colors} /> :
                    isDeleting ? <DeletingSubjectDisplay className={classToPass} name={subject.name} /> :
                        isPendingDelete ? <PendingDeleteSubjectDisplay className={classToPass} subject={subject} deleteMessage={deleteMessage} /> :
                            <DefaultSubjectDisplay className={classToPass} subject={subject} noDrop={noDrop} isSubjectSaving={isSubjectSaving} isSubjectSaved={isSubjectSaved} />
                }

                {effectiveChildren.length ? <SubjectList noDrop={noDrop} style={{ marginTop: 0 }} subjects={effectiveChildren} /> : null}
            </div>
        )
    }
}

@connect(null, {...actionCreators})
class DefaultSubjectDisplay extends Component<any, any> {
    render(){
        let {isSubjectSaving, isSubjectSaved, className, subject, beginSubjectEdit, addNewSubject, beginSubjectDelete, noDrop} = this.props,
            {_id, name} = subject,
            mainIcon =
                isSubjectSaving ? <i className="fa fa-fw fa-spinner fa-spin"></i> :
                    isSubjectSaved ? <i style={{color: 'green'}} className="fa fa-fw fa-check"></i> :
                        <i className="fa fa-fw fa-arrows"></i>;

        return (
            <div className={className}>
                <div className="col-lg-12 show-on-hover-parent main-subject-display" >
                    {mainIcon}&nbsp;
                    {name}
                    {' '}
                    {!isSubjectSaving ? <a className="show-on-hover-inline inline-filter" onClick={() => beginSubjectEdit(_id)}><i className="fa fa-fw fa-pencil"></i></a> : null}
                    {!isSubjectSaving ? <a className="show-on-hover-inline inline-filter" onClick={() => addNewSubject(_id)}><i className="fa fa-fw fa-plus"></i></a> : null}
                    {!isSubjectSaving ? <a className="show-on-hover-inline inline-filter" onClick={() => beginSubjectDelete(_id)} style={{color: 'red', marginLeft: '20px'}}><i className="fa fa-fw fa-trash"></i></a> : null}
                </div>
            </div>
        );
    }
}

@connect(null, {...actionCreators})
class EditingSubjectDisplay extends Component<any, any> {
    inputEl: any;
    componentDidMount(){
        this.inputEl.focus();
    }
    subjectEditingKeyDown = evt => {
        let key = evt.keyCode || evt.which;
        if (key == 13){
            let {subject, editingSubject, saveChanges} = this.props;
            saveChanges(editingSubject, subject)
        }
    }
    render(){
        let {setEditingSubjectField, cancelSubjectEdit, isSubjectSaving, className, subject, editingSubject, saveChanges, colors} = this.props,
            {_id, name} = subject,
            textColors = ['#ffffff', '#000000'];
        let {validationError} = editingSubject;

        return (
            <div className={className}>
                <div className="col-xs-12 col-lg-3" style={{overflow: 'hidden'}}>
                    <input ref={el => this.inputEl = el} onKeyDown={this.subjectEditingKeyDown} onChange={(evt: any) => setEditingSubjectField(_id, 'name', evt.target.value)} value={editingSubject.name} className="form-control" />
                    <div className="label label-default" style={{ backgroundColor: editingSubject.backgroundColor, color: editingSubject.textColor, maxWidth: '100%', display: 'inline-block', overflow: 'hidden', marginTop: '5px' }}>{editingSubject.name || '<label preview>'}</div>
                    {subject.pending ? <br /> : null}
                    {subject.pending ? <span className="label label-warning" style={{marginTop: '5px', display: 'inline-block'}}>This subject is not saved</span> : null}
                    {validationError ? <br /> : null}
                    {validationError ? <span className="label label-danger">{validationError}</span> : null}
                </div>
                <div className="col-xs-12 col-lg-3 padding-bottom-small">
                    <select onChange={(evt: any) => setEditingSubjectField(_id, 'parentId', evt.target.value)} value={editingSubject.parentId || ''} className="form-control">
                        <option value={''}>No Parent</option>
                        {editingSubject.eligibleParents.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="col-xs-12 col-lg-4">
                    <ColorsPalette currentColor={editingSubject.backgroundColor} colors={colors} onColorChosen={color => setEditingSubjectField(_id, 'backgroundColor', color)} />
                </div>
                <div className="col-xs-12 col-lg-1 padding-bottom-small">
                    <ColorsPalette colors={textColors} onColorChosen={color => setEditingSubjectField(_id, 'textColor', color)} />
                </div>
                <div className="col-xs-12 col-lg-1">
                    <BootstrapButton disabled={isSubjectSaving} style={{marginRight: '5px'}} preset="primary-xs" onClick={() => saveChanges(editingSubject, subject)}><i className={`fa fa-fw ${isSubjectSaving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i></BootstrapButton>
                    <a onClick={() => cancelSubjectEdit(_id)}>Cancel</a>
                </div>
            </div>
        );
    }
}

@connect(null, {...actionCreators})
class PendingDeleteSubjectDisplay extends Component<typeof actionCreators & any, any> {
    render(){ 
        let {className, deleteMessage, deleteSubject, cancelSubjectDelete, subject} = this.props,
            {name, _id} = subject;
            
        return (
            <div className={className}>
                <div className="col-lg-12">
                    {name}
                    <BootstrapButton onClick={() => deleteSubject(_id)} style={{marginLeft: '20px'}} preset="danger-sm">{deleteMessage}</BootstrapButton>
                    <BootstrapButton onClick={() => cancelSubjectDelete(_id)} style={{marginLeft: '20px'}} preset="primary-sm">Cancel</BootstrapButton>
                </div>
            </div>
        );
    }
}

@connect(null, {...actionCreators})
class DeletingSubjectDisplay extends Component<any, any> {
    render(){
        let {name, className} = this.props;
        return (
            <div className={className}>
                <div className="col-lg-12">
                    {name}
                    <BootstrapButton preset="danger-xs" disabled={true} style={{marginLeft: '20px'}}>Deleting <i className="fa fa-fw fa-spinner fa-spin"></i></BootstrapButton>
                </div>
            </div>
        );
    }
}

class SubjectList extends Component<any, any> {
    render(){
        let {style = {}, noDrop} = this.props;

        let SD : any = SubjectDisplay;

        return (
            <ul className="list-group" style={{ marginBottom: '5px', ...style }} ref={this.dragulaDecorator}>
                {this.props.subjects.map(subject => <SD key={subject._id} noDrop={noDrop} subject={subject} />)}
            </ul>
        );
    }
    dragulaDecorator = (componentBackingInstance) => {
        if (componentBackingInstance) {
            let options = { };
            Dragula([componentBackingInstance], {
                direction: 'vertical',
                accepts: function (el, target, source, sibling) {
                    return false; // elements can be dropped in any of the `containers` by default
                },
                moves: function (el, source, handle, sibling) {
                    //return true;

                    if (handle.classList.contains('fa-arrows') && el.tagName == 'LI'){
                        return $(handle).closest('li')[0] === el;
                    } else {
                        return false;
                    }
                    //return false; // elements are always draggable by default
                },
                // invalid: function (el, handle) {
                //     let isMainSubject = el && el.classList && el.classList.contains('main-subject-display');
                //     console.log(!!isMainSubject);
                //     return !isMainSubject;
                //     //debugger;
                //     //return false; // don't prevent any drags from initiating by default
                // },
            });
        }
    };
}
let isTouch = store.getState().app.isTouch

type subjectsComponentPropsType = {
    topLevelSubjects: any, pendingSubjectsLookup: any, addNewSubject: any
}


@connect(state => {
    return {
        topLevelSubjects: topLevelSubjectsSortedSelector(state),
        pendingSubjectsLookup: pendingSubjectsSelector(state)
    };
}, { ...actionCreators })
export default class SubjectsComponent extends Component<subjectsComponentPropsType & typeof actionCreators, any>{
    render(){
        let {addNewSubject, pendingSubjectsLookup, topLevelSubjects} = this.props,
            rootPendingSubjects = pendingSubjectsLookup['root'] || [],
            allSubjects = [...rootPendingSubjects, ...topLevelSubjects];

        return (
            <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                <BootstrapButton onClick={() => addNewSubject()} preset="primary">New subject</BootstrapButton>
                <br />
                <br />
                <SubjectList subjects={allSubjects} />
            </div>
        )
    }
}