import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";


function NotificationDetails({ notification, onClose }: any) {
    const [notificationDetails, setNotification] = useState<any>({ hideButtons: true });

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