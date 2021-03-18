import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import Immutable from 'immutable';
import { Table, Card, Button, Message, Form } from 'semantic-ui-react';

import {
    ContentWrapper,
    TableWrapper,
    DirectText,
} from './style';

class ApprovalRequests extends Component {

    componentDidMount() {
        console.log('a')
        this.props.getSubunitRequests(this.props.unit, this.props.subunit);
    }

    displayDetail() {
        const { detailRequest, detailId, backToRequests, approvalRequest, declineRequest,
            unit, subunit, showApprovedMessage } = this.props;
        if (detailId !== '') {
            const detail = Immutable.List(detailRequest).toJS()[0];
            // console.log(detail);
            return (
                <Fragment>
                    <Card className='card'>
                        <Card.Content>
                            <Card.Header>{detail.unitName}, {detail.subunitName} - {detail.formType}</Card.Header>
                            <Card.Meta>
                                <div className='date'>{detail.createdTime}</div>
                                <div className='date'>{detail.approvalStatus}</div>
                            </Card.Meta>
                            <Card.Description>
                                <div><b>Legal First Name</b>: {detail.legalFirstName}</div>
                                <div><b>Legal Last Name</b>: {detail.legalLastName}</div>
                                <div><b>Departure</b>: {detail.departure}</div>
                                <div><b>Destination</b>: {detail.destination}</div>
                                <div><b>Reason</b>: {detail.reason}</div>
                            </Card.Description>
                        </Card.Content>
                        { detail.declinedReason ? 
                            <Card.Content extra>
                                <div><b>Declined Reason</b>: {detail.declinedReason}</div>
                            </Card.Content> : null }
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button content='Approve' onClick={() => approvalRequest(detailId)} basic color='green' />
                                <Button content='Decline' onClick={() => declineRequest()} basic color='red' />
                            </div>
                        </Card.Content>
                    </Card>
                    { showApprovedMessage ? 
                        <Message className='approveMessage' header='Approved!' color='green' content='The request status has changed.'/>
                        : null}
                    { this.showDecline() }
                    <Button basic content='Back' labelPosition='left' icon='backward' color='violet' onClick={() => backToRequests(unit, subunit)} />
                </Fragment>
            );
        }
    }

    showDecline() {
        const { showDeclineMessageInputBox, updateReason, reason, sendDeclineMessage, detailId } = this.props;
        if (showDeclineMessageInputBox) {
            return (
                <Form className='declineMessage'> 
                    <Form.TextArea required label='Reason for decline this request' placeholder='No longer than 1000 characters' 
                        value={reason}
                        onChange={updateReason}/> 
                    <Button content='Reply' labelPosition='left' icon='edit' color='red' onClick={() => sendDeclineMessage(detailId, reason)}/>
                </Form>
            );
        } else {
            return null;
        }
    }

    displayTable() {
        const { requests, seeRequestDetail, detailId } = this.props;
        const allSubunitRequests = Immutable.List(requests).toJS();
        if (detailId === '') {
            return (
                <TableWrapper>
                    <Table sortable celled fixed>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    Form Creator
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Form Type
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Created Time
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Status
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    Details
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {allSubunitRequests.map(({ id, formCreator, formType, createdTimePST, approvalStatus }) => (
                                <Table.Row key={id}>
                                    <Table.Cell>{formCreator}</Table.Cell>
                                    <Table.Cell>{formType}</Table.Cell>
                                    <Table.Cell>{createdTimePST}</Table.Cell>
                                    <Table.Cell>{approvalStatus}</Table.Cell>
                                    <Table.Cell><DirectText onClick={() => seeRequestDetail(id)}>detail</DirectText></Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </TableWrapper>
            );
        }
    }


    render() {
        if (this.props.login) {
            return (
                <ContentWrapper>
                    {this.displayTable()}
                    {this.displayDetail()}
                </ContentWrapper>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.getIn(['login', 'login']),
        unit: state.getIn(['login', 'user', 'unit']),
        subunit: state.getIn(['login', 'user', 'subunit']),
        requests: state.getIn(['approvalrequest', 'requests']),
        detailRequest: state.getIn(['approvalrequest', 'detailRequest']),
        detailId: state.getIn(['approvalrequest', 'detailId']),
        showApprovedMessage: state.getIn(['approvalrequest', 'showApprovedMessage']),
        showDeclineMessageInputBox: state.getIn(['approvalrequest', 'showDeclineMessageInputBox']),
        reason: state.getIn(['approvalrequest', 'reason']),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getSubunitRequests(unit, subunit) {
            dispatch(actionCreators.getSubunitRequests(unit, subunit));
        },
        seeRequestDetail(id) {
            dispatch(actionCreators.changeDetailId(id));
        },
        backToRequests(unit, subunit) {
            dispatch(actionCreators.backToRequests());
            dispatch(actionCreators.getSubunitRequests(unit, subunit));
        }, 
        approvalRequest(detailId) {
            dispatch(actionCreators.approvalRequest(detailId));
        },
        declineRequest() {
            dispatch(actionCreators.showDeclineMessageInputBox());
            //dispatch(actionCreators.declineRequest(detailId));
        },
        updateReason(e) {
            dispatch(actionCreators.updateReasonAction(e.target.value));
        },
        sendDeclineMessage(detailId, reason) {
            dispatch(actionCreators.sendDeclineMessage(detailId, reason));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalRequests);