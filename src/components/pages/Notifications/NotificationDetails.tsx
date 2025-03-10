import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useUpdateNotificationStatus } from "../../../backend/masters";
import { NotificationStatus } from "./NotificationCard";
import { API_RESULT } from "../../../utils/constants";


function NotificationDetails({ notification, onClose, onSubmit }: any) {
    const { id, notifyStatus } = notification || {};
    const { data, isFetching } = useUpdateNotificationStatus({ notificationId: id, statusflag: 'Read' }, Boolean(id && notifyStatus === NotificationStatus.UNREAD));
    useEffect(() => {
        if (!isFetching && data) {
            const {key} = data;
            if (key === API_RESULT.SUCCESS) {
                onSubmit();
            }
        }
    }, [isFetching])

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{notification.subject}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column">
                        <div dangerouslySetInnerHTML={{ __html: notification.mailBody || '--NA--' }}></div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default NotificationDetails;